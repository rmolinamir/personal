import { cn } from "@acme/ui/lib/utils";
import { ActionLauncher } from "@acme/ui/os/action-launcher";
import { useApplicationManager } from "@acme/ui/os/application-manager";
import {
  LauncherDescription,
  LauncherIcon,
  LauncherLabel,
} from "@acme/ui/os/launcher";
import { useWindowManager } from "@acme/ui/os/window-manager";

type DockDesktopLaunchersProps = {
  className?: string;
};

function ApplicationLaunchers({ className }: DockDesktopLaunchersProps) {
  const { listApplications } = useApplicationManager();
  const { activateWindow, getWindowData } = useWindowManager();
  const apps = listApplications();

  return (
    <div className={cn("grid h-full grid-flow-row gap-4", className)}>
      {apps.map((app) => {
        const isHidden = Boolean(getWindowData(app.id)?.isHidden);
        return (
          <ActionLauncher
            key={app.id}
            application={app}
            status={isHidden ? "hidden" : "default"}
            className="h-35 w-25 items-center justify-center text-slate-700"
            onClick={(event) => {
              if (isHidden) {
                event.preventDefault();
                activateWindow(app.id);
              }
            }}
          >
            <LauncherIcon className="bg-slate-200 text-slate-700 ring-black/10">
              {app.title.slice(0, 1)}
            </LauncherIcon>
            <LauncherLabel className="text-slate-800">
              {app.title.toLowerCase()}.mdx
            </LauncherLabel>
            <LauncherDescription className="text-slate-500">
              Tap to open
            </LauncherDescription>
          </ActionLauncher>
        );
      })}
    </div>
  );
}

export { ApplicationLaunchers };
