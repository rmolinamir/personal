import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import type * as React from "react";

export const Route = createRootRoute({
  component: RouteComponent,
  shellComponent: RouteShellComponent,
});

function RouteComponent() {
  return <Outlet />;
}

function RouteShellComponent({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="relative bg-background">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
