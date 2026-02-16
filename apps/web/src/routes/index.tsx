import { createFileRoute } from "@tanstack/react-router";
import { PERSONAL_URL } from "@/lib/socials/constants";

export const Route = createFileRoute("/")({
  component: App,
  head: () => ({
    links: [
      {
        href: PERSONAL_URL,
        rel: "canonical",
      },
    ],
    meta: [
      {
        content: PERSONAL_URL,
        property: "og:url",
      },
      {
        content: PERSONAL_URL,
        name: "twitter:url",
      },
    ],
  }),
});

function App() {
  return null;
}
