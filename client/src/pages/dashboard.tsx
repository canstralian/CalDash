import { MetricCards } from "@/components/metric-cards";
import { TimeAllocationChart } from "@/components/time-allocation-chart";
import { ProductivityChart } from "@/components/productivity-chart";
import { QuickActions } from "@/components/quick-actions";
import { UpcomingEvents } from "@/components/upcoming-events";
import CalendarPreview from "@/components/calendar-preview";
import { SmartAnalytics } from "@/components/smart-analytics";
import { SmartCalendarAssistant } from "@/components/smart-calendar-assistant";
import { GoalTracker } from "@/components/goal-tracker";
import { TeamInsights } from "@/components/team-insights";
import { IntegrationsHub } from "@/components/integrations-hub";
import { WellnessDashboard } from "@/components/wellness-dashboard";
import { AdvancedVisualizations } from "@/components/advanced-visualizations";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function Dashboard() {
  const { user } = useAuth();

  const { data: calendars = [] } = useQuery({
    queryKey: ["/api/calendars"],
    enabled: !!user,
  }) as { data: any[] };

  const handleConnectCalendar = async () => {
    try {
      const response = await fetch("/api/google-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const { authUrl } = await response.json();
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error("Failed to connect calendar:", error);
    }
  };

  const handleSyncCalendars = async () => {
    try {
      await fetch("/api/calendars/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      // Invalidate calendars query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/calendars"] });
    } catch (error) {
      console.error("Failed to sync calendars:", error);
    }
  };
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar 
        user={user}
        calendars={calendars}
        onConnectCalendar={handleConnectCalendar}
        onSyncCalendars={handleSyncCalendars}
      />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your productivity overview.</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="p-6 space-y-6">
          {/* Metrics Overview */}
          <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <MetricCards />
          </section>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <TimeAllocationChart />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <ProductivityChart />
            </section>
          </div>

          {/* Actions and Events */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            <section className="xl:col-span-1 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <QuickActions />
            </section>

            <section className="xl:col-span-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <UpcomingEvents />
            </section>
          </div>

          {/* Calendar Preview */}
          <section className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <CalendarPreview />
          </section>

          {/* Smart Analytics & Calendar Assistant */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <section className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <SmartAnalytics events={[]} />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
              <SmartCalendarAssistant events={[]} />
            </section>
          </div>

          {/* Goals & Team Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <section className="animate-slide-up" style={{ animationDelay: '1.0s' }}>
              <GoalTracker />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: '1.1s' }}>
              <TeamInsights />
            </section>
          </div>

          {/* Integrations & Wellness */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            <section className="animate-slide-up" style={{ animationDelay: '1.2s' }}>
              <IntegrationsHub />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: '1.3s' }}>
              <WellnessDashboard />
            </section>
          </div>

          {/* Advanced Visualizations */}
          <section className="animate-slide-up" style={{ animationDelay: '1.4s' }}>
            <AdvancedVisualizations events={[]} />
          </section>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-24 h-24 bg-green-400/10 rounded-full blur-2xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}

export default Dashboard;