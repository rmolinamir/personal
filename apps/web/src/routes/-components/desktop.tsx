import { cn } from "@acme/ui/lib/utils";
import { WindowBoundary } from "@acme/ui/os/window-boundary";
import { WindowSnap } from "@acme/ui/os/window-snap";
import {
  AboutApplication,
  AboutLauncher,
} from "../(applications)/about/-components/application";
import { Taskbar } from "./taskbar";
import { Wallpaper } from "./wallpaper";

type DesktopProps = React.ComponentProps<"main">;

export function Desktop({ className, children, ...props }: DesktopProps) {
  return (
    <main
      className={cn(
        "relative flex h-dvh w-dvw animate-tv-on flex-col-reverse overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Backdrop for the TV animation. */}
      <div className="absolute -z-2 h-full w-full bg-secondary" />
      <Wallpaper className="absolute inset-0 -z-1 h-full w-full" />

      <Taskbar />

      <nav className="absolute bottom-9 flex h-[calc(100dvh-2.25rem)] min-h-0 w-full flex-1 flex-col flex-wrap content-start gap-1 p-2">
        <AboutLauncher />
      </nav>

      <WindowBoundary className="pointer-events-none min-h-0 w-full flex-1 **:pointer-events-auto">
        <WindowSnap>
          <AboutApplication.Component />
        </WindowSnap>
      </WindowBoundary>

      {/* Nested Routes are rendered here, but these will only be Application launchers, no HTML will ever be rendered. */}
      {children}
    </main>
  );
}
