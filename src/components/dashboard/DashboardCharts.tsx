import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

const generateData = (type: string) => {
  const data = [];
  const types = {
    overview: { max: 1000, step: 50 },
    analytics: { max: 2000, step: 100 },
    reports: { max: 500, step: 25 },
    revenue: { max: 3000, step: 150 }
  };
  const config = types[type as keyof typeof types] || types.overview;
  
  for (let i = 0; i < 12; i++) {
    data.push({
      name: `${i + 1}h`,
      value: Math.floor(Math.random() * config.max) + config.step
    });
  }
  return data;
};

interface DashboardChartsProps {
  type?: string;
}

export function DashboardCharts({ type = "overview" }: DashboardChartsProps) {
  const [data, setData] = useState(generateData(type));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData(type));
    }, 5000);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.2}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}