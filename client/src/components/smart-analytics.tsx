
import { useState } from "react";
import { TrendingUp, Brain, Clock, Users, Target, AlertTriangle } from "lucide-react";
import { Event } from "@/lib/types";

interface SmartAnalyticsProps {
  events: Event[];
}

interface AnalyticsInsight {
  type: "success" | "warning" | "info";
  title: string;
  description: string;
  action?: string;
  icon: React.ReactNode;
}

export function SmartAnalytics({ events }: SmartAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  
  const calculateInsights = (): AnalyticsInsight[] => {
    const insights: AnalyticsInsight[] = [];
    
    // Meeting Quality Score
    const meetings = events.filter(e => e.category === "meeting");
    const longMeetings = meetings.filter(e => {
      const duration = new Date(e.endTime).getTime() - new Date(e.startTime).getTime();
      return duration > 60 * 60 * 1000; // > 1 hour
    });
    
    if (longMeetings.length > meetings.length * 0.3) {
      insights.push({
        type: "warning",
        title: "Meeting Optimization Opportunity",
        description: `${Math.round((longMeetings.length / meetings.length) * 100)}% of your meetings are over 1 hour`,
        action: "Consider breaking down long meetings",
        icon: <Users size={16} />
      });
    }
    
    // Focus Time Recommendations
    const focusEvents = events.filter(e => e.category === "focus");
    const totalFocusTime = focusEvents.reduce((total, event) => {
      const duration = new Date(event.endTime).getTime() - new Date(event.startTime).getTime();
      return total + duration;
    }, 0);
    
    const focusHours = totalFocusTime / (1000 * 60 * 60);
    if (focusHours < 4) {
      insights.push({
        type: "info",
        title: "Increase Deep Work Time",
        description: `You have ${focusHours.toFixed(1)}h of focus time. Aim for 4+ hours daily`,
        action: "Block more focus time",
        icon: <Brain size={16} />
      });
    }
    
    // Time Waste Detection
    const shortMeetings = meetings.filter(e => {
      const duration = new Date(e.endTime).getTime() - new Date(e.startTime).getTime();
      return duration < 15 * 60 * 1000; // < 15 minutes
    });
    
    if (shortMeetings.length > 3) {
      insights.push({
        type: "warning",
        title: "Context Switching Alert",
        description: `${shortMeetings.length} meetings under 15 minutes detected`,
        action: "Consider batching short discussions",
        icon: <AlertTriangle size={16} />
      });
    }
    
    return insights;
  };
  
  const insights = calculateInsights();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)]">
          Smart Analytics
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPeriod("week")}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedPeriod === "week" 
                ? "bg-blue-100 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod("month")}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedPeriod === "month" 
                ? "bg-blue-100 text-blue-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              insight.type === "success" 
                ? "bg-green-50 border-green-400"
                : insight.type === "warning"
                ? "bg-yellow-50 border-yellow-400"
                : "bg-blue-50 border-blue-400"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-1 rounded ${
                insight.type === "success" 
                  ? "text-green-600"
                  : insight.type === "warning"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                {insight.action && (
                  <p className="text-xs text-gray-500 mt-2 italic">{insight.action}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">Great productivity patterns! Keep it up.</p>
          </div>
        )}
      </div>
    </div>
  );
}
