import { Button } from "@acme/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@acme/ui/components/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@acme/ui/components/tooltip";
import { cn } from "@acme/ui/lib/utils";
import { TaskbarItem } from "@acme/ui/os/taskbar";
import { useQuitApplications } from "@/hooks/use-quit-applications";
import { useSystem } from "../system/system-provider";

type TaskbarLogoProps = React.ComponentPropsWithoutRef<"svg">;

export function TaskbarStart({ className, ...props }: TaskbarLogoProps) {
  const { quitApplications } = useQuitApplications();
  const { shutdown } = useSystem();

  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" asChild>
              <TaskbarItem
                className="text-accent hover:text-accent-foreground"
                variant="icon"
                onClick={quitApplications}
              >
                <svg
                  className={cn("size-5", className)}
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
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="select-none text-foreground/55 text-xs">
            Start Menu
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={quitApplications}>
            Quit applications
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shutdown}>Shut down</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent>Open start menu</TooltipContent>
    </Tooltip>
  );
}
