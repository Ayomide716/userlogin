import { Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NotificationsButton() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to your dashboard!",
      read: false,
      timestamp: new Date(),
    },
    {
      id: 2,
      title: "Complete your profile for better experience",
      read: false,
      timestamp: new Date(),
    }
  ]);

  const handleNotificationClick = () => {
    toast.info(
      <div className="space-y-2">
        <h3 className="font-semibold">Notifications</h3>
        {notifications.map(n => (
          <div key={n.id} className="text-sm">
            {n.title}
            <div className="text-xs text-gray-500">
              {n.timestamp.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    );
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        className="relative rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:hover:bg-gray-700"
        onClick={handleNotificationClick}
      >
        <Bell className="h-5 w-5 dark:text-white" />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>
    </div>
  );
}