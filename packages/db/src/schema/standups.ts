import { pgTable, text, date, smallint, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const standups = pgTable(
  "standups",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: date("date").notNull(),
    yesterdayDone: text("yesterday_done").array().notNull().default([]),
    todayPlan: text("today_plan").array().notNull().default([]),
    blockers: text("blockers").array().notNull().default([]),
    moodScore: smallint("mood_score"),
    digestMd: text("digest_md"),
    voiceRaw: text("voice_raw"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    userDateUnique: uniqueIndex("standups_user_date_unique").on(table.userId, table.date)
  })
);
