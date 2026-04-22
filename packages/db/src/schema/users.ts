import { index, pgTable, text, time, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name"),
    timezone: text("timezone").notNull().default("UTC"),
    workingHoursStart: time("working_hours_start"),
    workingHoursEnd: time("working_hours_end"),
    preferredLanguages: text("preferred_languages").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email)
  })
);
