
import { MetricCards } from "@/components/metric-cards";
import { TimeAllocationChart } from "@/components/time-allocation-chart";
import { ProductivityChart } from "@/components/productivity-chart";
import { QuickActions } from "@/components/quick-actions";
import { UpcomingEvents } from "@/components/upcoming-events";
import { CalendarPreview } from "@/components/calendar-preview";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-[color:var(--text-dark)] mb-2 tracking-tight">
              Good morning, Alex! 👋
            </h1>
            <p className="text-[color:var(--text-medium)] text-lg">
              Here's what's happening with your productivity today
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Metrics Overview */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <MetricCards />
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <TimeAllocationChart />
          </section>
          
          <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <ProductivityChart />
          </section>
        </div>

        {/* Actions and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <QuickActions />
          </section>
          
          <section className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <UpcomingEvents />
          </section>
        </div>

        {/* Calendar Preview */}
        <section className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
          <CalendarPreview />
        </section>
      </div>

      {/* Floating elements for visual interest */}
      <div className="fixed top-20 right-20 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-24 h-24 bg-green-400/10 rounded-full blur-2xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
    </div>
  );
}
