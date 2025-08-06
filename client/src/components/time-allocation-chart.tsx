
import { useState } from "react";

interface TimeBlock {
  type: 'deep-work' | 'meetings' | 'admin' | 'break';
  duration: number;
  startTime: string;
  title: string;
}

export function TimeAllocationChart() {
  const timeBlocks: TimeBlock[] = [
    { type: 'deep-work', duration: 120, startTime: '9:00', title: 'Feature Development' },
    { type: 'meetings', duration: 60, startTime: '11:00', title: 'Team Standup' },
    { type: 'deep-work', duration: 90, startTime: '12:00', title: 'Code Review' },
    { type: 'break', duration: 30, startTime: '13:30', title: 'Lunch Break' },
    { type: 'admin', duration: 45, startTime: '14:00', title: 'Email & Planning' },
    { type: 'meetings', duration: 90, startTime: '14:45', title: 'Client Call' },
    { type: 'deep-work', duration: 75, startTime: '16:15', title: 'Documentation' },
  ];

  const getBlockColor = (type: TimeBlock['type']) => {
    switch (type) {
      case 'deep-work': return 'bg-gradient-primary';
      case 'meetings': return 'bg-gradient-success';
      case 'admin': return 'bg-gradient-warning';
      case 'break': return 'bg-gradient-danger';
      default: return 'bg-gray-200';
    }
  };

  const getBlockTextColor = (type: TimeBlock['type']) => {
    return type === 'admin' ? 'text-gray-800' : 'text-white';
  };

  const totalDuration = timeBlocks.reduce((sum, block) => sum + block.duration, 0);

  return (
    <div className="glass rounded-xl p-6 hover-lift transition-all duration-300 animate-fade-in border border-white/20">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[color:var(--text-dark)] mb-2">
          Today's Time Allocation
        </h3>
        <p className="text-sm text-[color:var(--text-medium)]">
          Visual breakdown of your {(totalDuration / 60).toFixed(1)} hour workday
        </p>
      </div>

      <div className="space-y-4">
        {/* Timeline visualization */}
        <div className="relative">
          <div className="flex flex-col space-y-2">
            {timeBlocks.map((block, index) => {
              const widthPercentage = (block.duration / totalDuration) * 100;
              
              return (
                <div
                  key={index}
                  className="group relative animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-[color:var(--text-medium)] text-right">
                      {block.startTime}
                    </div>
                    
                    <div className="flex-1 relative">
                      <div
                        className={`${getBlockColor(block.type)} ${getBlockTextColor(block.type)} 
                          rounded-lg p-3 shadow-soft transition-all duration-300 hover:shadow-soft-lg 
                          hover:scale-[1.02] cursor-pointer relative overflow-hidden`}
                        style={{ width: `${Math.max(widthPercentage, 15)}%` }}
                      >
                        <div className="relative z-10">
                          <div className="font-medium text-sm truncate">
                            {block.title}
                          </div>
                          <div className="text-xs opacity-90 mt-1">
                            {block.duration} min
                          </div>
                        </div>
                        
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                      </div>
                    </div>
                    
                    <div className="w-16 text-sm text-[color:var(--text-light)] text-center">
                      {Math.round(widthPercentage)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Enhanced Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: 'deep-work', label: 'Deep Work', color: 'bg-gradient-primary' },
              { type: 'meetings', label: 'Meetings', color: 'bg-gradient-success' },
              { type: 'admin', label: 'Admin', color: 'bg-gradient-warning' },
              { type: 'break', label: 'Break', color: 'bg-gradient-danger' }
            ].map((item, index) => {
              const duration = timeBlocks
                .filter(block => block.type === item.type)
                .reduce((sum, block) => sum + block.duration, 0);
              
              return (
                <div 
                  key={item.type} 
                  className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
                >
                  <div className={`w-4 h-4 ${item.color} rounded-full shadow-sm`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[color:var(--text-dark)]">
                      {item.label}
                    </div>
                    <div className="text-xs text-[color:var(--text-light)]">
                      {Math.round(duration)} min
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
