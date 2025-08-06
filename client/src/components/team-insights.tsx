
import { useState } from "react";
import { Users, DollarSign, Clock, TrendingUp, Calendar } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  focusHours: number;
  meetingHours: number;
  productivityScore: number;
}

interface MeetingCost {
  eventId: string;
  title: string;
  attendeesCount: number;
  duration: number;
  estimatedCost: number;
}

export function TeamInsights() {
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@company.com",
      focusHours: 6.5,
      meetingHours: 2.5,
      productivityScore: 87
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      focusHours: 5.8,
      meetingHours: 3.2,
      productivityScore: 82
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      email: "mike@company.com",
      focusHours: 7.2,
      meetingHours: 1.8,
      productivityScore: 91
    }
  ]);
  
  const [meetingCosts] = useState<MeetingCost[]>([
    {
      eventId: "1",
      title: "Product Strategy Review",
      attendeesCount: 8,
      duration: 90,
      estimatedCost: 1200
    },
    {
      eventId: "2",
      title: "Weekly Team Sync",
      attendeesCount: 6,
      duration: 60,
      estimatedCost: 600
    },
    {
      eventId: "3",
      title: "Client Presentation",
      attendeesCount: 12,
      duration: 120,
      estimatedCost: 2400
    }
  ]);
  
  const totalWeeklyCost = meetingCosts.reduce((sum, cost) => sum + cost.estimatedCost, 0);
  const avgProductivity = teamMembers.reduce((sum, member) => sum + member.productivityScore, 0) / teamMembers.length;
  
  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4 flex items-center gap-2">
          <Users size={20} />
          Team Productivity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Avg Productivity</p>
                <p className="text-2xl font-bold text-blue-700">{avgProductivity.toFixed(0)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Team Members</p>
                <p className="text-2xl font-bold text-green-700">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Weekly Meeting Cost</p>
                <p className="text-2xl font-bold text-red-700">${totalWeeklyCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>
        
        {/* Team Members List */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Team Performance</h4>
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <p className="font-medium text-blue-600">{member.focusHours}h</p>
                  <p className="text-gray-500">Focus</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-orange-600">{member.meetingHours}h</p>
                  <p className="text-gray-500">Meetings</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-green-600">{member.productivityScore}%</p>
                  <p className="text-gray-500">Score</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Meeting Cost Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-[color:var(--text-dark)] mb-4 flex items-center gap-2">
          <DollarSign size={20} />
          Meeting Cost Analysis
        </h3>
        
        <div className="space-y-3">
          {meetingCosts.map((meeting) => (
            <div key={meeting.eventId} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{meeting.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {meeting.attendeesCount} attendees
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {meeting.duration} min
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg">${meeting.estimatedCost}</p>
                <p className="text-sm text-gray-500">estimated cost</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            💡 Consider reducing meeting duration by 25% to save ~${Math.round(totalWeeklyCost * 0.25).toLocaleString()} weekly
          </p>
        </div>
      </div>
    </div>
  );
}
