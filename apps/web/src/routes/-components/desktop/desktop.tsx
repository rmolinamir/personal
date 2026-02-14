import { SidebarTrigger } from "@acme/ui/components/sidebar";
import { ThemeMenu } from "@acme/ui/components/theme";
import { cn } from "@acme/ui/lib/utils";
import { Taskbar, TaskbarDivider, TaskbarSection } from "@acme/ui/os/taskbar";
import { WindowBoundary } from "@acme/ui/os/window-boundary";
import { WindowSnap } from "@acme/ui/os/window-snap";
import {
  AboutApplication,
  AboutLauncher,
} from "../../(applications)/about/-components/application";
import {
  DoomApplication,
  DoomLauncher,
} from "../../(applications)/doom/-components/application";
import {
  ResumeApplication,
  ResumeLauncher,
} from "../../(applications)/resume/-components/application";
import { BSODLauncher } from "../bsod/bsod-launcher";
import { TaskbarClock } from "../taskbar/taskbar-clock";
import { TaskbarGitHub } from "../taskbar/taskbar-github";
import { TaskbarLinkedIn } from "../taskbar/taskbar-linkedin";
import { TaskbarStart } from "../taskbar/taskbar-start";
import { TaskbarTabStrip } from "../taskbar/taskbar-tab-strip";
import { Wallpaper } from "./wallpaper";

type DesktopProps = React.ComponentProps<"main">;

export function Desktop({ className, children, ...props }: DesktopProps) {
  return (
    <main
      className={cn(
        "relative flex h-dvh w-dvw flex-col-reverse overflow-hidden",
        className,
      )}
      {...props}
    >
      <DesktopWallpaper className="absolute h-full w-full" />

      <Taskbar className="z-taskbar shrink-0">
        <TaskbarSection className="h-full" align="start">
          <TaskbarStart />
          <TaskbarGitHub />
          <TaskbarLinkedIn />
        </TaskbarSection>
        <TaskbarDivider />
        <TaskbarSection className="h-full items-center" align="center" grow>
          <TaskbarTabStrip />
        </TaskbarSection>
        <TaskbarDivider />
        <TaskbarSection className="h-full" align="end">
          <ThemeMenu variant="ghost" />
          <SidebarTrigger variant="ghost" />
          <TaskbarClock className="hidden px-2 py-1 text-xs md:flex" />
        </TaskbarSection>
      </Taskbar>

      <DesktopGrid className="absolute bottom-9 h-[calc(100dvh-2.25rem)] min-h-0 flex-1 p-2">
        <AboutLauncher />
        <ResumeLauncher />
        <DoomLauncher />
        <BSODLauncher />
      </DesktopGrid>

      <WindowBoundary className="pointer-events-none min-h-0 w-full flex-1 **:pointer-events-auto">
        <WindowSnap>
          <AboutApplication.Component />
          <ResumeApplication.Component />
          <DoomApplication.Component />
        </WindowSnap>
      </WindowBoundary>

      {/* Nested Routes are rendered here, but these will only be Application launchers, no HTML will ever be rendered. */}
      {children}
    </main>
  );
}

type DesktopWallpaperProps = React.ComponentProps<typeof Wallpaper>;

function DesktopWallpaper({ className, ...props }: DesktopWallpaperProps) {
  return (
    <>
      {/* Wallpaper Backdrop (e.g., fallback while it loads) */}
      <div className={cn("z-backdrop bg-secondary", className)} />
      <Wallpaper className={cn("z-wallpaper", className)} {...props} />
    </>
  );
}

type DesktopGridProps = React.ComponentProps<"nav">;

function DesktopGrid({ className, children, ...props }: DesktopGridProps) {
  return (
    <nav
      className={cn(
        "flex w-full flex-col flex-wrap content-start gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );
}
