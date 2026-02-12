import { SidebarTrigger } from "@acme/ui/components/sidebar";
import { ThemeMenu } from "@acme/ui/components/theme";
import {
  Taskbar as TaskbarPrimitive,
  TaskbarSection,
} from "@acme/ui/os/taskbar";

import { Clock } from "./clock";
import { TaskbarHome } from "./taskbar-home";

export function Taskbar() {
  return (
    <TaskbarPrimitive className="z-100009 w-full shrink-0 self-end">
      <TaskbarSection align="start" grow>
        <TaskbarHome />
      </TaskbarSection>
      <TaskbarSection align="end">
        <ThemeMenu variant="ghost" />
        <SidebarTrigger variant="ghost" />
        <Clock className="px-2 py-1 text-xs" />
      </TaskbarSection>
    </TaskbarPrimitive>
  );
}
