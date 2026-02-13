import { createFileRoute } from "@tanstack/react-router";
import { DoomRoute } from "./-components/application";

export const Route = createFileRoute("/(applications)/doom/")({
  component: DoomRoute,
});
