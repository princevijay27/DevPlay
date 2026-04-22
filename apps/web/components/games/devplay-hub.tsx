"use client";

import Link from "next/link";
import {
  Binary,
  Bug,
  Flame,
  Gauge,
  Medal,
  Search,
  Sparkles,
  Trophy
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DifficultyPicker } from "./difficulty-picker";

type GameCard = {
  slug: "debug-hunt" | "binary-blitz" | "code-golf" | "regex-rumble";
  title: string;
  icon: typeof Bug;
  summary: string;
  personalBest: number;
  currentDifficulty: number;
  streak: number;
  currentRank: string;
  accent: string;
};

const GAME_CARDS: GameCard[] = [
  {
    slug: "debug-hunt",
    title: "Debug Hunt",
    icon: Bug,
    summary: "Find the bug, fix the line, and learn why the failure happened.",
    personalBest: 920,
    currentDifficulty: 2.5,
    streak: 3,
    currentRank: "#41 global",
    accent: "text-[var(--color-primary)]"
  },
  {
    slug: "binary-blitz",
    title: "Binary Blitz",
    icon: Binary,
    summary: "Rapid-fire binary, hex, ASCII, and bitwise questions under pressure.",
    personalBest: 1320,
    currentDifficulty: 3,
    streak: 5,
    currentRank: "#18 global",
    accent: "text-[var(--color-accent)]"
  },
  {
    slug: "code-golf",
    title: "Code Golf",
    icon: Gauge,
    summary: "Pass the tests with the fewest possible characters in your chosen language.",
    personalBest: 780,
    currentDifficulty: 3.75,
    streak: 2,
    currentRank: "#57 global",
    accent: "text-[var(--color-primary)]"
  },
  {
    slug: "regex-rumble",
    title: "Regex Rumble",
    icon: Search,
    summary: "Write a pattern that matches the right strings and rejects the traps.",
    personalBest: 860,
    currentDifficulty: 2.25,
    streak: 4,
    currentRank: "#29 global",
    accent: "text-[var(--color-accent)]"
  }
];

function getDifficultyLabel(value: number) {
  if (value < 1.75) {
    return "Easy";
  }

  if (value < 2.75) {
    return "Normal";
  }

  if (value < 4) {
    return "Hard";
  }

  return "Expert";
}

export function DevPlayHub() {
  const [selectedGame, setSelectedGame] = useState<GameCard["slug"]>(GAME_CARDS[0].slug);
  const [difficultyByGame, setDifficultyByGame] = useState<Record<GameCard["slug"], number>>({
    "debug-hunt": 2.5,
    "binary-blitz": 3,
    "code-golf": 3.75,
    "regex-rumble": 2.25
  });

  const selectedCard = useMemo(
    () => GAME_CARDS.find((card) => card.slug === selectedGame) ?? GAME_CARDS[0],
    [selectedGame]
  );
  const SelectedIcon = selectedCard.icon;

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>DevPlay</Badge>
          <Badge variant="accent">4 game modes</Badge>
          <Badge>{selectedCard.currentRank}</Badge>
        </div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Developer game suite</h1>
        <p className="max-w-3xl text-[var(--color-muted)]">
          DevPlay is the play layer of DevFlow: short, deliberate practice loops for debugging, binary fluency,
          code golf, and regex thinking. This hub is the entry point for game selection, personal stats, and
          difficulty control.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {GAME_CARDS.map(({ slug, title, icon: Icon, summary, personalBest, streak, currentRank, accent }) => {
            const nextDifficulty = difficultyByGame[slug];

            return (
              <Card
                key={slug}
                className={slug === selectedGame ? "ring-2 ring-[var(--color-accent)]" : undefined}
              >
                <CardHeader className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)]">
                          <Icon className={`h-5 w-5 ${accent}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{title}</CardTitle>
                          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-muted)]">{currentRank}</p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-muted)]">{summary}</p>
                    </div>
                    <Badge variant="accent">{getDifficultyLabel(nextDifficulty)}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[var(--color-surface-muted)] p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        <Trophy className="h-3.5 w-3.5" />
                        Best
                      </div>
                      <p className="mt-2 text-2xl font-semibold">{personalBest}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-surface-muted)] p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        <Flame className="h-3.5 w-3.5" />
                        Streak
                      </div>
                      <p className="mt-2 text-2xl font-semibold">{streak}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--color-surface-muted)] p-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        <Sparkles className="h-3.5 w-3.5" />
                        Diff
                      </div>
                      <p className="mt-2 text-2xl font-semibold">{nextDifficulty.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link href={`/play/${slug}`}>Play</Link>
                    </Button>
                    <Button variant="secondary" onClick={() => setSelectedGame(slug)}>
                      Tune difficulty
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Selected game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
                <div className="flex items-center gap-3">
                  <SelectedIcon className={`h-5 w-5 ${selectedCard.accent}`} />
                  <div>
                    <p className="font-medium">{selectedCard.title}</p>
                    <p className="text-sm text-[var(--color-muted)]">{selectedCard.summary}</p>
                  </div>
                </div>
              </div>

              <DifficultyPicker
                gameName={selectedCard.title}
                defaultValue={difficultyByGame[selectedCard.slug]}
                onChange={(value) =>
                  setDifficultyByGame((current) => ({
                    ...current,
                    [selectedCard.slug]: value
                  }))
                }
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    <Medal className="h-3.5 w-3.5" />
                    Personal best
                  </div>
                  <p className="mt-2 text-3xl font-semibold">{selectedCard.personalBest}</p>
                </div>
                <div className="rounded-2xl border border-[var(--color-border)] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    <Flame className="h-3.5 w-3.5" />
                    Current streak
                  </div>
                  <p className="mt-2 text-3xl font-semibold">{selectedCard.streak}</p>
                </div>
              </div>

              <p className="text-sm text-[var(--color-muted)]">
                Preview: the next {selectedCard.title} challenge will open at difficulty{" "}
                <span className="font-semibold text-[var(--color-foreground)]">
                  {difficultyByGame[selectedCard.slug].toFixed(2)}
                </span>{" "}
                ({getDifficultyLabel(difficultyByGame[selectedCard.slug])}).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
