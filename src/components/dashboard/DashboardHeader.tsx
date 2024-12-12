import { Bell, Search, Settings, User, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
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

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const emailName = user.email?.split('@')[0] || '';
      const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      setUserName(formattedName);

      // Check if user is new (created within last 5 minutes)
      const creationTime = user.metadata.creationTime;
      if (creationTime) {
        const createDate = new Date(creationTime);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        if (createDate > fiveMinutesAgo) {
          toast.success("Welcome to your new dashboard! Take a tour to get started.");
        }
      }
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success("Signed out successfully");
      navigate("/signin");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleNotificationClick = () => {
    const notificationsList = notifications.map(n => `${n.title} - ${n.timestamp.toLocaleString()}`).join('\n');
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
    // Mark all as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      // Mock search results - replace with actual search logic
      const results = [
        { id: 1, title: "Dashboard Overview", type: "page" },
        { id: 2, title: "Profile Settings", type: "settings" },
        { id: 3, title: "Notifications", type: "notifications" },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      if (results.length > 0) {
        toast.info(`Found ${results.length} results`);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="border-b bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold tracking-tight dark:text-white">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              {searchResults.length > 0 && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        if (result.type === 'settings') {
                          navigate('/settings');
                        } else {
                          toast.info(`Navigating to ${result.title}`);
                        }
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      {result.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                className="relative rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={handleNotificationClick}
              >
                <Bell className="h-5 w-5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>
            </div>
            <button
              className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => toast.info("Settings panel coming soon!")}
            >
              <Settings className="h-5 w-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary">
                <User className="h-5 w-5" />
                <span className="hidden md:inline-block text-sm font-medium">
                  {userName}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast.info("Profile settings coming soon!")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info("Settings panel coming soon!")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}