export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus: string;
  }>;
  recurringEventId?: string;
  hangoutLink?: string;
}

export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  backgroundColor?: string;
  primary?: boolean;
  accessRole: string;
}

export const syncCalendars = async (): Promise<GoogleCalendar[]> => {
  try {
    const response = await fetch("/api/calendars/sync", {
      method: "POST",
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Failed to sync calendars");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Calendar sync error:", error);
    throw error;
  }
};

export const syncEvents = async (): Promise<{ message: string }> => {
  try {
    const response = await fetch("/api/events/sync", {
      method: "POST",
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error("Failed to sync events");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Events sync error:", error);
    throw error;
  }
};

export const categorizeEvent = (title: string, description?: string): string => {
  const text = `${title} ${description || ""}`.toLowerCase();
  
  if (text.includes("meeting") || text.includes("sync") || text.includes("standup")) {
    return "meeting";
  }
  
  if (text.includes("focus") || text.includes("work") || text.includes("dev") || text.includes("code")) {
    return "focus";
  }
  
  if (text.includes("presentation") || text.includes("demo") || text.includes("review")) {
    return "presentation";
  }
  
  if (text.includes("admin") || text.includes("planning") || text.includes("1:1")) {
    return "admin";
  }
  
  if (text.includes("break") || text.includes("lunch") || text.includes("personal")) {
    return "break";
  }
  
  return "other";
};
