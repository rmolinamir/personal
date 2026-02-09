import { SidebarProvider } from "@acme/ui/components/sidebar";
import { ApplicationManager } from "@acme/ui/os/application-manager";
import { Dock, DockIcon, DockItem, DockSection } from "@acme/ui/os/dock";
import { Shell } from "@acme/ui/os/shell";
import { WindowManagerProvider } from "@acme/ui/os/window-manager";
import { WindowSnap } from "@acme/ui/os/window-snap";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PanelRightOpen } from "lucide-react";
import * as React from "react";
import { ApplicationLaunchers } from "../scenes/desktop/application-launchers";
import { ApplicationManagerSidebar } from "../scenes/desktop/application-manager-sidebar";
import {
  Applications,
  InsightsApplication,
  MailApplication,
  NotesApplication,
} from "../scenes/desktop/applications";
import { MoreMenu, ProductMenu } from "../scenes/desktop/dock-menus";

const meta = {
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "OS/Dock",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const panelRef = React.useRef<HTMLDivElement | null>(null);
    const toggleRef = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
      if (!sidebarOpen) return;

      const handlePointerDown = (event: PointerEvent) => {
        const target = event.target as Node | null;
        if (!target) return;
        if (panelRef.current?.contains(target)) return;
        if (toggleRef.current?.contains(target)) return;
        setSidebarOpen(false);
      };

      document.addEventListener("pointerdown", handlePointerDown, true);
      return () => {
        document.removeEventListener("pointerdown", handlePointerDown, true);
      };
    }, [sidebarOpen]);

    return (
      <SidebarProvider
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        className="flex flex-col bg-transparent"
        style={{ "--sidebar-width": "22rem" } as React.CSSProperties}
      >
        <WindowManagerProvider>
          <ApplicationManager
            applications={[
              MailApplication,
              NotesApplication,
              InsightsApplication,
            ]}
          >
            <div className="flex h-full min-h-svh w-full flex-col bg-[#e9e2d2]">
              <Shell className="h-full w-full flex-1">
                <WindowSnap>
                  <div ref={panelRef}>
                    <ApplicationManagerSidebar />
                  </div>
                  <ApplicationLaunchers className="pointer-events-auto m-4" />
                  <Applications />
                </WindowSnap>
              </Shell>

              <Dock
                className="mx-4 my-2 rounded-full border border-black/10 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.25)]"
                position="bottom"
              >
                <DockSection
                  align="start"
                  className="gap-1 text-slate-700 text-sm"
                  grow
                >
                  <DockItem
                    variant="icon"
                    className="text-slate-700 hover:bg-black/5"
                  >
                    <DockIcon className="bg-slate-900 text-white">OS</DockIcon>
                  </DockItem>
                  <ProductMenu />
                  <MoreMenu />
                </DockSection>

                <DockSection>
                  <DockItem
                    variant="icon"
                    aria-label="Window manager"
                    active={sidebarOpen}
                    className="text-slate-700 hover:bg-black/5"
                    onClick={() => setSidebarOpen((prev) => !prev)}
                    ref={toggleRef}
                  >
                    <PanelRightOpen className="size-4" />
                  </DockItem>
                </DockSection>
              </Dock>
            </div>
          </ApplicationManager>
        </WindowManagerProvider>
      </SidebarProvider>
    );
  },
};
