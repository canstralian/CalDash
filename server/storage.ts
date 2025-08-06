import { type User, type InsertUser, type Calendar, type InsertCalendar, type Event, type InsertEvent } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserTokens(userId: string, accessToken: string, refreshToken: string, expiry: Date): Promise<User>;

  // Calendar methods
  getUserCalendars(userId: string): Promise<Calendar[]>;
  createCalendar(userId: string, calendar: InsertCalendar): Promise<Calendar>;
  updateCalendar(id: string, updates: Partial<Calendar>): Promise<Calendar | undefined>;
  deleteCalendar(id: string): Promise<boolean>;

  // Event methods
  getCalendarEvents(calendarId: string, startDate?: Date, endDate?: Date): Promise<Event[]>;
  getUserEvents(userId: string, startDate?: Date, endDate?: Date): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  deleteEventsByCalendar(calendarId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private calendars: Map<string, Calendar>;
  private events: Map<string, Event>;

  constructor() {
    this.users = new Map();
    this.calendars = new Map();
    this.events = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, googleAccessToken: null, googleRefreshToken: null, googleTokenExpiry: null };
    this.users.set(id, user);
    return user;
  }

  async updateUserTokens(userId: string, accessToken: string, refreshToken: string, expiry: Date): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser: User = {
      ...user,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken,
      googleTokenExpiry: expiry,
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getUserCalendars(userId: string): Promise<Calendar[]> {
    return Array.from(this.calendars.values()).filter(
      (calendar) => calendar.userId === userId,
    );
  }

  async createCalendar(userId: string, insertCalendar: InsertCalendar): Promise<Calendar> {
    const id = randomUUID();
    const calendar: Calendar = { ...insertCalendar, id, userId };
    this.calendars.set(id, calendar);
    return calendar;
  }

  async updateCalendar(id: string, updates: Partial<Calendar>): Promise<Calendar | undefined> {
    const calendar = this.calendars.get(id);
    if (!calendar) return undefined;
    
    const updatedCalendar = { ...calendar, ...updates };
    this.calendars.set(id, updatedCalendar);
    return updatedCalendar;
  }

  async deleteCalendar(id: string): Promise<boolean> {
    return this.calendars.delete(id);
  }

  async getCalendarEvents(calendarId: string, startDate?: Date, endDate?: Date): Promise<Event[]> {
    let events = Array.from(this.events.values()).filter(
      (event) => event.calendarId === calendarId,
    );

    if (startDate) {
      events = events.filter(event => new Date(event.startTime) >= startDate);
    }
    if (endDate) {
      events = events.filter(event => new Date(event.endTime) <= endDate);
    }

    return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async getUserEvents(userId: string, startDate?: Date, endDate?: Date): Promise<Event[]> {
    const userCalendars = await this.getUserCalendars(userId);
    const calendarIds = userCalendars.map(cal => cal.id);
    
    let events = Array.from(this.events.values()).filter(
      (event) => calendarIds.includes(event.calendarId),
    );

    if (startDate) {
      events = events.filter(event => new Date(event.startTime) >= startDate);
    }
    if (endDate) {
      events = events.filter(event => new Date(event.endTime) <= endDate);
    }

    return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updates };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  async deleteEventsByCalendar(calendarId: string): Promise<void> {
    const eventsToDelete = Array.from(this.events.entries())
      .filter(([_, event]) => event.calendarId === calendarId)
      .map(([id, _]) => id);
    
    eventsToDelete.forEach(id => this.events.delete(id));
  }
}

export const storage = new MemStorage();
