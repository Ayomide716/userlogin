import { DollarSign, Users, Activity, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { AnalyticsStat, subscribeToAnalytics } from "@/lib/analytics";
import { AddStatsDialog } from "./AddStatsDialog";
import { StatCard } from "./stats/StatCard";
import { subscriptionManager } from "@/lib/analytics/subscriptionManager";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToAnalytics((analyticsData) => {
        setStats([
          {
            title: "Total Revenue",
            value: `$${analyticsData.revenue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            description: `${((analyticsData.revenue / 1000) * 100).toFixed(1)}% from last month`,
            icon: DollarSign,
            trend: (analyticsData.revenue / 1000) * 100,
          },
          {
            title: "Active Users",
            value: analyticsData.activeUsers.toString(),
            description: `${((analyticsData.activeUsers / 100) * 100).toFixed(1)}% from last month`,
            icon: Users,
            trend: (analyticsData.activeUsers / 100) * 100,
          },
          {
            title: "Active Sessions",
            value: analyticsData.activeSessions.toString(),
            description: `${((analyticsData.activeSessions / 100) * 100).toFixed(1)}% from last month`,
            icon: Activity,
            trend: (analyticsData.activeSessions / 100) * 100,
          },
          {
            title: "Conversion Rate",
            value: `${analyticsData.conversionRate.toFixed(1)}%`,
            description: `${analyticsData.conversionRate.toFixed(1)}% since last hour`,
            icon: TrendingUp,
            trend: analyticsData.conversionRate,
          },
        ]);
        setIsLoading(false);
      });

      subscriptionManager.addSubscription('dashboardStats', unsubscribe);
      return () => {
        subscriptionManager.cleanupSubscription('dashboardStats');
      };
    } catch (error) {
      console.error('Error setting up analytics subscription:', error);
      toast.error('Error connecting to analytics service');
      setIsLoading(false);
    }
  }, []);

  const handleStatClick = (stat: typeof stats[0]) => {
    const trendText = stat.trend > 0 ? `Increased by ${stat.trend}%` : 'No change';
    toast.info(`${stat.title}: ${stat.value} (${trendText})`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <AddStatsDialog />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
              onClick={() => handleStatClick(stat)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddStatsDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            onClick={() => handleStatClick(stat)}
          />
        ))}
      </div>
    </div>
  );
}