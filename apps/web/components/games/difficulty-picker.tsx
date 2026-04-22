"use client";

import { useEffect, useId, useMemo, useState } from "react";

import { Badge } from "../ui/badge";

const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;
const STEP = 0.25;

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

export function DifficultyPicker({
  defaultValue,
  gameName,
  onChange
}: {
  defaultValue: number;
  gameName: string;
  onChange?: (value: number) => void;
}) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue);
  const label = useMemo(() => getDifficultyLabel(value), [value]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-foreground)]">
            Difficulty override
          </label>
          <p className="text-xs text-[var(--color-muted)]">{gameName} will use this value for the next session.</p>
        </div>
        <Badge variant="accent">{`${value.toFixed(2)} - ${label}`}</Badge>
      </div>

      <input
        id={inputId}
        type="range"
        min={MIN_DIFFICULTY}
        max={MAX_DIFFICULTY}
        step={STEP}
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.currentTarget.value);
          setValue(nextValue);
          onChange?.(nextValue);
        }}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-border)] accent-[var(--color-primary)]"
      />

      <div className="flex justify-between text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
        <span>Easy</span>
        <span>Normal</span>
        <span>Hard</span>
        <span>Expert</span>
      </div>
    </div>
  );
}
