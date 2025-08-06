export interface User {
  id: string;
  username: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleTokenExpiry?: Date;
}

export interface Calendar {
  id: string;
  userId: string;
  googleCalendarId: string;
  name: string;
  color: string;
  isConnected: boolean;
  isPrimary: boolean;
}

export interface Event {
  id: string;
  calendarId: string;
  googleEventId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  location?: string;
  category: "focus" | "meeting" | "presentation" | "admin" | "break" | "other";
  attendeesCount: number;
  isRecurring: boolean;
  meetingUrl?: string;
}

export interface ProductivityMetrics {
  todayEvents: number;
  focusTime: string;
  meetings: number;
  productivityScore: string;
  focusHours: number;
  totalHours: number;
}

export interface TimeAllocation {
  focus: number;
  meeting: number;
  admin: number;
  break: number;
  other: number;
}

export type ViewMode = "day" | "week" | "month";

export type EventCategory = Event["category"];
