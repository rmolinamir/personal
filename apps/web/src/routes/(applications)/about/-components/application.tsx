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
      <LauncherIcon>
        <User />
      </LauncherIcon>
      <LauncherLabel>about.mdx</LauncherLabel>
    </LauncherContent>
  ),
  metadata: {
    title: "About",
  },
});
