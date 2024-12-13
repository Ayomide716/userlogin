import { Settings } from "lucide-react";
import { toast } from "sonner";
import { SearchBar } from "./header/SearchBar";
import { NotificationsButton } from "./header/NotificationsButton";
import { UserMenu } from "./header/UserMenu";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight dark:text-white">Dashboard</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <SearchBar />
            </div>
            <NotificationsButton />
            <button
              className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary dark:hover:bg-gray-700"
              onClick={() => toast.info("Settings panel coming soon!")}
            >
              <Settings className="h-5 w-5 dark:text-white" />
            </button>
            <UserMenu />
          </div>
        </div>
      </div>
      <div className="sm:hidden p-2">
        <SearchBar />
      </div>
    </header>
  );
}