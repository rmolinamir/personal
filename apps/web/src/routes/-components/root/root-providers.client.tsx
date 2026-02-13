import { ThemeProvider } from "@acme/ui/components/theme";
import { ClientOnly } from "@tanstack/react-router";
import type * as React from "react";
import { SystemProvider } from "../system/system-provider";

type RootLayoutProps = {
  children: React.ReactNode;
};

export function ClientRootProviders({ children }: RootLayoutProps) {
  return (
    <ClientOnly>
      <SystemProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </SystemProvider>
    </ClientOnly>
  );
}
