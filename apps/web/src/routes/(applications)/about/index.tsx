import { createFileRoute } from "@tanstack/react-router";
import { PERSONAL_URL } from "@/lib/socials/constants";
import { AboutRoute } from "./-components/application";

export const Route = createFileRoute("/(applications)/about/")({
  component: AboutRoute,
  head: () => {
    const title = "About — Robert Molina";
    const description =
      "I'm a software engineer focused on developer experience, tooling, and scalable systems.";
    const url = `${PERSONAL_URL}/about`;

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
