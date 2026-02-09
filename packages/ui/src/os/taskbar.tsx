import * as React from "react";
import { cn } from "../lib/utils";

export type TaskbarBarSize = "sm" | "md";

export type TaskbarProps = React.ComponentPropsWithoutRef<"nav"> & {
  size?: TaskbarBarSize;
};

function Taskbar({ size = "md", className, ...props }: TaskbarProps) {
  return (
    <nav
      data-size={size}
      className={cn(
        "flex items-center gap-3 border border-border/40 bg-background/90 text-foreground backdrop-blur-md",
        "data-[size=sm]:h-10 data-[size=sm]:px-3",
        "data-[size=md]:h-12",
        className,
      )}
      {...props}
    />
  );
}

export type TaskbarSectionAlign = "start" | "center" | "end";

export type TaskbarSectionProps = React.ComponentPropsWithoutRef<"div"> & {
  align?: TaskbarSectionAlign;
  grow?: boolean;
};

function TaskbarSection({
  align = "start",
  grow = false,
  className,
  ...props
}: TaskbarSectionProps) {
  return (
    <div
      data-align={align}
      data-grow={grow}
      className={cn(
        "flex items-center gap-2",
        "data-[grow=true]:flex-1",
        "data-[align=center]:justify-center",
        "data-[align=end]:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export type TaskbarDividerProps = React.ComponentPropsWithoutRef<"span">;

function TaskbarDivider({ className, ...props }: TaskbarDividerProps) {
  return (
    <span
      aria-hidden
      className={cn("h-6 w-px bg-border/60", className)}
      {...props}
    />
  );
}

export type TaskbarItemVariant = "icon" | "label" | "pill";

export type TaskbarItemProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: TaskbarItemVariant;
  active?: boolean;
};

const TaskbarItem = React.forwardRef<HTMLButtonElement, TaskbarItemProps>(
  (
    { variant = "label", active = false, className, type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      data-variant={variant}
      data-active={active}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl text-sm transition",
        "hover:bg-muted/60 data-[active=true]:bg-muted/70",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring/50",
        "data-[variant=icon]:h-9 data-[variant=icon]:w-9",
        "data-[variant=label]:h-9 data-[variant=label]:px-3",
        "data-[variant=pill]:h-8 data-[variant=pill]:px-2",
        className,
      )}
      {...props}
    />
  ),
);
TaskbarItem.displayName = "TaskbarItem";

export type TaskbarIconProps = React.ComponentPropsWithoutRef<"span">;

function TaskbarIcon({ className, ...props }: TaskbarIconProps) {
  return (
    <span
      className={cn(
        "flex size-6 items-center justify-center rounded-lg bg-muted/70 font-semibold text-[11px] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Taskbar, TaskbarDivider, TaskbarIcon, TaskbarItem, TaskbarSection };
