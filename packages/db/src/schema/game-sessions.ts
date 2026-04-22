import { index, integer, pgEnum, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import { challenges, gameTypeEnum } from "./challenges.js";
import { users } from "./users.js";

export const gameOutcomeEnum = pgEnum("game_outcome", ["win", "loss", "abandon"]);

export const gameSessions = pgTable(
  "game_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameType: gameTypeEnum("game_type").notNull(),
    difficulty: real("difficulty").notNull(),
    score: integer("score").notNull().default(0),
    hintsUsed: integer("hints_used").notNull().default(0),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    outcome: gameOutcomeEnum("outcome").notNull(),
    challengeId: text("challenge_id").references(() => challenges.id, {
      onDelete: "set null"
    }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    userGameIdx: index("game_sessions_user_game_type_idx").on(table.userId, table.gameType)
  })
);
