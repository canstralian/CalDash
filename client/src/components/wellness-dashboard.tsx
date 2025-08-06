
import { useState } from "react";
import { Heart, Moon, Coffee, AlertTriangle, Shield, Timer } from "lucide-react";

interface WellnessMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  status: "good" | "warning" | "danger";
  icon: React.ReactNode;
}

interface BreakReminder {
  id: string;
  type: "break" | "eye-rest" | "stretch" | "hydration";
  message: string;
  nextReminder: Date;
  isActive: boolean;
}

export function WellnessDashboard() {
  const [wellnessMetrics] = useState<WellnessMetric[]>([
    {
      id: "work-hours",
      name: "Daily Work Hours",
      value: 8.5,
      target: 8,
      unit: "hours",
      status: "warning",
      icon: <Timer size={20} />
    },
    {
      id: "break-frequency",
      name: "Break Frequency",
      value: 4,
      target: 6,
      unit: "breaks",
      status: "warning",
      icon: <Coffee size={20} />
    },
    {
      id: "overtime-days",
      name: "Overtime This Week",
      value: 2,
      target: 0,
      unit: "days",
      status: "danger",
      icon: <AlertTriangle size={20} />
    },
    {
      id: "weekend-protection",
      name: "Weekend Protection",
      value: 100,
      target: 100,
      unit: "%",
      status: "good",
      icon: <Shield size={20} />
    }
  ]);
  
  const [breakReminders] = useState<BreakReminder[]>([
    {
      id: "1",
      type: "break",
      message: "Time for a 5-minute break! You've been focused for 90 minutes.",
      nextReminder: new Date(Date.now() + 15 * 60 * 1000),
      isActive: true
    },
    {
      id: "2",
      type: "eye-rest",
      message: "Look away from your screen for 20 seconds (20-20-20 rule)",
      nextReminder: new Date(Date.now() + 20 * 60 * 1000),
      isActive: true
    },
    {
      id: "3",
      type: "stretch",
      message: "Stand up and stretch for 2 minutes",
      nextReminder: new Date(Date.now() + 60 * 60 * 1000),
      isActive: false
    },
    {
      id: "4",
      type: "hydration",
      message: "Time to drink some water! Stay hydrated.",
      nextReminder: new Date(Date.now() + 45 * 60 * 1000),
      isActive: true
    }
  ]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-green-600 bg-green-50 border-green-200";
      case "warning": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "danger": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  
  const getReminderIcon = (type: string) => {
    switch (type) {
      case "break": return <Coffee size={16} />;
      case "eye-rest": return <Moon size={16} />;
      case "stretch": return <Heart size={16} />;
      case "hydration": return <Coffee size={16} />;
      default: return <Timer size={16} />;
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-6">
      {/* Wellness Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4 flex items-center gap-2">
          <Heart size={20} />
          Wellness Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wellnessMetrics.map((metric) => (
            <div key={metric.id} className={`p-4 rounded-lg border ${getStatusColor(metric.status)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {metric.icon}
                  <span className="font-medium">{metric.name}</span>
                </div>
                <span className="text-sm font-medium">
                  {metric.value} / {metric.target} {metric.unit}
                </span>
              </div>
              
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric.status === "good" ? "bg-green-500" :
                    metric.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ 
                    width: `${Math.min((metric.value / metric.target) * 100, 100)}%` 
                  }}
                />
              </div>
              
              <div className="mt-2 text-xs opacity-75">
                {metric.status === "good" && "Looking great! Keep it up."}
                {metric.status === "warning" && "Room for improvement"}
                {metric.status === "danger" && "Needs attention"}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Break Reminders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-dark)] flex items-center gap-2">
            <Timer size={20} />
            Break Reminders
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Configure
          </button>
        </div>
        
        <div className="space-y-3">
          {breakReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  reminder.isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {getReminderIcon(reminder.type)}
                </div>
                <div>
                  <p className={`font-medium ${
                    reminder.isActive ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {reminder.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    Next: {formatTime(reminder.nextReminder)}
                  </p>
                </div>
              </div>
              
              <button
                className={`w-10 h-6 rounded-full ${
                  reminder.isActive ? "bg-blue-500" : "bg-gray-300"
                } relative transition-colors`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  reminder.isActive ? "translate-x-5" : "translate-x-1"
                }`} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Taking regular breaks can improve focus and reduce eye strain. Enable smart reminders based on your work patterns.
          </p>
        </div>
      </div>
      
      {/* Burnout Prevention */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4 flex items-center gap-2">
          <Shield size={20} />
          Burnout Prevention
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Healthy Work Pattern</p>
                <p className="text-sm text-green-600">Your schedule looks balanced this week</p>
              </div>
            </div>
            <div className="text-2xl">😊</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Weekly Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average daily hours:</span>
                  <span className="font-medium">7.8h</span>
                </div>
                <div className="flex justify-between">
                  <span>Days with overtime:</span>
                  <span className="font-medium text-yellow-600">2/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend work:</span>
                  <span className="font-medium text-green-600">0h</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>• Limit daily work to 8 hours</p>
                <p>• Take a 15-min break every 2 hours</p>
                <p>• Keep weekends work-free</p>
                <p>• Schedule focus blocks for deep work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
