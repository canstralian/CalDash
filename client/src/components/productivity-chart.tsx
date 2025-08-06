interface Event {
  id: string;
  category: string;
  startTime: string;
  endTime: string;
}

interface ProductivityChartProps {
  events?: Event[];
}

export default function ProductivityChart({ events = [] }: ProductivityChartProps) {
  const calculateCategoryHours = () => {
    const categories = {
      focus: 0,
      meeting: 0,
      admin: 0,
      break: 0,
      other: 0
    };

    // Calculate for the current week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    events.forEach(event => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      
      if (eventStart >= startOfWeek && eventStart < endOfWeek) {
        const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
        const category = event.category as keyof typeof categories;
        if (categories[category] !== undefined) {
          categories[category] += duration;
        } else {
          categories.other += duration;
        }
      }
    });

    return categories;
  };

  const categoryData = calculateCategoryHours();
  const totalHours = Object.values(categoryData).reduce((sum, hours) => sum + hours, 0);
  
  const chartData = [
    {
      name: "Deep Work",
      hours: categoryData.focus,
      color: "bg-google-blue",
      percentage: totalHours > 0 ? (categoryData.focus / totalHours) * 100 : 0
    },
    {
      name: "Meetings", 
      hours: categoryData.meeting,
      color: "bg-google-yellow",
      percentage: totalHours > 0 ? (categoryData.meeting / totalHours) * 100 : 0
    },
    {
      name: "Admin",
      hours: categoryData.admin,
      color: "bg-google-green", 
      percentage: totalHours > 0 ? (categoryData.admin / totalHours) * 100 : 0
    },
    {
      name: "Break Time",
      hours: categoryData.break + categoryData.other,
      color: "bg-google-red",
      percentage: totalHours > 0 ? ((categoryData.break + categoryData.other) / totalHours) * 100 : 0
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="productivity-chart">
      <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4">
        Weekly Focus
      </h3>
      <div className="space-y-4">
        {chartData.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[color:var(--text-medium)]">
                {item.name}
              </span>
              <span className="text-sm font-medium text-[color:var(--text-dark)]">
                {item.hours.toFixed(1)}h
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`${item.color} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.max(item.percentage, 2)}%` }}
                data-testid={`progress-${item.name.toLowerCase().replace(' ', '-')}`}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {totalHours === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-[color:var(--text-light)]">
            No data available for this week
          </p>
        </div>
      )}
    </div>
  );
}
