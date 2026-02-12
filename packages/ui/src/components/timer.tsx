import type * as React from "react";

import { cn } from "../lib/utils";

function Timer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timer"
      className={cn(
        "inline-flex items-center px-1 font-mono font-semibold tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

function TimerGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timer-group"
      className={cn("inline-flex items-baseline", className)}
      {...props}
    />
  );
}

function TimerSegment({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timer-segment"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
}

function TimerSeparator({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timer-separator"
      className={cn("text-foreground/70", className)}
      {...props}
    />
  );
}

export { Timer, TimerGroup, TimerSegment, TimerSeparator };
