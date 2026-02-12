import { createFileRoute } from "@tanstack/react-router";
import { ResumeRoute } from "./-components/application";

export const Route = createFileRoute("/(applications)/resume/")({
  component: ResumeRoute,
});
