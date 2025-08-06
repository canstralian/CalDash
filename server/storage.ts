import { users, calendars, events, type User, type UpsertUser, type Calendar, type InsertCalendar, type Event, type InsertEvent } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, inArray, or } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods - (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserTokens(userId: string, accessToken: string, refreshToken: string, expiry: Date): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
        googleTokenExpiry: expiry,
      })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async getUserCalendars(userId: string): Promise<Calendar[]> {
    return await db.select().from(calendars).where(eq(calendars.userId, userId));
  }

  async createCalendar(userId: string, insertCalendar: InsertCalendar): Promise<Calendar> {
    const id = randomUUID();
    const [calendar] = await db
      .insert(calendars)
      .values({
        id,
        userId,
        ...insertCalendar,
      })
      .returning();
    return calendar;
  }

  async updateCalendar(id: string, updates: Partial<Calendar>): Promise<Calendar | undefined> {
    const [calendar] = await db
      .update(calendars)
      .set(updates)
      .where(eq(calendars.id, id))
      .returning();
    return calendar || undefined;
  }

  async deleteCalendar(id: string): Promise<boolean> {
    const result = await db.delete(calendars).where(eq(calendars.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getCalendarEvents(calendarId: string, startDate?: Date, endDate?: Date): Promise<Event[]> {
    let whereConditions = [eq(events.calendarId, calendarId)];

    if (startDate) {
      whereConditions.push(gte(events.startTime, startDate));
    }
    if (endDate) {
      whereConditions.push(lte(events.endTime, endDate));
    }

    const result = await db
      .select()
      .from(events)
      .where(and(...whereConditions))
      .orderBy(events.startTime);
    
    return result;
  }

  async getUserEvents(userId: string, startDate?: Date, endDate?: Date): Promise<Event[]> {
    const userCalendars = await this.getUserCalendars(userId);
    const calendarIds = userCalendars.map(cal => cal.id);
    
    if (calendarIds.length === 0) return [];

    let whereConditions = [inArray(events.calendarId, calendarIds)];

    if (startDate) {
      whereConditions.push(gte(events.startTime, startDate));
    }
    if (endDate) {
      whereConditions.push(lte(events.endTime, endDate));
    }

    const result = await db
      .select()
      .from(events)
      .where(and(...whereConditions))
      .orderBy(events.startTime);
    
    return result;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const [event] = await db
      .insert(events)
      .values({
        id,
        ...insertEvent,
      })
      .returning();
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const [event] = await db
      .update(events)
      .set(updates)
      .where(eq(events.id, id))
      .returning();
    return event || undefined;
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteEventsByCalendar(calendarId: string): Promise<void> {
    await db.delete(events).where(eq(events.calendarId, calendarId));
  }
}

export const storage = new DatabaseStorage();
