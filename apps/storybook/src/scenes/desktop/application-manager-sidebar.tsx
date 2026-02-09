import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@acme/ui/components/sidebar";
import { useApplicationManager } from "@acme/ui/os/application-manager";
import { useWindowManager } from "@acme/ui/os/window-manager";

function ApplicationManagerSidebar() {
  const { running, close, getApplication } = useApplicationManager();
  const { getWindowData, activateWindow } = useWindowManager();

  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible="offcanvas"
      className="inset-y-auto top-24 bottom-24 h-[calc(100svh-12rem)]"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="font-semibold text-base">Active windows</div>
          <button
            type="button"
            className="text-muted-foreground text-sm hover:text-foreground"
            onClick={() => {
              for (const entry of running) {
                close(entry.appId);
              }
            }}
          >
            Close all
          </button>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Running apps</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {running.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-muted-foreground">
                    No active windows
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                running.map((entry) => {
                  const app = getApplication(entry.appId);
                  if (!app) return null;
                  const isHidden =
                    getWindowData(entry.appId)?.isHidden ?? false;
                  return (
                    <SidebarMenuItem key={entry.appId}>
                      <SidebarMenuButton
                        onClick={() => {
                          if (isHidden) {
                            activateWindow(entry.appId);
                          }
                        }}
                      >
                        <span className="font-medium">
                          {app.title.toLowerCase()}.mdx
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export { ApplicationManagerSidebar };
