import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  date,
  uniqueIndex
} from "drizzle-orm/pg-core";

import { gameTypeEnum } from "./challenges.js";
import { users } from "./users.js";

export const leaderboardPeriodEnum = pgEnum("leaderboard_period", ["all_time", "weekly"]);

export const leaderboard = pgTable(
  "leaderboard",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    gameType: gameTypeEnum("game_type").notNull(),
    period: leaderboardPeriodEnum("period").notNull(),
    periodStart: date("period_start"),
    bestScore: integer("best_score").notNull().default(0),
    sessionsPlayed: integer("sessions_played").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    lookupUnique: uniqueIndex("leaderboard_user_game_period_unique").on(
      table.userId,
      table.gameType,
      table.period,
      table.periodStart
    ),
    rankingIdx: index("leaderboard_ranking_idx").on(table.gameType, table.period, table.bestScore)
  })
);
