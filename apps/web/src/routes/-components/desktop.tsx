import { cn } from "@acme/ui/lib/utils";
import { WindowBoundary } from "@acme/ui/os/window-boundary";
import { WindowSnap } from "@acme/ui/os/window-snap";
import { createPortal } from "react-dom";
import {
  AboutApplication,
  AboutLauncher,
} from "../(applications)/about/-components/application";
import {
  DoomApplication,
  DoomLauncher,
} from "../(applications)/doom/-components/application";
import {
  ResumeApplication,
  ResumeLauncher,
} from "../(applications)/resume/-components/application";
import { PowerButton } from "./power-button";
import { useSystem } from "./system-provider";
import { Taskbar } from "./taskbar";
import { Wallpaper } from "./wallpaper";

type DesktopProps = React.ComponentProps<"main">;

export function Desktop({ className, children, ...props }: DesktopProps) {
  const { power: powerState, boot } = useSystem();
  const isOn = powerState === "on";
  const isOff = powerState === "off";

  return (
    <main
      className={cn(
        "relative flex h-dvh w-dvw flex-col-reverse overflow-hidden",
        {
          "animate-tv-off": isOff,
          "animate-tv-on": isOn,
        },
        className,
      )}
      {...props}
    >
      {/* Backdrop for the TV animation. */}
      <div className="absolute -z-2 h-full w-full bg-secondary" />
      <Wallpaper className="absolute inset-0 -z-1 h-full w-full" />

      <Taskbar className="z-10000 shrink-0" />

      <nav className="absolute bottom-9 flex h-[calc(100dvh-2.25rem)] min-h-0 w-full flex-1 flex-col flex-wrap content-start gap-1 p-2">
        <AboutLauncher />
        <ResumeLauncher />
        <DoomLauncher />
      </nav>

      <WindowBoundary className="pointer-events-none min-h-0 w-full flex-1 **:pointer-events-auto">
        <WindowSnap>
          <AboutApplication.Component />
          <ResumeApplication.Component />
          <DoomApplication.Component />
        </WindowSnap>
      </WindowBoundary>

      {/* Nested Routes are rendered here, but these will only be Application launchers, no HTML will ever be rendered. */}
      {children}

      {isOff &&
        createPortal(
          <div
            className={cn(
              "absolute inset-0 z-20000",
              "flex items-center justify-center",
              "animate-tv-off-overlay bg-foreground opacity-0 dark:bg-background",
            )}
          >
            <PowerButton
              className="rounded-full bg-transparent!"
              onClick={boot}
            />
          </div>,
          document.body,
        )}
    </main>
  );
}
