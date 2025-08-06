
import { useState } from "react";
import { Target, TrendingUp, Calendar, Award, CheckCircle } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly" | "monthly";
  target: number;
  current: number;
  unit: string;
  category: "focus" | "meetings" | "productivity" | "wellness";
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  completedToday: boolean;
  category: "productivity" | "wellness" | "learning";
}

export function GoalTracker() {
  const [goals] = useState<Goal[]>([
    {
      id: "1",
      title: "Deep Focus Time",
      type: "daily",
      target: 4,
      current: 2.5,
      unit: "hours",
      category: "focus"
    },
    {
      id: "2",
      title: "Meeting Efficiency",
      type: "weekly",
      target: 80,
      current: 75,
      unit: "%",
      category: "meetings"
    },
    {
      id: "3",
      title: "Task Completion",
      type: "daily",
      target: 8,
      current: 6,
      unit: "tasks",
      category: "productivity"
    }
  ]);
  
  const [habits] = useState<Habit[]>([
    {
      id: "1",
      name: "Morning Planning Session",
      streak: 7,
      completedToday: true,
      category: "productivity"
    },
    {
      id: "2",
      name: "Take Regular Breaks",
      streak: 12,
      completedToday: false,
      category: "wellness"
    },
    {
      id: "3",
      name: "End-of-day Review",
      streak: 5,
      completedToday: true,
      category: "productivity"
    }
  ]);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "focus": return "bg-blue-500";
      case "meetings": return "bg-green-500";
      case "productivity": return "bg-purple-500";
      case "wellness": return "bg-orange-500";
      case "learning": return "bg-indigo-500";
      default: return "bg-gray-500";
    }
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-6">
      {/* Goals Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-dark)] flex items-center gap-2">
            <Target size={20} />
            Goals & Targets
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add Goal
          </button>
        </div>
        
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            return (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(goal.category)}`} />
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {goal.type}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  {percentage.toFixed(0)}% complete
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Habits Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-dark)] flex items-center gap-2">
            <Award size={20} />
            Daily Habits
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Add Habit
          </button>
        </div>
        
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <button
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    habit.completedToday
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  {habit.completedToday && <CheckCircle size={12} />}
                </button>
                <div>
                  <span className={`font-medium ${
                    habit.completedToday ? "text-gray-900" : "text-gray-600"
                  }`}>
                    {habit.name}
                  </span>
                  <div className="text-xs text-gray-500">
                    {habit.streak} day streak
                  </div>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs ${getCategoryColor(habit.category)} text-white`}>
                {habit.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
