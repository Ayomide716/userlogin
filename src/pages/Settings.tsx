import { useState, useEffect } from "react";
import { Moon, Sun, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="bg-card rounded-lg shadow-sm p-6 max-w-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-lg font-medium">Appearance</h2>
                <p className="text-sm text-muted-foreground">
                  Customize how the dashboard looks
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span>Dark Mode</span>
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