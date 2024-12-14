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

const initialData: AnalyticsStat = {
  revenue: 0,
  activeUsers: 0,
  activeSessions: 0,
  conversionRate: 0,
  timestamp: Timestamp.now(),
};

export const subscribeToAnalytics = (callback: (stats: AnalyticsStat) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback(initialData);
    return () => {};
  }

  try {
    const analyticsRef = doc(db, 'analytics', 'stats');
    
    return onSnapshot(
      analyticsRef,
      {
        next: (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as AnalyticsStat;
            callback({
              revenue: data.revenue || 0,
              activeUsers: data.activeUsers || 0,
              activeSessions: data.activeSessions || 0,
              conversionRate: data.conversionRate || 0,
              timestamp: data.timestamp || Timestamp.now(),
            });
          } else {
            setDoc(analyticsRef, initialData)
              .then(() => callback(initialData))
              .catch(console.error);
          }
        },
        error: (error) => {
          console.error('Error subscribing to analytics:', error);
          callback(initialData);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up analytics subscription:', error);
    callback(initialData);
    return () => {};
  }
};