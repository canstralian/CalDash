import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleAccessToken: text("google_access_token"),
  googleRefreshToken: text("google_refresh_token"),
  googleTokenExpiry: timestamp("google_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const calendars = pgTable("calendars", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  googleCalendarId: text("google_calendar_id").notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  isConnected: boolean("is_connected").default(true),
  isPrimary: boolean("is_primary").default(false),
});

export const events = pgTable("events", {
  id: varchar("id").primaryKey(),
  calendarId: varchar("calendar_id").notNull().references(() => calendars.id),
  googleEventId: text("google_event_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isAllDay: boolean("is_all_day").default(false),
  location: text("location"),
  category: text("category").default("other"), // focus, meeting, presentation, admin, break
  attendeesCount: integer("attendees_count").default(0),
  isRecurring: boolean("is_recurring").default(false),
  meetingUrl: text("meeting_url"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  calendars: many(calendars),
}));

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  user: one(users, {
    fields: [calendars.userId],
    references: [users.id],
  }),
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  calendar: one(calendars, {
    fields: [events.calendarId],
    references: [calendars.id],
  }),
}));

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertCalendarSchema = createInsertSchema(calendars).omit({
  id: true,
  userId: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCalendar = z.infer<typeof insertCalendarSchema>;
export type Calendar = typeof calendars.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
