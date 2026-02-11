import { createFileRoute } from "@tanstack/react-router";
import { AboutRoute } from "./-components/application";

export const Route = createFileRoute("/(applications)/about/")({
  component: AboutRoute,
});
