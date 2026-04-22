import { sql } from "drizzle-orm";
import { index, pgEnum, pgTable, text, timestamp, date, vector } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const taskPriorityEnum = pgEnum("task_priority", ["P0", "P1", "P2", "P3"]);
export const taskStatusEnum = pgEnum("task_status", [
  "backlog",
  "todo",
  "in_progress",
  "blocked",
  "done"
]);
export const taskSourceEnum = pgEnum("task_source", ["voice", "manual", "import"]);

export const tasks = pgTable(
  "tasks",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    priority: taskPriorityEnum("priority").notNull().default("P2"),
    tags: text("tags").array().notNull().default([]),
    category: text("category"),
    deadline: timestamp("deadline", { withTimezone: true }),
    status: taskStatusEnum("status").notNull().default("todo"),
    voiceRaw: text("voice_raw"),
    embedding: vector("embedding", { dimensions: 1536 }),
    source: taskSourceEnum("source").notNull().default("manual"),
    standupDate: date("standup_date"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    userStatusIdx: index("tasks_user_status_idx").on(table.userId, table.status),
    userDeadlineIdx: index("tasks_user_deadline_idx").on(table.userId, table.deadline),
    embeddingHnswIdx: index("tasks_embedding_hnsw_idx").using(
      "hnsw",
      sql`${table.embedding} vector_cosine_ops`
    )
  })
);
