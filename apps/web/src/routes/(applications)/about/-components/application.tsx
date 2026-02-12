import {
  LauncherContent,
  LauncherIcon,
  LauncherLabel,
} from "@acme/ui/os/launcher";
import { User } from "lucide-react";
import React from "react";
import { createApplicationRoute } from "@/lib/os/create-route-application";

export const {
  Application: AboutApplication,
  Launcher: AboutLauncher,
  Route: AboutRoute,
} = createApplicationRoute("/about")({
  component: React.lazy(async () => {
    const module = await import("./about");
    return { default: module.About };
  }),
  launcher: () => (
    <LauncherContent>
      <LauncherIcon className="bg-background/90 backdrop-blur-xs">
        <User />
      </LauncherIcon>
      <LauncherLabel className="border bg-background/90 px-2 py-0.5 shadow-sm backdrop-blur-xs">
        about.mdx
      </LauncherLabel>
    </LauncherContent>
  ),
  metadata: {
    title: "About",
  },
});
