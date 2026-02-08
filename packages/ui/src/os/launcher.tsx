import type * as React from "react";
import { cn } from "../lib/utils";

export type LauncherStatus = "default" | "running" | "hidden";
export type LauncherSize = "sm" | "md" | "lg";

export type LauncherProps = React.ComponentPropsWithoutRef<"button"> & {
  status?: LauncherStatus;
  size?: LauncherSize;
};

function Launcher({
  status = "default",
  size = "md",
  className,
  ...props
}: LauncherProps) {
  return (
    <button
      type="button"
      data-status={status}
      data-size={size}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-center transition",
        "hover:border-border/60 hover:bg-muted/40",
        "data-[status=running]:border-border/60 data-[status=running]:bg-muted/40",
        "data-[status=hidden]:opacity-70",
        className,
      )}
      {...props}
    />
  );
}

export type LauncherIconProps = React.ComponentPropsWithoutRef<"span">;

function LauncherIcon({ className, ...props }: LauncherIconProps) {
  return (
    <span
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-2xl bg-muted/60 text-muted-foreground shadow-sm ring-1 ring-border/40",
        "select-none transition group-hover:shadow-md",
        "[&>img]:pointer-events-none [&>img]:select-none [&>svg]:pointer-events-none [&>svg]:select-none",
        "group-data-[size=sm]:h-10 group-data-[size=sm]:w-10",
        "group-data-[size=md]:h-12 group-data-[size=md]:w-12",
        "group-data-[size=lg]:h-14 group-data-[size=lg]:w-14",
        className,
      )}
      {...props}
    />
  );
}

export type LauncherLabelProps = React.ComponentPropsWithoutRef<"span">;

function LauncherLabel({ className, ...props }: LauncherLabelProps) {
  return (
    <span
      className={cn(
        "max-w-30 text-center font-medium text-foreground leading-tight",
        "group-data-[size=sm]:text-[11px]",
        "group-data-[size=md]:text-xs",
        "group-data-[size=lg]:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export type LauncherDescriptionProps = React.ComponentPropsWithoutRef<"span">;

function LauncherDescription({
  className,
  ...props
}: LauncherDescriptionProps) {
  return (
    <span
      className={cn(
        "max-w-30 text-center text-[10px] text-muted-foreground leading-snug",
        className,
      )}
      {...props}
    />
  );
}

export { Launcher, LauncherDescription, LauncherIcon, LauncherLabel };
