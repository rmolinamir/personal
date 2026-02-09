import { SidebarProvider } from "@acme/ui/components/sidebar";
import { ApplicationManagerProvider } from "@acme/ui/os/application-manager";
import { WindowManagerProvider } from "@acme/ui/os/window-manager";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { ApplicationManagerSidebar } from "./-components/application-manager-sidebar";
import { Desktop } from "./about/-components/desktop";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <ApplicationManagerProvider>
      <WindowManagerProvider>
        <SidebarProvider
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
          className="flex flex-col"
        >
          <Desktop />
          <ApplicationManagerSidebar />
        </SidebarProvider>
      </WindowManagerProvider>
    </ApplicationManagerProvider>
  );
}
