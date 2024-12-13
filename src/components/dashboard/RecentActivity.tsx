import { Activity, ArrowRight, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { ActivityLog, subscribeToActivityLogs } from "@/lib/analytics";

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

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = subscribeToActivityLogs(
      (newActivities) => {
        setActivities(newActivities);
      },
      extended ? 10 : 5
    );

    return () => unsubscribe();
  }, [extended]);

  return (
    <div className="space-y-8">
      {activities.map((activity) => {
        const Icon = icons[activity.type];
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
                {activity.timestamp.toDate().toLocaleString()}
              </p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
          </div>
        );
      })}
    </div>
  );
}