import { SidebarWrapper } from "@acme/ui/components/sidebar";
import { cn } from "@acme/ui/lib/utils";
import type * as React from "react";
import { useNotFound } from "@/hooks/use-not-found";
import { ApplicationSidebar } from "../applications/application-sidebar";
import { Desktop } from "../desktop/desktop";
import { PowerButton, PowerScreen } from "../power/power";
import { useSystem } from "../system/system-provider";

type SystemLayoutProps = React.ComponentProps<typeof SidebarWrapper>;

export function RootLayout({
  children,
  className,
  ...props
}: SystemLayoutProps) {
  const { isNotFound } = useNotFound();
  const { power, boot } = useSystem();
  const isOff = power === "off";
  const isOn = power === "on";

  return (
    <SidebarWrapper
      className={cn("relative flex flex-col", className)}
      {...props}
    >
      <div className={"flex flex-1"}>
        <div
          className={cn("flex flex-1", {
            "animate-power-off": isOff,
            "animate-power-on": isOn,
          })}
        >
          {isNotFound ? children : <Desktop>{children}</Desktop>}
        </div>
        {isOff && (
          <PowerScreen
            className={cn(
              "absolute inset-0 top-0 left-0 z-power h-full w-full",
              "animate-screen-blackout opacity-0",
            )}
          >
            <PowerButton
              className="rounded-full bg-transparent!"
              onClick={boot}
            />
          </PowerScreen>
        )}
      </div>
      <ApplicationSidebar />
    </SidebarWrapper>
  );
}
