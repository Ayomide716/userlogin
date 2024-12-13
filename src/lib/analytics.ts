import { auth, db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, limit, onSnapshot, Timestamp, serverTimestamp } from 'firebase/firestore';

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
    await addDoc(collection(db, 'activity_logs'), {
      userId: user.uid,
      title,
      description,
      type,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const subscribeToActivityLogs = (
  callback: (activities: ActivityLog[]) => void,
  limit_: number = 5
) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const q = query(
    collection(db, 'activity_logs'),
    orderBy('timestamp', 'desc'),
    limit(limit_)
  );

  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as ActivityLog));
    callback(activities);
  });
};

export const subscribeToAnalytics = (callback: (stats: AnalyticsStat) => void) => {
  const user = auth.currentUser;
  if (!user) return () => {};

  const q = query(
    collection(db, 'analytics'),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback(snapshot.docs[0].data() as AnalyticsStat);
    }
  });
};