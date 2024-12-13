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
    const q = query(
      collection(db, 'analytics'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as AnalyticsStat;
          callback(data);
        } else {
          callback({
            revenue: 0,
            activeUsers: 0,
            activeSessions: 0,
            conversionRate: 0,
            timestamp: Timestamp.now(),
          });
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