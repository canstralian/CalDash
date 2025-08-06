import { BarChart3, Calendar, CalendarDays, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  user: any;
  calendars: any[];
  onConnectCalendar: () => void;
  onSyncCalendars: () => void;
}

const categoryColors = {
  work: "#4285F4",
  personal: "#34A853", 
  team: "#EA4335",
  other: "#FBBC04"
};

export default function Sidebar({ user, calendars, onConnectCalendar, onSyncCalendars }: SidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-google-blue rounded-lg flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[color:var(--text-dark)]">
              Calendar Hub
            </h1>
            <p className="text-sm text-[color:var(--text-medium)]">
              Productivity Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-[color:var(--text-light)] uppercase tracking-wider mb-3">
            Overview
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start bg-google-blue text-white hover:bg-blue-600"
            data-testid="nav-dashboard"
          >
            <BarChart3 className="h-4 w-4 mr-3" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[color:var(--text-medium)] hover:bg-gray-100"
            data-testid="nav-calendar"
          >
            <Calendar className="h-4 w-4 mr-3" />
            Calendar Views
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-[color:var(--text-medium)] hover:bg-gray-100"
            data-testid="nav-analytics"
          >
            <BarChart3 className="h-4 w-4 mr-3" />
            Analytics
          </Button>
        </div>

        <div className="space-y-1 pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-[color:var(--text-light)] uppercase tracking-wider">
              Calendar Feeds
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSyncCalendars}
              className="h-6 w-6 p-0 text-[color:var(--text-light)] hover:text-[color:var(--text-medium)]"
              data-testid="button-sync-calendars"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              data-testid={`calendar-${calendar.id}`}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: calendar.color }}
              ></div>
              <span className="text-sm text-[color:var(--text-medium)] flex-1 truncate">
                {calendar.name}
              </span>
              <div className="ml-auto">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    calendar.isConnected ? "bg-google-green" : "bg-gray-300"
                  }`}
                  title={calendar.isConnected ? "Connected" : "Disconnected"}
                ></div>
              </div>
            </div>
          ))}

          {calendars.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-[color:var(--text-light)] mb-2">
                No calendars connected
              </p>
            </div>
          )}
        </div>

        <div className="pt-6">
          <Button
            variant="ghost"
            onClick={onConnectCalendar}
            className="w-full justify-start text-google-blue hover:bg-blue-50"
            data-testid="button-connect-calendar"
          >
            <Plus className="h-4 w-4 mr-3" />
            Connect Calendar
          </Button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-google-blue rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[color:var(--text-dark)] truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-[color:var(--text-medium)] truncate">
              {user?.username || "user@example.com"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-[color:var(--text-light)] hover:text-[color:var(--text-medium)]"
            data-testid="button-user-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
