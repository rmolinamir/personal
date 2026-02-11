import { SidebarTrigger } from "@acme/ui/components/sidebar";
import { cn } from "@acme/ui/lib/utils";
import { useApplicationManager } from "@acme/ui/os/application-manager";
import { Taskbar, TaskbarItem, TaskbarSection } from "@acme/ui/os/taskbar";
import { WindowBoundary } from "@acme/ui/os/window-boundary";
import { WindowSnap } from "@acme/ui/os/window-snap";
import { Link } from "@tanstack/react-router";
import {
  AboutApplication,
  AboutLauncher,
} from "../(applications)/about/-components/application";
import { TaskbarLogo } from "./taskbar-icon";

type DesktopProps = React.ComponentProps<"main">;

export function Desktop({ className, children, ...props }: DesktopProps) {
  const { closeAll } = useApplicationManager();
  return (
    <main
      className={cn("flex h-dvh w-dvw flex-col overflow-hidden", className)}
      {...props}
    >
      <Taskbar className="h-9 w-full shrink-0 self-end">
        <TaskbarSection align="start" grow>
          <Link to="/">
            <TaskbarItem variant="icon" onClick={closeAll}>
              <TaskbarLogo />
            </TaskbarItem>
          </Link>
        </TaskbarSection>
        <TaskbarSection align="end">
          <SidebarTrigger />
        </TaskbarSection>
      </Taskbar>

      <nav className="absolute top-9 flex h-[calc(100dvh-2.25rem)] min-h-0 w-full flex-1 flex-col flex-wrap content-start gap-1 p-2">
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
