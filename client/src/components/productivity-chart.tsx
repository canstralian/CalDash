
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Activity } from "lucide-react";

interface MetricData {
  todayEvents: number;
  focusTime: string;
  meetings: number;
  productivityScore: string;
  focusHours: number;
  totalHours: number;
}

export function ProductivityChart() {
  const { data: metrics } = useQuery<MetricData>({
    queryKey: ["/api/metrics"],
    queryFn: async () => {
      const response = await fetch("/api/metrics");
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      return response.json();
    }
  });

  // Generate sample weekly data for visualization
  const weeklyData = [
    { day: "Mon", focus: 6.5, meetings: 2, productivity: 85 },
    { day: "Tue", focus: 7.2, meetings: 3, productivity: 90 },
    { day: "Wed", focus: 5.8, meetings: 4, productivity: 75 },
    { day: "Thu", focus: 8.1, meetings: 1, productivity: 95 },
    { day: "Fri", focus: 6.9, meetings: 2, productivity: 88 },
    { day: "Sat", focus: 4.2, meetings: 0, productivity: 60 },
    { day: "Sun", focus: 3.5, meetings: 0, productivity: 50 }
  ];

  const productivityTrend = [
    { week: "W1", score: 82 },
    { week: "W2", score: 78 },
    { week: "W3", score: 85 },
    { week: "W4", score: 88 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)]">
          Productivity Analytics
        </h3>
        <Activity className="h-5 w-5 text-[color:var(--text-medium)]" />
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[color:var(--google-blue)]">
            {metrics?.productivityScore || "0%"}
          </div>
          <div className="text-sm text-[color:var(--text-medium)]">Today's Score</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[color:var(--google-green)]">
            {metrics?.focusTime || "0h"}
          </div>
          <div className="text-sm text-[color:var(--text-medium)]">Focus Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[color:var(--google-red)]">
            {metrics?.meetings || 0}
          </div>
          <div className="text-sm text-[color:var(--text-medium)]">Meetings</div>
        </div>
      </div>

      {/* Weekly Focus Time Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-[color:var(--text-dark)] mb-3">
          Weekly Focus Time (Hours)
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="focus" 
              fill="var(--google-blue)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Productivity Trend */}
      <div>
        <h4 className="text-sm font-medium text-[color:var(--text-dark)] mb-3 flex items-center">
          Productivity Trend
          <TrendingUp className="h-4 w-4 ml-2 text-green-500" />
        </h4>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={productivityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="week" 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value}%`, 'Productivity Score']}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="var(--google-green)" 
              strokeWidth={3}
              dot={{ fill: "var(--google-green)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>💡 Insight:</strong> Your productivity peaks on Thursdays with minimal meetings. 
          Consider scheduling important focus work on similar low-meeting days.
        </p>
      </div>
    </div>
  );
}
