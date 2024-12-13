import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  Timestamp, 
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  DocumentData
} from 'firebase/firestore';

export interface ActivityLog {
  id: string;
  userId: string;
  title: string;
  description: string;
  timestamp: Timestamp;
  type: 'user' | 'activity' | 'calendar';
}

export interface AnalyticsStat {
  revenue: number;
  activeUsers: number;
  activeSessions: number;
  conversionRate: number;
  timestamp: Timestamp;
}

const updateActiveUsers = async () => {
  const analyticsRef = doc(db, 'analytics', 'stats');
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      lastActive: serverTimestamp(),
      email: user.email,
    }, { merge: true });

    await updateDoc(analyticsRef, {
      activeUsers: increment(1),
      activeSessions: increment(1),
    });

    // Cleanup on window close
    window.addEventListener('beforeunload', async () => {
      try {
        await updateDoc(analyticsRef, {
          activeUsers: increment(-1),
          activeSessions: increment(-1),
        });
      } catch (error) {
        console.error('Error updating active users on cleanup:', error);
      }
    });
  } catch (error) {
    console.error('Error updating active users:', error);
  }
};

export const logActivity = async (title: string, description: string, type: ActivityLog['type']) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const activityData = {
      userId: user.uid,
      title,
      description,
      type,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, 'activity_logs'), activityData);
    console.log('Activity logged successfully:', title);
    
    // Update analytics
    await updateActiveUsers();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const subscribeToActivityLogs = (
  callback: (activities: ActivityLog[]) => void,
  limit_: number = 5
) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'activity_logs'),
      orderBy('timestamp', 'desc'),
      limit(limit_)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const activities = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ActivityLog));
        callback(activities);
      },
      (error) => {
        console.error('Error subscribing to activity logs:', error);
        callback([]);
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from activity logs:', error);
      }
    };
  } catch (error) {
    console.error('Error setting up activity logs subscription:', error);
    callback([]);
    return () => {};
  }
};

export const subscribeToAnalytics = (callback: (stats: AnalyticsStat) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback({
      revenue: 0,
      activeUsers: 0,
      activeSessions: 0,
      conversionRate: 0,
      timestamp: Timestamp.now(),
    });
    return () => {};
  }

  try {
    // Update active users when subscribing
    updateActiveUsers();

    const analyticsRef = doc(db, 'analytics', 'stats');
    
    const unsubscribe = onSnapshot(analyticsRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as AnalyticsStat;
          callback(data);
        } else {
          // Initialize analytics document if it doesn't exist
          const initialData = {
            revenue: 0,
            activeUsers: 1,
            activeSessions: 1,
            conversionRate: 0,
            timestamp: Timestamp.now(),
          };
          await setDoc(analyticsRef, initialData);
          callback(initialData);
        }
      },
      (error) => {
        console.error('Error subscribing to analytics:', error);
        callback({
          revenue: 0,
          activeUsers: 0,
          activeSessions: 0,
          conversionRate: 0,
          timestamp: Timestamp.now(),
        });
      }
    );

    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error unsubscribing from analytics:', error);
      }
    };
  } catch (error) {
    console.error('Error setting up analytics subscription:', error);
    callback({
      revenue: 0,
      activeUsers: 0,
      activeSessions: 0,
      conversionRate: 0,
      timestamp: Timestamp.now(),
    });
    return () => {};
  }
};