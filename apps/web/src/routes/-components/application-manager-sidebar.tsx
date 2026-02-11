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
  useSidebar,
} from "@acme/ui/components/sidebar";
import { cn } from "@acme/ui/lib/utils";
import { useApplicationManager } from "@acme/ui/os/application-manager";
import { useWindowManager } from "@acme/ui/os/window-manager";
import { Link } from "@tanstack/react-router";

type ApplicationManagerSidebarProps = React.ComponentProps<typeof Sidebar>;

function ApplicationManagerSidebar({
  side = "right",
  variant = "floating",
  collapsible = "offcanvas",
  className,
  ...props
}: ApplicationManagerSidebarProps) {
  const { runningApplications, closeAll } = useApplicationManager();
  const { activateWindow } = useWindowManager();
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar
      side="right"
      variant="floating"
      collapsible="offcanvas"
      className={cn(
        "inset-y-auto top-24 bottom-24 h-[calc(100svh-12rem)]",
        className,
      )}
      style={{ "--sidebar-width": "22rem" } as React.CSSProperties}
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="font-semibold text-base">Applications</div>
          <Link to="/">
            <button
              type="button"
              className="text-muted-foreground text-sm hover:text-foreground"
              onClick={() => {
                closeAll();
                toggleSidebar();
              }}
            >
              Close all
            </button>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Running apps</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {runningApplications.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton className="text-muted-foreground">
                    No running apps
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                runningApplications.map((application) => {
                  return (
                    <SidebarMenuItem key={application.id}>
                      <SidebarMenuButton
                        onClick={() => {
                          activateWindow(application.id);
                        }}
                      >
                        <span className="font-medium">
                          {application.metadata.title}
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
