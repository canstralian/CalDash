
import { useState } from "react";
import { Calendar, BarChart3, Network, CloudSun } from "lucide-react";
import { Event } from "@/lib/types";

interface AdvancedVisualizationsProps {
  events: Event[];
}

interface HeatmapDay {
  date: string;
  intensity: number;
  events: number;
  focusHours: number;
}

interface NetworkNode {
  id: string;
  name: string;
  type: "person" | "meeting";
  connections: number;
}

export function AdvancedVisualizations({ events }: AdvancedVisualizationsProps) {
  const [activeView, setActiveView] = useState<"heatmap" | "network" | "timeboxing" | "weather">("heatmap");
  
  // Generate heatmap data
  const generateHeatmapData = (): HeatmapDay[] => {
    const days = [];
    const today = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === date.toDateString();
      });
      
      const focusTime = dayEvents
        .filter(e => e.category === "focus")
        .reduce((total, event) => {
          const duration = new Date(event.endTime).getTime() - new Date(event.startTime).getTime();
          return total + duration / (1000 * 60 * 60);
        }, 0);
      
      days.push({
        date: date.toISOString().split('T')[0],
        intensity: Math.min(dayEvents.length / 8, 1), // Normalize to 0-1
        events: dayEvents.length,
        focusHours: focusTime
      });
    }
    
    return days;
  };
  
  // Generate network data
  const generateNetworkData = (): NetworkNode[] => {
    const people = new Map<string, number>();
    
    events.forEach(event => {
      if (event.attendeesCount > 1) {
        // Simulate attendee names for demo
        for (let i = 0; i < Math.min(event.attendeesCount, 5); i++) {
          const name = `Person ${i + 1}`;
          people.set(name, (people.get(name) || 0) + 1);
        }
      }
    });
    
    return Array.from(people.entries()).map(([name, connections]) => ({
      id: name.toLowerCase().replace(' ', '-'),
      name,
      type: "person",
      connections
    }));
  };
  
  const heatmapData = generateHeatmapData();
  const networkData = generateNetworkData();
  
  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return "bg-gray-100";
    if (intensity < 0.3) return "bg-green-200";
    if (intensity < 0.6) return "bg-green-400";
    if (intensity < 0.8) return "bg-green-600";
    return "bg-green-800";
  };
  
  const getProductivityWeather = () => {
    const today = new Date();
    const todayEvents = events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === today.toDateString();
    });
    
    const meetingCount = todayEvents.filter(e => e.category === "meeting").length;
    const focusBlocks = todayEvents.filter(e => e.category === "focus").length;
    
    if (meetingCount > 5) return { weather: "Stormy", icon: "⛈️", description: "High meeting density" };
    if (meetingCount > 3) return { weather: "Cloudy", icon: "☁️", description: "Moderate meeting load" };
    if (focusBlocks > 2) return { weather: "Sunny", icon: "☀️", description: "Great focus potential" };
    return { weather: "Partly Cloudy", icon: "⛅", description: "Mixed productivity day" };
  };
  
  const productivityWeather = getProductivityWeather();
  
  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-dark)]">
            Advanced Analytics
          </h3>
          <div className="flex space-x-2">
            {[
              { key: "heatmap", label: "Heatmap", icon: <Calendar size={16} /> },
              { key: "network", label: "Network", icon: <Network size={16} /> },
              { key: "timeboxing", label: "Time Boxing", icon: <BarChart3 size={16} /> },
              { key: "weather", label: "Weather", icon: <CloudSun size={16} /> }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key as any)}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm ${
                  activeView === view.key
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {view.icon}
                <span>{view.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Heatmap View */}
        {activeView === "heatmap" && (
          <div>
            <h4 className="font-medium mb-4">Activity Heatmap - Last 30 Days</h4>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-gray-500 text-center p-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {heatmapData.map((day, index) => (
                <div
                  key={day.date}
                  className={`w-8 h-8 rounded ${getIntensityColor(day.intensity)} cursor-pointer relative group`}
                  title={`${day.date}: ${day.events} events, ${day.focusHours.toFixed(1)}h focus`}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                    <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {day.date}: {day.events} events
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-2 mt-4 text-xs text-gray-500">
              <span>Less</span>
              <div className="flex space-x-1">
                {[0, 0.2, 0.4, 0.6, 0.8].map((intensity, i) => (
                  <div key={i} className={`w-3 h-3 rounded ${getIntensityColor(intensity)}`} />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        )}
        
        {/* Network View */}
        {activeView === "network" && (
          <div>
            <h4 className="font-medium mb-4">Collaboration Network</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {networkData.slice(0, 6).map((node) => (
                <div key={node.id} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ 
                        transform: `scale(${Math.min(1 + node.connections * 0.1, 1.5)})` 
                      }}
                    >
                      {node.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{node.name}</p>
                      <p className="text-sm text-gray-500">
                        {node.connections} meeting{node.connections !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Time Boxing View */}
        {activeView === "timeboxing" && (
          <div>
            <h4 className="font-medium mb-4">Ideal Day Structure</h4>
            <div className="space-y-2">
              {[
                { time: "9:00 AM", type: "focus", title: "Deep Work Block", duration: "2 hours" },
                { time: "11:00 AM", type: "break", title: "Break", duration: "15 min" },
                { time: "11:15 AM", type: "meeting", title: "Team Sync", duration: "45 min" },
                { time: "12:00 PM", type: "break", title: "Lunch", duration: "1 hour" },
                { time: "1:00 PM", type: "focus", title: "Project Work", duration: "1.5 hours" },
                { time: "2:30 PM", type: "admin", title: "Email & Admin", duration: "30 min" },
                { time: "3:00 PM", type: "meeting", title: "Client Call", duration: "1 hour" },
                { time: "4:00 PM", type: "focus", title: "Wrap-up Tasks", duration: "1 hour" }
              ].map((block, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-16 text-sm text-gray-500 font-mono">
                    {block.time}
                  </div>
                  <div className={`w-4 h-4 rounded ${
                    block.type === "focus" ? "bg-blue-500" :
                    block.type === "meeting" ? "bg-green-500" :
                    block.type === "admin" ? "bg-yellow-500" : "bg-gray-400"
                  }`} />
                  <div className="flex-1">
                    <span className="font-medium">{block.title}</span>
                    <span className="text-sm text-gray-500 ml-2">({block.duration})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Productivity Weather */}
        {activeView === "weather" && (
          <div>
            <h4 className="font-medium mb-4">Productivity Forecast</h4>
            <div className="text-center p-8">
              <div className="text-6xl mb-4">{productivityWeather.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {productivityWeather.weather}
              </h3>
              <p className="text-gray-600 mb-6">{productivityWeather.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Focus Forecast</h4>
                  <p className="text-sm text-blue-600">High concentration potential in morning hours</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800">Meeting Load</h4>
                  <p className="text-sm text-yellow-600">Moderate - plan buffer time</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">Energy Level</h4>
                  <p className="text-sm text-green-600">Peak performance expected 10 AM - 2 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
