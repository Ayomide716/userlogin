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

    return unsubscribe;
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