import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type * as React from "react";
import appCss from "../styles.css?url";
import { ApplicationSidebar } from "./-components/applications/application-sidebar";
import { BSODScreen } from "./-components/bsod/bsod";
import { RootLayout } from "./-components/root/root-layout";
import { RootProviders } from "./-components/root/root-providers";

export const Route = createRootRoute({
  component: RouteComponent,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
      {
        as: "image",
        href: "/vibrant-wallpaper-light.webp",
        media: "(prefers-color-scheme: light)",
        rel: "prefetch",
      },
      {
        as: "image",
        href: "/vibrant-wallpaper-dark.webp",
        media: "(prefers-color-scheme: dark)",
        rel: "prefetch",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "Robert Molina",
      },
    ],
  }),
  notFoundComponent: BSODScreen,
  shellComponent: RouteShellComponent,
});

function RouteComponent() {
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}

function RouteShellComponent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="bg-background">
        <RootProviders>
          {children}
          <ApplicationSidebar />
        </RootProviders>
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
