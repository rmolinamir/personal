import {
  Launcher,
  LauncherContent,
  LauncherIcon,
  LauncherLabel,
} from "@acme/ui/os/launcher";
import { Link } from "@tanstack/react-router";
import { Link2Off } from "lucide-react";

const bsodRoute = `/${encodeURIComponent("you're-absolutely-right!")}`;

export function BSODLauncher() {
  return (
    <Launcher asChild>
      {/* @ts-ignore: This is done on purpose to trigger a 404 easter egg. */}
      <Link to={bsodRoute} rel="nofollow">
        <LauncherContent>
          <LauncherIcon className="bg-background/90 backdrop-blur-xs">
            <Link2Off className="h-7 w-7 text-foreground/90" />
          </LauncherIcon>
          <LauncherLabel className="border bg-background/90 px-2 py-0.5 shadow-sm backdrop-blur-xs">
            do-not-click
          </LauncherLabel>
        </LauncherContent>
      </Link>
    </Launcher>
  );
}
