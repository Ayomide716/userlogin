import { Activity, ArrowRight, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { ActivityLog, subscribeToActivityLogs } from "@/lib/analytics";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";
import { subscriptionManager } from "@/lib/analytics/subscriptionManager";

const icons = {
  user: User,
  activity: Activity,
  calendar: Calendar,
};

interface RecentActivityProps {
  extended?: boolean;
}

export function RecentActivity({ extended = false }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const subscriptionId = `recentActivity-${extended ? 'extended' : 'normal'}`;

  useEffect(() => {
    const user = auth.currentUser;
    
    if (!user) {
      console.log('No user found, skipping activity subscription');
      setIsLoading(false);
      return;
    }

    if (!subscriptionManager.isSubscriptionActive(subscriptionId)) {
      try {
        const unsubscribe = subscribeToActivityLogs(
          (newActivities) => {
            const validActivities = newActivities.filter(activity => 
              activity && activity.timestamp && 
              typeof activity.timestamp.toDate === 'function'
            );
            
            setActivities(validActivities);
            setIsLoading(false);
          },
          extended ? 10 : 5
        );

        subscriptionManager.addSubscription(subscriptionId, unsubscribe);
      } catch (error) {
        console.error('Error setting up activity logs subscription:', error);
        toast.error('Error connecting to activity service');
        setIsLoading(false);
      }
    }
    
    return () => {
      subscriptionManager.cleanupSubscription(subscriptionId);
    };
  }, [extended, subscriptionId]);

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') {
      return 'Just now';
    }
    try {
      return timestamp.toDate().toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Recently';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading activities...</div>;
  }

  if (!activities.length) {
    return <div className="text-center text-muted-foreground p-4">No recent activities</div>;
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => {
        const Icon = icons[activity.type] || Activity;

        return (
          <div key={activity.id} className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/10 bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.title}</p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
          </div>
        );
      })}
    </div>
  );
}