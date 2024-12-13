import { Timestamp } from 'firebase/firestore';

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