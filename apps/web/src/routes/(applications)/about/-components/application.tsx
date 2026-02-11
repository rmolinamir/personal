import {
  LauncherContent,
  LauncherIcon,
  LauncherLabel,
} from "@acme/ui/os/launcher";
import React from "react";
import { createApplicationRoute } from "@/lib/os/create-route-application";

export const {
  Application: AboutApplication,
  Launcher: AboutLauncher,
  Route: AboutRoute,
} = createApplicationRoute("/about")({
  component: React.lazy(() =>
    import("./about").then((module) => ({
      default: module.About,
    })),
  ),
  launcher: () => (
    <LauncherContent>
      <LauncherIcon className="bg-slate-200 text-slate-700 ring-black/10">
        a
      </LauncherIcon>
      <LauncherLabel className="text-slate-800">about.mdx</LauncherLabel>
    </LauncherContent>
  ),
  metadata: {
    title: "About",
  },
});
