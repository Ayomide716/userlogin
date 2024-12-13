import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc,
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { ActivityLog } from './types';

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
        const activities = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            // Handle null timestamp
            if (!data.timestamp) {
              console.warn('Activity log missing timestamp:', doc.id);
              return null;
            }
            return {
              id: doc.id,
              ...data,
            } as ActivityLog;
          })
          .filter((activity): activity is ActivityLog => activity !== null);
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