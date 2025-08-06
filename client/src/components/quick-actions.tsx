
import { Plus, Calendar, Clock, Target, Zap, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  hoverColor: string;
}

export function QuickActions() {
  const actions: QuickAction[] = [
    {
      icon: <Plus size={20} />,
      label: "New Task",
      description: "Create a new task",
      color: "bg-gradient-primary",
      hoverColor: "hover:shadow-blue-200"
    },
    {
      icon: <Calendar size={20} />,
      label: "Schedule",
      description: "View your calendar",
      color: "bg-gradient-success",
      hoverColor: "hover:shadow-green-200"
    },
    {
      icon: <Clock size={20} />,
      label: "Time Track",
      description: "Start time tracking",
      color: "bg-gradient-warning",
      hoverColor: "hover:shadow-yellow-200"
    },
    {
      icon: <Target size={20} />,
      label: "Set Goal",
      description: "Define new objective",
      color: "bg-gradient-danger",
      hoverColor: "hover:shadow-red-200"
    },
    {
      icon: <Zap size={20} />,
      label: "Focus Mode",
      description: "Enter deep work",
      color: "bg-gradient-to-r from-purple-500 to-indigo-600",
      hoverColor: "hover:shadow-purple-200"
    },
    {
      icon: <Coffee size={20} />,
      label: "Break Time",
      description: "Take a short break",
      color: "bg-gradient-to-r from-orange-400 to-pink-500",
      hoverColor: "hover:shadow-orange-200"
    }
  ];

  return (
    <div className="glass rounded-xl p-6 hover-lift transition-all duration-300 animate-fade-in border border-white/20">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[color:var(--text-dark)] mb-2">
          Quick Actions
        </h3>
        <p className="text-sm text-[color:var(--text-medium)]">
          Boost your productivity with one-click actions
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Button
            key={action.label}
            variant="ghost"
            className={`
              h-auto p-4 flex flex-col items-center space-y-3 
              hover-lift hover-glow transition-all duration-300 
              bg-white/60 hover:bg-white/80 border border-gray-200/50
              animate-scale-in group relative overflow-hidden
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background gradient on hover */}
            <div className={`
              absolute inset-0 ${action.color} opacity-0 group-hover:opacity-10 
              transition-opacity duration-300
            `}></div>
            
            <div className={`
              ${action.color} p-3 rounded-xl text-white shadow-soft
              group-hover:scale-110 transition-transform duration-300
              relative z-10
            `}>
              {action.icon}
            </div>
            
            <div className="text-center relative z-10">
              <div className="font-medium text-sm text-[color:var(--text-dark)] group-hover:text-gray-900 transition-colors">
                {action.label}
              </div>
              <div className="text-xs text-[color:var(--text-light)] mt-1 group-hover:text-gray-600 transition-colors">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
