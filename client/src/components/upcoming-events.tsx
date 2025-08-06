interface Event {
  id: string;
  title: string;
  startTime: string;
  category: string;
}

interface UpcomingEventsProps {
  events?: Event[];
}

const categoryColors = {
  meeting: "bg-google-blue",
  focus: "bg-google-green", 
  presentation: "bg-google-yellow",
  admin: "bg-google-red",
  break: "bg-gray-400",
  other: "bg-purple-400"
};

export default function UpcomingEvents({ events = [] }: UpcomingEventsProps) {
  const now = new Date();
  
  // Get upcoming events (next 7 days, excluding events that have already started)
  const upcomingEvents = events
    .filter(event => {
      const eventStart = new Date(event.startTime);
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventStart > now && eventStart <= weekFromNow;
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 4); // Show only the next 4 events

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="upcoming-events">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)]">
          Upcoming
        </h3>
        <button className="text-sm text-google-blue hover:text-blue-700 transition-colors" data-testid="button-view-all-events">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-[color:var(--text-light)]" data-testid="no-upcoming-events">
              No upcoming events
            </p>
          </div>
        ) : (
          upcomingEvents.map((event) => {
            const colorClass = categoryColors[event.category as keyof typeof categoryColors] || categoryColors.other;
            
            return (
              <div key={event.id} className="flex items-start space-x-3" data-testid={`upcoming-event-${event.id}`}>
                <div className={`w-2 h-2 ${colorClass} rounded-full mt-2`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[color:var(--text-dark)] truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-[color:var(--text-medium)]">
                    {formatEventTime(event.startTime)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
