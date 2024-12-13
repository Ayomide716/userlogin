import { Activity, ArrowRight, Calendar, User } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

interface Activity {
  id: number;
  title: string;
  description: string;
  timestamp: Date;
  icon: keyof typeof icons;
}

const icons = {
  activity: Activity,
  calendar: Calendar,
  user: User,
};

interface RecentActivityProps {
  extended?: boolean;
}

export function RecentActivity({ extended = false }: RecentActivityProps) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const mockActivities: Activity[] = [
        {
          id: 1,
          title: "Profile Updated",
          description: "Your profile information was updated",
          timestamp: new Date(),
          icon: "user",
        },
        {
          id: 2,
          title: "New Session",
          description: "Started a new session",
          timestamp: new Date(Date.now() - 3600000),
          icon: "activity",
        },
        {
          id: 3,
          title: "Calendar Event",
          description: "Added a new calendar event",
          timestamp: new Date(Date.now() - 7200000),
          icon: "calendar",
        },
      ];

      if (extended) {
        // Add more activities for extended view
        mockActivities.push(
          {
            id: 4,
            title: "Settings Changed",
            description: "System settings were updated",
            timestamp: new Date(Date.now() - 14400000),
            icon: "activity",
          },
          {
            id: 5,
            title: "Login Detected",
            description: "New login from your device",
            timestamp: new Date(Date.now() - 28800000),
            icon: "user",
          }
        );
      }

      setActivities(mockActivities);
    }
  }, [extended]);

  return (
    <div className="space-y-8">
      {activities.map((activity) => {
        const Icon = icons[activity.icon];
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
                {activity.timestamp.toLocaleString()}
              </p>
            </div>
            <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
          </div>
        );
      })}
    </div>
  );
}