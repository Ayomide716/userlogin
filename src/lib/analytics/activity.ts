import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  addDoc,
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { ActivityLog } from './types';

let activeSubscription: Unsubscribe | null = null;

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
) => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No user found, returning empty activity list');
    callback([]);
    return () => {};
  }

  try {
    // Clean up any existing subscription
    if (activeSubscription) {
      console.log('Cleaning up existing activity subscription');
      activeSubscription();
      activeSubscription = null;
    }

    const q = query(
      collection(db, 'activity_logs'),
      orderBy('timestamp', 'desc'),
      limit(limit_)
    );

    console.log('Setting up new activity subscription');
    activeSubscription = onSnapshot(q, 
      (snapshot) => {
        const activities = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
            } as ActivityLog;
          })
          .filter((activity): activity is ActivityLog => 
            activity !== null && 
            activity.timestamp !== null &&
            typeof activity.timestamp === 'object'
          );
        callback(activities);
      },
      (error) => {
        console.error('Error in activity subscription:', error);
        callback([]);
      }
    );

    return () => {
      if (activeSubscription) {
        console.log('Cleaning up activity subscription');
        activeSubscription();
        activeSubscription = null;
      }
    };
  } catch (error) {
    console.error('Error setting up activity subscription:', error);
    callback([]);
    return () => {};
  }
};