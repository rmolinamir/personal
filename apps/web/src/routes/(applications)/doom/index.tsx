import { createFileRoute } from "@tanstack/react-router";
import { PERSONAL_URL } from "@/lib/socials/constants";
import { DoomRoute } from "./-components/application";

export const Route = createFileRoute("/(applications)/doom/")({
  component: DoomRoute,
  head: () => {
    const title = "DOOM.exe — Robert Molina";
    const description = "Play DOOM inside the browser. Built with DWASM.";
    const url = `${PERSONAL_URL}/doom`;

    return {
      links: [
        {
          href: url,
          rel: "canonical",
        },
      ],
      meta: [
        { title },
        { content: description, name: "description" },
        { content: title, property: "og:title" },
        { content: description, property: "og:description" },
        { content: url, property: "og:url" },
        { content: title, name: "twitter:title" },
        { content: description, name: "twitter:description" },
        { content: url, name: "twitter:url" },
      ],
    };
  },
});
