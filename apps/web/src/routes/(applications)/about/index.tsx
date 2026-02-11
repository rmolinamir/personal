import {
  LauncherContent,
  LauncherIcon,
  LauncherLabel,
} from "@acme/ui/os/launcher";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { createRouteApplication } from "@/lib/os/create-route-application";

export const Route = createFileRoute("/(applications)/about/")({});

export const { Application: AboutApplication, Launcher: AboutLauncher } =
  createRouteApplication(Route)("/about")({
    component: React.lazy(() =>
      import("./-components/about").then((module) => ({
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
