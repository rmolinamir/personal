import * as React from "react";
import { cn } from "../lib/utils";

export type DockBarSize = "sm" | "md";

export type DockPosition = "bottom" | "top";

export type DockProps = React.ComponentPropsWithoutRef<"div"> & {
  position?: DockPosition;
  size?: DockBarSize;
};

function Dock({
  position = "bottom",
  size = "md",
  className,
  ...props
}: DockProps) {
  return (
    <div
      data-position={position}
      data-size={size}
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-2xl border border-border/40 bg-background/90 px-4 text-foreground shadow-lg backdrop-blur-md",
        "data-[size=sm]:h-10 data-[size=sm]:px-3",
        "data-[size=md]:h-12",
        className,
      )}
      {...props}
    />
  );
}

export type DockSectionAlign = "start" | "center" | "end";

export type DockSectionProps = React.ComponentPropsWithoutRef<"div"> & {
  align?: DockSectionAlign;
  grow?: boolean;
};

function DockSection({
  align = "start",
  grow = false,
  className,
  ...props
}: DockSectionProps) {
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

export type DockDividerProps = React.ComponentPropsWithoutRef<"span">;

function DockDivider({ className, ...props }: DockDividerProps) {
  return (
    <span
      aria-hidden
      className={cn("h-6 w-px bg-border/60", className)}
      {...props}
    />
  );
}

export type DockItemVariant = "icon" | "label" | "pill";

export type DockItemProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: DockItemVariant;
  active?: boolean;
};

const DockItem = React.forwardRef<HTMLButtonElement, DockItemProps>(
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
DockItem.displayName = "DockItem";

export type DockIconProps = React.ComponentPropsWithoutRef<"span">;

function DockIcon({ className, ...props }: DockIconProps) {
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

export { Dock, DockDivider, DockIcon, DockItem, DockSection };
