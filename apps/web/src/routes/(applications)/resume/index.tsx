import { createFileRoute } from "@tanstack/react-router";
import { PERSONAL_URL } from "@/lib/socials/constants";
import { ResumeRoute } from "./-components/application";

export const Route = createFileRoute("/(applications)/resume/")({
  component: ResumeRoute,
  head: () => {
    const title = "Resume — Robert Molina";
    const description =
      "Resume and experience highlights for Robert Molina, a software engineer focused on developer experience and scalable systems.";
    const url = `${PERSONAL_URL}/resume`;

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
