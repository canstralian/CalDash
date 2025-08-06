import { Plus, Brain, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  onSyncEvents?: () => void;
}

export default function QuickActions({ onSyncEvents }: QuickActionsProps) {
  const { toast } = useToast();

  const handleScheduleEvent = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Event scheduling will be available in a future update.",
    });
  };

  const handleBlockFocusTime = () => {
    toast({
      title: "Feature Coming Soon", 
      description: "Focus time blocking will be available in a future update.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Data export will be available in a future update.",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-testid="quick-actions">
      <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        <Button
          onClick={handleScheduleEvent}
          className="w-full justify-start bg-google-blue hover:bg-blue-600 text-white"
          data-testid="button-schedule-event"
        >
          <Plus className="h-4 w-4 mr-3" />
          Schedule Event
        </Button>
        <Button
          onClick={handleBlockFocusTime}
          variant="outline"
          className="w-full justify-start hover:bg-gray-50"
          data-testid="button-block-focus"
        >
          <Brain className="h-4 w-4 mr-3" />
          Block Focus Time
        </Button>
        <Button
          onClick={onSyncEvents}
          variant="outline"
          className="w-full justify-start hover:bg-gray-50"
          data-testid="button-sync-events"
        >
          <Download className="h-4 w-4 mr-3" />
          Sync Events
        </Button>
        <Button
          onClick={handleExportData}
          variant="outline"
          className="w-full justify-start hover:bg-gray-50"
          data-testid="button-export-data"
        >
          <Download className="h-4 w-4 mr-3" />
          Export Data
        </Button>
      </div>
    </div>
  );
}
