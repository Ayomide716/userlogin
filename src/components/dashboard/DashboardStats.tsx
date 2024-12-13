import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { AnalyticsStat, subscribeToAnalytics } from "@/lib/analytics";

export function DashboardStats() {
  const [stats, setStats] = useState([
    {
      title: "Total Revenue",
      value: "$0.00",
      description: "No change",
      icon: DollarSign,
      trend: 0,
    },
    {
      title: "Active Users",
      value: "1",
      description: "First user",
      icon: Users,
      trend: 0,
    },
    {
      title: "Active Sessions",
      value: "1",
      description: "Current session",
      icon: Activity,
      trend: 0,
    },
    {
      title: "Conversion Rate",
      value: "0%",
      description: "No conversions yet",
      icon: TrendingUp,
      trend: 0,
    },
  ]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = subscribeToAnalytics((analyticsData) => {
      setStats([
        {
          title: "Total Revenue",
          value: `$${analyticsData.revenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          description: `+${((analyticsData.revenue / 1000) * 100).toFixed(1)}% from last month`,
          icon: DollarSign,
          trend: (analyticsData.revenue / 1000) * 100,
        },
        {
          title: "Active Users",
          value: analyticsData.activeUsers.toString(),
          description: `+${((analyticsData.activeUsers / 100) * 100).toFixed(1)}% from last month`,
          icon: Users,
          trend: (analyticsData.activeUsers / 100) * 100,
        },
        {
          title: "Active Sessions",
          value: analyticsData.activeSessions.toString(),
          description: `+${((analyticsData.activeSessions / 100) * 100).toFixed(1)}% from last month`,
          icon: Activity,
          trend: (analyticsData.activeSessions / 100) * 100,
        },
        {
          title: "Conversion Rate",
          value: `${analyticsData.conversionRate.toFixed(1)}%`,
          description: `+${analyticsData.conversionRate.toFixed(1)}% since last hour`,
          icon: TrendingUp,
          trend: analyticsData.conversionRate,
        },
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            const trendText = stat.trend > 0 ? `Increased by ${stat.trend}%` : 'No change';
            toast.info(`${stat.title}: ${stat.value} (${trendText})`);
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.trend > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${stat.trend > 0 ? 'text-green-500' : 'text-muted-foreground'} mt-1`}>
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}