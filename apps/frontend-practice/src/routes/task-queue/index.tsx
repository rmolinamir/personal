import { createFileRoute } from "@tanstack/react-router";
import { App } from "./-components/app";

export const Route = createFileRoute("/task-queue/")({
  component: App,
});
