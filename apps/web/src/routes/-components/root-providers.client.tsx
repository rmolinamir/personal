import { ThemeProvider } from "@acme/ui/components/theme";
import { ClientOnly } from "@tanstack/react-router";
import type * as React from "react";

type RootLayoutProps = {
  children: React.ReactNode;
};

export function ClientRootProviders({ children }: RootLayoutProps) {
  return (
    <ClientOnly>
      <ThemeProvider>{children}</ThemeProvider>
    </ClientOnly>
  );
}
