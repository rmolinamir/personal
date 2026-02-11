import { SidebarProvider } from "@acme/ui/components/sidebar";
import { TooltipProvider } from "@acme/ui/components/tooltip";
import { ApplicationManagerProvider } from "@acme/ui/os/application-manager";
import { WindowManagerProvider } from "@acme/ui/os/window-manager";
import * as React from "react";

type RootLayoutProps = {
  children: React.ReactNode;
};

export function Providers({ children }: RootLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <ApplicationManagerProvider>
      <WindowManagerProvider>
        <SidebarProvider
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          className="flex flex-col"
        >
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </SidebarProvider>
      </WindowManagerProvider>
    </ApplicationManagerProvider>
  );
}
