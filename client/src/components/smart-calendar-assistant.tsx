
import { useState, useEffect } from "react";
import { Clock, Calendar, AlertCircle, CheckCircle, Plus } from "lucide-react";
import { Event } from "@/lib/types";

interface SmartCalendarAssistantProps {
  events: Event[];
}

interface Suggestion {
  type: "buffer" | "conflict" | "preparation" | "optimization";
  title: string;
  description: string;
  action: string;
  priority: "high" | "medium" | "low";
}

export function SmartCalendarAssistant({ events }: SmartCalendarAssistantProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const generateSuggestions = (): Suggestion[] => {
    const newSuggestions: Suggestion[] = [];
    
    // Check for back-to-back meetings
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    
    for (let i = 0; i < sortedEvents.length - 1; i++) {
      const current = sortedEvents[i];
      const next = sortedEvents[i + 1];
      
      if (current.category === "meeting" && next.category === "meeting") {
        const currentEnd = new Date(current.endTime);
        const nextStart = new Date(next.startTime);
        const gap = nextStart.getTime() - currentEnd.getTime();
        
        if (gap < 15 * 60 * 1000) { // Less than 15 minutes
          newSuggestions.push({
            type: "buffer",
            title: "Add Buffer Time",
            description: `Only ${Math.round(gap / 60000)} minutes between "${current.title}" and "${next.title}"`,
            action: "Add 15-minute buffer",
            priority: "medium"
          });
        }
      }
    }
    
    // Check for meeting preparation
    const importantMeetings = events.filter(e => 
      e.category === "meeting" && 
      (e.attendeesCount > 3 || e.title.toLowerCase().includes("review"))
    );
    
    importantMeetings.forEach(meeting => {
      newSuggestions.push({
        type: "preparation",
        title: "Meeting Preparation",
        description: `"${meeting.title}" could benefit from preparation time`,
        action: "Block 15 min prep time",
        priority: "medium"
      });
    });
    
    return newSuggestions.slice(0, 5); // Show top 5 suggestions
  };
  
  useEffect(() => {
    setSuggestions(generateSuggestions());
  }, [events]);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "buffer": return <Clock size={16} />;
      case "conflict": return <AlertCircle size={16} />;
      case "preparation": return <Calendar size={16} />;
      case "optimization": return <CheckCircle size={16} />;
      default: return <Plus size={16} />;
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4">
        Calendar Assistant
      </h3>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getPriorityColor(suggestion.priority)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {getTypeIcon(suggestion.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{suggestion.title}</h4>
                <p className="text-xs mt-1 opacity-80">{suggestion.description}</p>
                <button className="text-xs font-medium mt-2 hover:underline">
                  {suggestion.action}
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {suggestions.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Your calendar is well optimized!</p>
          </div>
        )}
      </div>
    </div>
  );
}
