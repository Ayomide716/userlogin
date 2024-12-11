import { Layout, LayoutDashboard, Users, MessageSquare, Settings } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Get the user's email and extract the name part (before @)
      const emailName = user.email?.split('@')[0] || '';
      // Capitalize the first letter
      const formattedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      setUserName(formattedName);
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      <span>Overview</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Users className="w-4 h-4 mr-2" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>Messages</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">Welcome back, {userName}! 👋</h2>
              <p className="text-muted-foreground">
                Here's what's happening with your account today.
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2 text-gray-600">Total Users</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2 text-gray-600">Active Sessions</h3>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="font-medium mb-2 text-gray-600">Messages</h3>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>

          <div className="mt-6 p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
            <p className="text-gray-500">No recent activity to display.</p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}