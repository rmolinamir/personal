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
import { TaskbarStart } from "./taskbar-start";

type TaskbarProps = React.ComponentProps<typeof TaskbarPrimitive>;

export function Taskbar(props: TaskbarProps) {
  return (
    <TaskbarPrimitive {...props}>
      <TaskbarSection align="start">
        <TaskbarStart />
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
        <Clock className="hidden px-2 py-1 text-xs md:flex" />
      </TaskbarSection>
    </TaskbarPrimitive>
  );
}
