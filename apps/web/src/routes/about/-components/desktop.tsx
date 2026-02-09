import { SidebarTrigger } from "@acme/ui/components/sidebar";
import { Taskbar, TaskbarItem, TaskbarSection } from "@acme/ui/os/taskbar";
import { WindowBoundary } from "@acme/ui/os/window-boundary";
import { WindowSnap } from "@acme/ui/os/window-snap";

export function Desktop() {
  return (
    <main className="flex flex-1 flex-col bg-green-500">
      <WindowBoundary className="flex-1">
        <WindowSnap>APPLICATIONS</WindowSnap>
      </WindowBoundary>
      <Taskbar className="w-full self-end">
        <TaskbarSection align="start" grow>
          <TaskbarItem>TaskbarOS</TaskbarItem>
        </TaskbarSection>
        <TaskbarSection align="end">
          <SidebarTrigger />
        </TaskbarSection>
      </Taskbar>
    </main>
  );
}
