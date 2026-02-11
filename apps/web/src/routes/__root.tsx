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
import { Providers } from "./-components/root-providers";

export const Route = createRootRoute({
  component: RootLayout,
  head: () => ({
    links: [
      {
        href: appCss,
        rel: "stylesheet",
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
        title: "TanStack Start Starter",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex h-svh w-svh items-center justify-center bg-primary text-primary-foreground">
      TODO: BLUE SCREEN OF DEATH
    </div>
  ),
  shellComponent: RootDocument,
});

function RootLayout() {
  return (
    <Providers>
      <Desktop>
        <Outlet />
      </Desktop>
      <ApplicationManagerSidebar />
    </Providers>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
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
