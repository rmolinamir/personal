import { cn } from "@acme/ui/lib/utils";
import type * as React from "react";

type WorkspaceProps = React.ComponentProps<"div">;

function PurpleWallpaper({ className, children, ...props }: WorkspaceProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-linear-to-br from-slate-900 via-indigo-900 to-slate-950",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(255, 255, 255, 0.14), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {children}
    </div>
  );
}

export { PurpleWallpaper };
