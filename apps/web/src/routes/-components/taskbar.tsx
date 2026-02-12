import { SidebarTrigger } from "@acme/ui/components/sidebar";
import { ThemeMenu } from "@acme/ui/components/theme";
import {
  TaskbarDivider,
  Taskbar as TaskbarPrimitive,
  TaskbarSection,
} from "@acme/ui/os/taskbar";
import { ApplicationTabStrip } from "./application-tab-strip";
import { Clock } from "./clock";
import { TaskbarGitHub } from "./taskbar-github";
import { TaskbarLinkedIn } from "./taskbar-linkedin";
import { TaskbarLogo } from "./taskbar-logo";

export function Taskbar() {
  return (
    <TaskbarPrimitive className="z-100009 w-full shrink-0 self-end">
      <TaskbarSection align="start">
        <TaskbarLogo />
        <TaskbarGitHub />
        <TaskbarLinkedIn />
      </TaskbarSection>
      <TaskbarDivider />
      <TaskbarSection className="items-center" align="center" grow>
        <ApplicationTabStrip />
      </TaskbarSection>
      <TaskbarDivider />
      <TaskbarSection align="end">
        <ThemeMenu variant="ghost" />
        <SidebarTrigger variant="ghost" />
        <Clock className="px-2 py-1 text-xs" />
      </TaskbarSection>
    </TaskbarPrimitive>
  );
}
