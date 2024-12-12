import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check initial theme
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      toast.success("Dark mode enabled");
    } else {
      document.documentElement.classList.remove("dark");
      toast.success("Light mode enabled");
    }
    
    // Save preference
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-lg font-medium dark:text-white">Appearance</h2>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  Customize how the dashboard looks
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 dark:text-white" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span className="dark:text-white">Dark Mode</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}