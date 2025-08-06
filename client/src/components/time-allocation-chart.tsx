interface Event {
  id: string;
  category: string;
  startTime: string;
  endTime: string;
}

interface TimeAllocationChartProps {
  events?: Event[];
}

export default function TimeAllocationChart({ events = [] }: TimeAllocationChartProps) {
  const calculateWeeklyData = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekData = weekDays.map((day, index) => {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + index);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate >= dayStart && eventDate <= dayEnd;
      });

      const focusHours = dayEvents
        .filter(e => e.category === 'focus')
        .reduce((total, event) => {
          const duration = new Date(event.endTime).getTime() - new Date(event.startTime).getTime();
          return total + duration / (1000 * 60 * 60);
        }, 0);

      return {
        name: day,
        focusHours: focusHours,
        isWeekend: index === 0 || index === 6,
        isPast: dayEnd < now
      };
    });

    return weekData;
  };

  const weekData = calculateWeeklyData();
  const maxHours = Math.max(...weekData.map(d => d.focusHours), 8);

  const getBarHeight = (hours: number) => {
    return Math.max((hours / maxHours) * 100, 5);
  };

  const getBarColor = (hours: number, isWeekend: boolean, isPast: boolean) => {
    if (isWeekend || hours === 0) return "bg-gray-300";
    if (!isPast) return "bg-blue-200";
    
    if (hours >= 6) return "bg-google-green";
    if (hours >= 4) return "bg-google-blue";
    if (hours >= 2) return "bg-google-yellow";
    return "bg-google-red";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200" data-testid="time-allocation-chart">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[color:var(--text-dark)]">
            Time Allocation This Week
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm font-medium text-white bg-google-blue rounded-md" data-testid="filter-this-week">
              This Week
            </button>
            <button className="px-3 py-1 text-sm font-medium text-[color:var(--text-medium)] hover:bg-gray-100 rounded-md" data-testid="filter-last-week">
              Last Week
            </button>
            <button className="px-3 py-1 text-sm font-medium text-[color:var(--text-medium)] hover:bg-gray-100 rounded-md" data-testid="filter-this-month">
              This Month
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {weekData.map((day, index) => (
            <div key={index} className="text-center" data-testid={`day-${day.name.toLowerCase()}`}>
              <h4 className={`text-sm font-medium mb-4 ${
                day.isWeekend ? "text-[color:var(--text-light)]" : "text-[color:var(--text-dark)]"
              }`}>
                {day.name}
              </h4>
              <div className="space-y-2">
                <div className="w-full h-16 bg-gray-100 rounded-lg relative">
                  {day.focusHours > 0 ? (
                    <>
                      <div 
                        className={`absolute inset-x-0 bottom-0 rounded-lg transition-all duration-300 ${
                          getBarColor(day.focusHours, day.isWeekend, day.isPast)
                        }`}
                        style={{ height: `${getBarHeight(day.focusHours)}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-medium ${
                          day.isWeekend ? "text-[color:var(--text-light)]" : "text-[color:var(--text-dark)]"
                        }`}>
                          {day.focusHours.toFixed(1)}h
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-[color:var(--text-light)]">
                        --
                      </span>
                    </div>
                  )}
                </div>
                <p className={`text-xs ${
                  day.isWeekend ? "text-[color:var(--text-light)]" : "text-[color:var(--text-medium)]"
                }`}>
                  Focus
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-google-blue rounded-full"></div>
              <span className="text-sm text-[color:var(--text-medium)]">Deep Work</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-google-green rounded-full"></div>
              <span className="text-sm text-[color:var(--text-medium)]">Meetings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-google-yellow rounded-full"></div>
              <span className="text-sm text-[color:var(--text-medium)]">Admin</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-google-red rounded-full"></div>
              <span className="text-sm text-[color:var(--text-medium)]">Break</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
