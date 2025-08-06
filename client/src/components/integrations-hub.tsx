
import { useState } from "react";
import { Zap, Mail, MessageSquare, FileText, Calendar, CheckCircle, Settings } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: "task" | "communication" | "automation" | "analytics";
  isConnected: boolean;
  icon: React.ReactNode;
  description: string;
  features: string[];
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  timesTriggered: number;
}

export function IntegrationsHub() {
  const [integrations] = useState<Integration[]>([
    {
      id: "todoist",
      name: "Todoist",
      type: "task",
      isConnected: false,
      icon: <CheckCircle size={20} />,
      description: "Sync tasks and track completion rates",
      features: ["Task sync", "Completion tracking", "Project insights"]
    },
    {
      id: "slack",
      name: "Slack",
      type: "communication",
      isConnected: true,
      icon: <MessageSquare size={20} />,
      description: "Import meeting summaries and action items",
      features: ["Meeting summaries", "Status updates", "Team notifications"]
    },
    {
      id: "notion",
      name: "Notion",
      type: "task",
      isConnected: false,
      icon: <FileText size={20} />,
      description: "Unified productivity workspace integration",
      features: ["Page creation", "Database sync", "Template automation"]
    },
    {
      id: "email",
      name: "Email Analytics",
      type: "analytics",
      isConnected: true,
      icon: <Mail size={20} />,
      description: "Track email time and suggest batching",
      features: ["Time tracking", "Batching suggestions", "Response analytics"]
    }
  ]);
  
  const [automationRules] = useState<AutomationRule[]>([
    {
      id: "1",
      name: "Auto Buffer Time",
      trigger: "Back-to-back meetings detected",
      action: "Add 15-minute buffer automatically",
      isActive: true,
      timesTriggered: 23
    },
    {
      id: "2",
      name: "Focus Block Protection",
      trigger: "Meeting request during focus time",
      action: "Suggest alternative time slots",
      isActive: true,
      timesTriggered: 12
    },
    {
      id: "3",
      name: "Weekly Review Reminder",
      trigger: "Friday at 4 PM",
      action: "Create weekly productivity summary",
      isActive: false,
      timesTriggered: 0
    },
    {
      id: "4",
      name: "Overtime Alert",
      trigger: "Work hours exceed 9 hours",
      action: "Send wellness reminder notification",
      isActive: true,
      timesTriggered: 8
    }
  ]);
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-100 text-blue-600";
      case "communication": return "bg-green-100 text-green-600";
      case "automation": return "bg-purple-100 text-purple-600";
      case "analytics": return "bg-orange-100 text-orange-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Integrations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4 flex items-center gap-2">
          <Zap size={20} />
          Integrations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(integration.type)}`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                  </div>
                </div>
                
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    integration.isConnected
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                  }`}
                >
                  {integration.isConnected ? "Connected" : "Connect"}
                </button>
              </div>
              
              <div className="space-y-1">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Automation Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[color:var(--text-dark)] flex items-center gap-2">
            <Settings size={20} />
            Automation Rules
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            + Create Rule
          </button>
        </div>
        
        <div className="space-y-3">
          {automationRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium">{rule.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    rule.isActive 
                      ? "bg-green-100 text-green-600" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">When:</span> {rule.trigger}</p>
                  <p><span className="font-medium">Then:</span> {rule.action}</p>
                  <p className="text-xs text-gray-500">
                    Triggered {rule.timesTriggered} times this month
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  className={`w-10 h-6 rounded-full ${
                    rule.isActive ? "bg-green-500" : "bg-gray-300"
                  } relative transition-colors`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                    rule.isActive ? "translate-x-5" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
