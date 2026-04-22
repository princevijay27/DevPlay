import { faker } from "@faker-js/faker";
import { sql as dsql } from "drizzle-orm";

import { db, sql as client } from "./client.js";
import { challenges, gameSessions, leaderboard, standups, tasks, users } from "./schema/index.js";

const userId = "user_local_demo";

async function seed() {
  await db.execute(
    dsql`TRUNCATE TABLE leaderboard, game_sessions, standups, tasks, challenges, users RESTART IDENTITY CASCADE`
  );

  await db.insert(users).values({
    id: userId,
    email: "demo@devflow.app",
    name: "DevFlow Demo",
    timezone: "Asia/Kolkata",
    preferredLanguages: ["TypeScript", "SQL"],
    workingHoursStart: "09:00:00",
    workingHoursEnd: "18:00:00"
  });

  const challengeRows = Array.from({ length: 5 }, (_, index) => ({
    id: crypto.randomUUID(),
    gameType: ["debug_hunt", "code_golf", "binary_blitz", "regex_rumble"][index % 4] as
      | "debug_hunt"
      | "code_golf"
      | "binary_blitz"
      | "regex_rumble",
    difficulty: Number((1 + index * 0.5).toFixed(1)),
    prompt: `Challenge ${index + 1}: ${faker.hacker.phrase()}`,
    solutionMeta: {
      expectedAnswers: [faker.word.words(2)],
      alternateAnswers: [faker.word.words(2)],
      explanation: faker.lorem.sentence()
    },
    testCases: [
      {
        input: faker.word.words(3),
        output: faker.word.words(2)
      }
    ],
    createdByModel: "claude-sonnet-4-20250514"
  }));

  await db.insert(challenges).values(challengeRows);

  const taskRows = Array.from({ length: 10 }, (_, index) => ({
    id: crypto.randomUUID(),
    userId,
    title: faker.hacker.verb() + " " + faker.hacker.noun(),
    description: faker.lorem.sentence(),
    priority: ["P0", "P1", "P2", "P3"][index % 4] as "P0" | "P1" | "P2" | "P3",
    tags: [faker.helpers.arrayElement(["api", "infra", "frontend", "voice"])],
    category: faker.helpers.arrayElement(["build", "ops", "feature"]),
    deadline: faker.date.soon({ days: 10 }),
    status: faker.helpers.arrayElement(["todo", "in_progress", "blocked", "done"] as const),
    voiceRaw: faker.lorem.sentence(),
    source: faker.helpers.arrayElement(["voice", "manual"] as const)
  }));

  await db.insert(tasks).values(taskRows);

  const standupRows = Array.from({ length: 3 }, (_, index) => ({
    id: crypto.randomUUID(),
    userId,
    date: faker.date.recent({ days: 3 - index }).toISOString().slice(0, 10),
    yesterdayDone: [faker.hacker.phrase()],
    todayPlan: [faker.hacker.phrase()],
    blockers: index === 0 ? [faker.hacker.phrase()] : [],
    moodScore: faker.number.int({ min: 3, max: 5 }),
    digestMd: `## Daily Digest\n\n${faker.lorem.paragraph()}`,
    voiceRaw: faker.lorem.sentences(2)
  }));

  await db.insert(standups).values(standupRows);

  const sessionRows = Array.from({ length: 6 }, (_, index) => ({
    id: crypto.randomUUID(),
    userId,
    gameType: challengeRows[index % challengeRows.length]!.gameType,
    difficulty: challengeRows[index % challengeRows.length]!.difficulty,
    score: faker.number.int({ min: 120, max: 950 }),
    hintsUsed: faker.number.int({ min: 0, max: 3 }),
    durationSeconds: faker.number.int({ min: 45, max: 600 }),
    outcome: faker.helpers.arrayElement(["win", "loss", "abandon"] as const),
    challengeId: challengeRows[index % challengeRows.length]!.id
  }));

  await db.insert(gameSessions).values(sessionRows);

  await db.insert(leaderboard).values(
    [
      {
        id: crypto.randomUUID(),
        userId,
        gameType: "debug_hunt",
        period: "all_time",
        periodStart: null,
        bestScore: 820,
        sessionsPlayed: 4
      },
      {
        id: crypto.randomUUID(),
        userId,
        gameType: "regex_rumble",
        period: "weekly",
        periodStart: new Date().toISOString().slice(0, 10),
        bestScore: 630,
        sessionsPlayed: 2
      }
    ].map((entry) => ({
      ...entry,
      updatedAt: new Date()
    }))
  );

  console.log("Seed complete.");
  await client.end();
}

seed().catch(async (error) => {
  console.error(error);
  await client.end();
  process.exit(1);
});
