import { Activity, ArrowRight, Calendar, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { auth } from "@/lib/firebase";
import { ActivityLog, subscribeToActivityLogs } from "@/lib/analytics";
import { Timestamp } from "firebase/firestore";
import { toast } from "sonner";

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
  const subscriptionRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log('No user found, skipping activity subscription');
      return;
    }

    let isMounted = true;

    const setupSubscription = async () => {
      try {
        // Clean up any existing subscription
        if (subscriptionRef.current) {
          subscriptionRef.current();
          subscriptionRef.current = null;
        }

        // Set up new subscription
        const unsubscribe = subscribeToActivityLogs(
          (newActivities) => {
            if (!isMounted) return;

            try {
              const validActivities = newActivities.filter(activity => 
                activity && activity.timestamp && 
                typeof activity.timestamp.toDate === 'function'
              );
              
              setActivities(validActivities);
            } catch (error) {
              console.error('Error processing activities:', error);
              if (isMounted) {
                toast.error('Error loading recent activities');
              }
            }
          },
          extended ? 10 : 5
        );

        subscriptionRef.current = unsubscribe;
      } catch (error) {
        console.error('Error setting up activity logs subscription:', error);
        if (isMounted) {
          toast.error('Error connecting to activity service');
        }
      }
    };

    setupSubscription();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [extended]);

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