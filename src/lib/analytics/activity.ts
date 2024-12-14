import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc,
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  getDocs
} from 'firebase/firestore';
import { ActivityLog } from './types';

export const logActivity = async (title: string, description: string, type: ActivityLog['type']) => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No user found, skipping activity logging');
    return;
  }

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
): Unsubscribe => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No user found, returning empty activity list');
    callback([]);
    return () => {};
  }

  try {
    const q = query(
      collection(db, 'activity_logs'),
      orderBy('timestamp', 'desc'),
      limit(limit_)
    );

    // Initial fetch to prevent stream locking
    getDocs(q).then((snapshot) => {
      const activities = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data()
        } as ActivityLog))
        .filter((activity): activity is ActivityLog => 
          activity !== null && 
          activity.timestamp !== null
        );
      callback(activities);
    }).catch((error) => {
      console.error('Error fetching initial activities:', error);
      callback([]);
    });

    // Set up real-time updates with error handling
    return onSnapshot(
      q, 
      {
        next: (snapshot) => {
          const activities = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data()
            } as ActivityLog))
            .filter((activity): activity is ActivityLog => 
              activity !== null && 
              activity.timestamp !== null
            );
          callback(activities);
        },
        error: (error) => {
          console.error('Error in activity subscription:', error);
          callback([]);
        }
      }
    );
  } catch (error) {
    console.error('Error setting up activity subscription:', error);
    callback([]);
    return () => {};
  }
};