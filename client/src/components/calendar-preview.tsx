import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Brain, Presentation, Users, Coffee } from "lucide-react";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  description?: string;
  attendeesCount?: number;
  meetingUrl?: string;
}

interface CalendarPreviewProps {
  events?: Event[];
}

const categoryConfig = {
  meeting: { 
    color: "bg-blue-50 border-google-blue", 
    icon: Video, 
    label: "Video Call",
    bgClass: "bg-google-blue"
  },
  focus: { 
    color: "bg-green-50 border-google-green", 
    icon: Brain, 
    label: "Focus Time",
    bgClass: "bg-google-green"
  },
  presentation: { 
    color: "bg-yellow-50 border-google-yellow", 
    icon: Presentation, 
    label: "Presentation",
    bgClass: "bg-google-yellow"
  },
  admin: { 
    color: "bg-red-50 border-google-red", 
    icon: Users, 
    label: "Meeting",
    bgClass: "bg-google-red"
  },
  break: { 
    color: "bg-gray-50 border-gray-400", 
    icon: Coffee, 
    label: "Break",
    bgClass: "bg-gray-400"
  },
  other: { 
    color: "bg-purple-50 border-purple-400", 
    icon: Users, 
    label: "Event",
    bgClass: "bg-purple-400"
  }
};

export default function CalendarPreview({ events = [] }: CalendarPreviewProps) {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= today && eventDate < tomorrow;
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    
    if (duration < 60) {
      return `${Math.round(duration)} min`;
    } else {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${Math.round(minutes)}m` : `${hours}h`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[color:var(--text-dark)]">
            Today's Schedule
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("day")}
              className={viewMode === "day" ? "bg-google-blue hover:bg-blue-600" : ""}
              data-testid="button-view-day"
            >
              Day
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className={viewMode === "week" ? "bg-google-blue hover:bg-blue-600" : ""}
              data-testid="button-view-week"
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className={viewMode === "month" ? "bg-google-blue hover:bg-blue-600" : ""}
              data-testid="button-view-month"
            >
              Month
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {todayEvents.length === 0 ? (
            <div className="text-center py-8" data-testid="empty-schedule">
              <p className="text-[color:var(--text-medium)]">No events scheduled for today</p>
            </div>
          ) : (
            todayEvents.map((event) => {
              const config = categoryConfig[event.category as keyof typeof categoryConfig] || categoryConfig.other;
              const Icon = config.icon;
              
              return (
                <div key={event.id} className="flex items-start space-x-4" data-testid={`event-${event.id}`}>
                  <div className="w-16 text-sm text-[color:var(--text-medium)] font-medium">
                    {formatTime(event.startTime)}
                  </div>
                  <div className="flex-1">
                    <div className={`${config.color} border-l-4 rounded-r-lg p-3`}>
                      <h4 className="text-sm font-medium text-[color:var(--text-dark)]">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-[color:var(--text-medium)] mt-1">
                          {event.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${config.bgClass}`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </span>
                        <span className="text-xs text-[color:var(--text-medium)]">
                          {getDuration(event.startTime, event.endTime)}
                        </span>
                        {event.attendeesCount && event.attendeesCount > 0 && (
                          <span className="text-xs text-[color:var(--text-medium)]">
                            {event.attendeesCount} attendees
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
