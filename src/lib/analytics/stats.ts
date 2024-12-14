import { auth, db } from "@/lib/firebase";
import { 
  doc,
  updateDoc,
  increment,
  setDoc,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { AnalyticsStat } from './types';

let cleanupPromise: Promise<void> | null = null;

const updateActiveUsers = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const analyticsRef = doc(db, 'analytics', 'stats');
  const userRef = doc(db, 'users', user.uid);

  try {
    await setDoc(userRef, {
      lastActive: Timestamp.now(),
      email: user.email,
    }, { merge: true });

    await updateDoc(analyticsRef, {
      activeUsers: increment(1),
      activeSessions: increment(1),
    });

    // Setup cleanup
    cleanupPromise = new Promise<void>((resolve) => {
      const cleanup = async () => {
        try {
          await updateDoc(analyticsRef, {
            activeUsers: increment(-1),
            activeSessions: increment(-1),
          });
          resolve();
        } catch (error) {
          console.error('Error updating active users on cleanup:', error);
          resolve();
        }
      };

      window.addEventListener('beforeunload', cleanup);
    });

  } catch (error) {
    console.error('Error updating active users:', error);
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
    updateActiveUsers();

    const analyticsRef = doc(db, 'analytics', 'stats');
    
    const unsubscribe = onSnapshot(analyticsRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as AnalyticsStat;
          callback(data);
        } else {
          const initialData: AnalyticsStat = {
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
      unsubscribe();
      if (cleanupPromise) {
        cleanupPromise.then(() => {
          console.log('Analytics cleanup completed');
        });
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