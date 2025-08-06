import { CalendarDays, Clock, Users, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardsProps {
  metrics?: {
    todayEvents: number;
    focusTime: string;
    meetings: number;
    productivityScore: string;
  };
}

export default function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      title: "Today's Events",
      value: metrics?.todayEvents || 0,
      change: "+12% from yesterday",
      trend: "up",
      icon: CalendarDays,
      color: "google-blue",
      bgColor: "bg-blue-50",
    },
    {
      title: "Focus Time",
      value: metrics?.focusTime || "0h",
      change: "+8% this week",
      trend: "up",
      icon: Clock,
      color: "google-green",
      bgColor: "bg-green-50",
    },
    {
      title: "Meetings",
      value: metrics?.meetings || 0,
      change: "-3% from last week",
      trend: "down",
      icon: Users,
      color: "google-yellow",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Productivity Score",
      value: metrics?.productivityScore || "0%",
      change: "+5% improvement",
      trend: "up",
      icon: TrendingUp,
      color: "google-red",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const TrendIcon = card.trend === "up" ? ArrowUp : ArrowDown;
        const trendColor = card.trend === "up" ? "text-google-green" : "text-google-red";
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            data-testid={`metric-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[color:var(--text-medium)]">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-[color:var(--text-dark)] mt-2">
                  {card.value}
                </p>
                <p className={`text-sm mt-1 ${trendColor}`}>
                  <TrendIcon className="inline h-3 w-3 mr-1" />
                  {card.change}
                </p>
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-6 w-6 text-[color:var(--${card.color})]`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
