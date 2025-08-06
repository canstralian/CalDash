
import { TrendingUp, TrendingDown, Clock, Target, Calendar, BarChart3 } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  description: string;
}



function MetricCard({ title, value, change, isPositive, icon, description }: MetricCardProps) {
  return (
    <div className="glass rounded-xl p-6 hover-lift hover-glow transition-all duration-300 animate-fade-in border border-white/20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2.5 rounded-lg ${isPositive ? 'bg-gradient-success' : 'bg-gradient-danger'} bg-opacity-10`}>
              <div className={isPositive ? 'text-green-600' : 'text-red-600'}>
                {icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-[color:var(--text-medium)] uppercase tracking-wide">
                {title}
              </p>
              {description && (
                <p className="text-xs text-[color:var(--text-light)] mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-[color:var(--text-dark)] tracking-tight">
              {value}
            </p>
            
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                isPositive 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{change}</span>
              </div>
              <span className="text-xs text-[color:var(--text-light)]">vs last week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MetricCards() {
  const metrics = [
    {
      title: "Focus Time",
      value: "6.5h",
      change: "+12%",
      isPositive: true,
      icon: <Clock size={20} />,
      description: "Deep work sessions"
    },
    {
      title: "Productivity Score",
      value: "87%",
      change: "+5%",
      isPositive: true,
      icon: <Target size={20} />,
      description: "Goal completion rate"
    },
    {
      title: "Meeting Efficiency",
      value: "78%",
      change: "-3%",
      isPositive: false,
      icon: <Calendar size={20} />,
      description: "Time well spent"
    },
    {
      title: "Task Completion",
      value: "24",
      change: "+18%",
      isPositive: true,
      icon: <BarChart3 size={20} />,
      description: "Tasks completed today"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric, index) => (
        <div
          key={metric.title}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <MetricCard {...metric} />
        </div>
      ))}
    </div>
  );
}
