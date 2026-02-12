import { Button } from "@acme/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/tooltip";
import { cn } from "@acme/ui/lib/utils";
import { useApplicationManager } from "@acme/ui/os/application-manager";
import { TaskbarItem } from "@acme/ui/os/taskbar";
import { useRouter } from "@tanstack/react-router";

type TaskbarLogoProps = React.ComponentPropsWithoutRef<"svg">;

export function TaskbarLogo({ className, ...props }: TaskbarLogoProps) {
  const { closeAll, runningApplications } = useApplicationManager();
  const { navigate } = useRouter();

  function handleClick() {
    closeAll();
    navigate({ to: "/" });
  }

  return (
    <Tooltip>
      <Button variant="ghost" size="icon" asChild>
        <TooltipTrigger>
          <TaskbarItem variant="icon" onClick={handleClick}>
            <svg
              className={cn("h-6 w-6", className)}
              role="img"
              viewBox="0 0 433 289"
              fill="currentColor"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              {...props}
            >
              <title>Personal Logo</title>
              <path d="M0.769226 288.228L128.269 1.22754L212.951 190.362L300.269 1.22754L431.769 288.228H256.769L212.951 190.362L167.769 288.228H0.769226Z" />
              <path d="M0.769226 288.228L128.269 1.22754L256.769 288.228H431.769L300.269 1.22754L167.769 288.228H0.769226Z" />
            </svg>
          </TaskbarItem>
        </TooltipTrigger>
      </Button>
      <TooltipContent>
        {runningApplications.length
          ? "Close all applications"
          : "No applications running"}
      </TooltipContent>
    </Tooltip>
  );
}
