import { index, jsonb, pgEnum, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";

import type { ChallengeSolutionMeta } from "@devflow/shared";

export const gameTypeEnum = pgEnum("game_type", [
  "debug_hunt",
  "code_golf",
  "binary_blitz",
  "regex_rumble"
]);

export const challenges = pgTable(
  "challenges",
  {
    id: text("id").primaryKey(),
    gameType: gameTypeEnum("game_type").notNull(),
    difficulty: real("difficulty").notNull(),
    prompt: text("prompt").notNull(),
    solutionMeta: jsonb("solution_meta").$type<ChallengeSolutionMeta>().notNull(),
    testCases: jsonb("test_cases").notNull(),
    createdByModel: text("created_by_model").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    gameDifficultyIdx: index("challenges_game_type_difficulty_idx").on(
      table.gameType,
      table.difficulty
    )
  })
);
