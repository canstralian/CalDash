import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCalendarSchema, insertEventSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { google } from 'googleapis';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5000/auth/google/callback";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Google Calendar integration routes
  app.post("/api/google-auth", isAuthenticated, (req, res) => {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    
    const scopes = [
      'https://www.googleapis.com/auth/calendar.readonly',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: req.user?.claims?.sub // Pass user ID in state
    });

    res.json({ authUrl });
  });

  app.post("/api/google-callback", isAuthenticated, async (req, res) => {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Authorization code not found" });
    }

    try {
      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      const { tokens } = await oauth2Client.getToken(code);
      
      if (!tokens.access_token) {
        return res.status(400).json({ message: "Failed to obtain tokens" });
      }

      // Update user tokens
      const userId = req.user?.claims?.sub;
      const expiry = tokens.expiry_date ? new Date(tokens.expiry_date) : new Date(Date.now() + 3600000);
      await storage.updateUserTokens(userId, tokens.access_token, tokens.refresh_token || "", expiry);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.status(500).json({ message: "Failed to connect Google Calendar" });
    }
  });

  app.get("/api/calendars", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;

    try {
      const calendars = await storage.getUserCalendars(userId);
      res.json(calendars);
    } catch (error) {
      console.error("Error fetching calendars:", error);
      res.status(500).json({ message: "Failed to fetch calendars" });
    }
  });

  app.post("/api/calendars/sync", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;

    try {
      const user = await storage.getUser(userId);
      if (!user?.googleAccessToken) {
        return res.status(400).json({ message: "Google account not connected" });
      }

      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const calendarList = await calendar.calendarList.list();

      const syncedCalendars = [];
      for (const calItem of calendarList.data.items || []) {
        if (calItem.id && calItem.summary) {
          let existingCalendar = (await storage.getUserCalendars(userId))
            .find(cal => cal.googleCalendarId === calItem.id);
          
          if (!existingCalendar) {
            existingCalendar = await storage.createCalendar(userId, {
              googleCalendarId: calItem.id,
              name: calItem.summary,
              color: calItem.backgroundColor || "#4285F4",
              isConnected: true,
              isPrimary: calItem.primary || false
            });
          }
          syncedCalendars.push(existingCalendar);
        }
      }

      res.json(syncedCalendars);
    } catch (error) {
      console.error("Error syncing calendars:", error);
      res.status(500).json({ message: "Failed to sync calendars" });
    }
  });

  app.get("/api/events", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;

    try {
      const { start, end } = req.query;
      const startDate = start ? new Date(start as string) : undefined;
      const endDate = end ? new Date(end as string) : undefined;

      const events = await storage.getUserEvents(userId, startDate, endDate);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events/sync", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;

    try {
      const user = await storage.getUser(userId);
      if (!user?.googleAccessToken) {
        return res.status(400).json({ message: "Google account not connected" });
      }

      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const userCalendars = await storage.getUserCalendars(userId);

      const timeMin = new Date().toISOString();
      const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // Next 7 days

      let syncedEventsCount = 0;
      
      for (const cal of userCalendars) {
        if (!cal.isConnected) continue;

        // Clear existing events for this calendar
        await storage.deleteEventsByCalendar(cal.id);

        // Fetch events from Google Calendar
        const eventsResponse = await calendar.events.list({
          calendarId: cal.googleCalendarId,
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: 'startTime'
        });

        for (const event of eventsResponse.data.items || []) {
          if (!event.id || !event.summary) continue;

          const startTime = event.start?.dateTime ? new Date(event.start.dateTime) : 
                           event.start?.date ? new Date(event.start.date) : new Date();
          const endTime = event.end?.dateTime ? new Date(event.end.dateTime) :
                         event.end?.date ? new Date(event.end.date) : new Date(startTime.getTime() + 3600000);

          // Categorize events based on keywords
          let category = "other";
          const title = event.summary.toLowerCase();
          if (title.includes("meeting") || title.includes("sync") || title.includes("standup")) {
            category = "meeting";
          } else if (title.includes("focus") || title.includes("work") || title.includes("dev")) {
            category = "focus";
          } else if (title.includes("presentation") || title.includes("demo")) {
            category = "presentation";
          } else if (title.includes("admin") || title.includes("planning")) {
            category = "admin";
          } else if (title.includes("break") || title.includes("lunch")) {
            category = "break";
          }

          await storage.createEvent({
            calendarId: cal.id,
            googleEventId: event.id,
            title: event.summary,
            description: event.description || null,
            startTime,
            endTime,
            isAllDay: !!event.start?.date,
            location: event.location || null,
            category,
            attendeesCount: event.attendees?.length || 0,
            isRecurring: !!event.recurringEventId,
            meetingUrl: event.hangoutLink || event.location || null
          });

          syncedEventsCount++;
        }
      }

      res.json({ message: `Synced ${syncedEventsCount} events successfully` });
    } catch (error) {
      console.error("Error syncing events:", error);
      res.status(500).json({ message: "Failed to sync events" });
    }
  });

  app.get("/api/metrics", isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayEvents = await storage.getUserEvents(userId, today, tomorrow);
      
      // Calculate metrics
      const totalEvents = todayEvents.length;
      const focusTime = todayEvents
        .filter(e => e.category === 'focus')
        .reduce((total, event) => {
          const duration = new Date(event.endTime).getTime() - new Date(event.startTime).getTime();
          return total + duration;
        }, 0);
      
      const meetings = todayEvents.filter(e => e.category === 'meeting').length;
      
      // Simple productivity score calculation
      const focusHours = focusTime / (1000 * 60 * 60);
      const productivityScore = Math.min(100, Math.round((focusHours / 8) * 100));

      res.json({
        todayEvents: totalEvents,
        focusTime: `${(focusHours).toFixed(1)}h`,
        meetings,
        productivityScore: `${productivityScore}%`,
        focusHours,
        totalHours: todayEvents.reduce((total, event) => {
          const duration = new Date(event.endTime).getTime() - new Date(event.startTime).getTime();
          return total + duration / (1000 * 60 * 60);
        }, 0)
      });
    } catch (error) {
      console.error("Error calculating metrics:", error);
      res.status(500).json({ message: "Failed to calculate metrics" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
