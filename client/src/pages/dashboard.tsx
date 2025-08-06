import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import MetricCards from "@/components/metric-cards";
import CalendarPreview from "@/components/calendar-preview";
import ProductivityChart from "@/components/productivity-chart";
import UpcomingEvents from "@/components/upcoming-events";
import QuickActions from "@/components/quick-actions";
import TimeAllocationChart from "@/components/time-allocation-chart";
import { Calendar, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: calendars = [], refetch: refetchCalendars } = useQuery({
    queryKey: ["/api/calendars"],
    enabled: !!user,
  });

  const { data: events = [], refetch: refetchEvents } = useQuery({
    queryKey: ["/api/events"],
    enabled: !!user,
  });

  const { data: metrics, refetch: refetchMetrics } = useQuery({
    queryKey: ["/api/metrics"],
    enabled: !!user,
  });

  const handleConnectGoogle = () => {
    window.location.href = "/auth/google";
  };

  const handleSyncCalendars = async () => {
    try {
      const response = await fetch("/api/calendars/sync", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        await refetchCalendars();
        toast({
          title: "Calendars synced",
          description: "Successfully synced your Google calendars.",
        });
      } else {
        throw new Error("Failed to sync calendars");
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync calendars. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSyncEvents = async () => {
    try {
      const response = await fetch("/api/events/sync", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        await Promise.all([refetchEvents(), refetchMetrics()]);
        queryClient.invalidateQueries();
        toast({
          title: "Events synced",
          description: "Successfully synced your calendar events.",
        });
      } else {
        throw new Error("Failed to sync events");
      }
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Failed to sync events. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = async () => {
    await Promise.all([refetchCalendars(), refetchEvents(), refetchMetrics()]);
    queryClient.invalidateQueries();
    toast({
      title: "Data refreshed",
      description: "All data has been refreshed.",
    });
  };

  // Show auth prompt if no user
  if (userError || (!userLoading && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg-light)]">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 max-w-md">
          <div className="w-16 h-16 bg-google-blue rounded-xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-[color:var(--text-dark)] mb-4">
            Welcome to Calendar Hub
          </h1>
          <p className="text-[color:var(--text-medium)] mb-6">
            Connect your Google Calendar to get started with productivity tracking
          </p>
          <Button
            onClick={handleConnectGoogle}
            className="w-full bg-google-blue hover:bg-blue-600"
            data-testid="button-connect-google"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Connect Google Calendar
          </Button>
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg-light)]">
        <div className="animate-spin w-8 h-8 border-2 border-google-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[color:var(--bg-light)]">
      <Sidebar 
        user={user} 
        calendars={calendars}
        onConnectCalendar={handleConnectGoogle}
        onSyncCalendars={handleSyncCalendars}
      />
      
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-[color:var(--text-dark)]">
                Dashboard Overview
              </h2>
              <p className="text-sm text-[color:var(--text-medium)] mt-1">
                Welcome back! Here's your productivity summary for today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <Calendar className="h-4 w-4 text-[color:var(--text-medium)]" />
                <span className="text-sm font-medium text-[color:var(--text-dark)]">
                  Today
                </span>
                <ChevronDown className="h-3 w-3 text-[color:var(--text-light)]" />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-google-green rounded-full"></div>
                <span className="text-sm text-[color:var(--text-medium)]">
                  Synced
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshData}
                  className="text-[color:var(--text-medium)] hover:text-[color:var(--text-dark)]"
                  data-testid="button-refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          <MetricCards metrics={metrics} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CalendarPreview events={events} />
            </div>
            <div className="space-y-6">
              <ProductivityChart events={events} />
              <UpcomingEvents events={events} />
              <QuickActions onSyncEvents={handleSyncEvents} />
            </div>
          </div>
          
          <TimeAllocationChart events={events} />
        </div>
      </main>
    </div>
  );
}
