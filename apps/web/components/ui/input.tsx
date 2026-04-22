import * as React from "react";

import { cn } from "@devflow/ui";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
