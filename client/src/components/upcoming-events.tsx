
import { Clock, MapPin, Users, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Event {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  location?: string;
  attendeesCount: number;
  isAllDay: boolean;
}

const formatEventTime = (startTime: string) => {
  const eventDate = new Date(startTime);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const isToday = eventDate.toDateString() === today.toDateString();
  const isTomorrow = eventDate.toDateString() === tomorrow.toDateString();
  
  const timeString = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  if (isToday) {
    return `Today, ${timeString}`;
  } else if (isTomorrow) {
    return `Tomorrow, ${timeString}`;
  } else {
    const dayString = eventDate.toLocaleDateString("en-US", { weekday: "long" });
    return `${dayString}, ${timeString}`;
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    meeting: "bg-blue-100 text-blue-800",
    focus: "bg-green-100 text-green-800",
    presentation: "bg-purple-100 text-purple-800",
    admin: "bg-gray-100 text-gray-800",
    break: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };
  return colors[category as keyof typeof colors] || colors.other;
};

export function UpcomingEvents() {
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const response = await fetch(`/api/events?start=${today.toISOString()}&end=${nextWeek.toISOString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      return response.json();
    }
  });

  const upcomingEvents = events
    .filter(event => new Date(event.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)]">
          Upcoming Events
        </h3>
        <Calendar className="h-5 w-5 text-[color:var(--text-medium)]" />
      </div>

      <div className="space-y-4">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8 text-[color:var(--text-medium)]">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No upcoming events</p>
            <p className="text-sm">Your schedule is clear!</p>
          </div>
        ) : (
          upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-[color:var(--text-dark)] truncate">
                    {event.title}
                  </h4>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-xs text-[color:var(--text-medium)]">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatEventTime(event.startTime)}
                  </div>
                  {event.location && (
                    <div className="flex items-center text-xs text-[color:var(--text-medium)]">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-20">{event.location}</span>
                    </div>
                  )}
                  {event.attendeesCount > 0 && (
                    <div className="flex items-center text-xs text-[color:var(--text-medium)]">
                      <Users className="h-3 w-3 mr-1" />
                      {event.attendeesCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {upcomingEvents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all events
          </button>
        </div>
      )}
    </div>
  );
}
