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
import { ApplicationManagerSidebar } from "./-components/application-manager-sidebar";
import { Desktop } from "./-components/desktop";
import { RootProviders } from "./-components/root-providers";

export const Route = createRootRoute({
  component: RootLayout,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
      },
      { rel: "preload", as: "image", href: "/vibrant-wallpaper-light.webp" },
      { rel: "preload", as: "image", href: "/vibrant-wallpaper-dark.webp" },
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
  notFoundComponent: () => (
    <div className="flex h-svh w-svh items-center justify-center bg-primary text-primary-foreground">
      TODO: SCREEN OF DEATH
    </div>
  ),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="bg-background">
        {children}
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


function RootLayout() {
  return (
    <RootProviders>
      <Desktop>
        <Outlet />
      </Desktop>
      <ApplicationManagerSidebar />
    </RootProviders>
  );
}
