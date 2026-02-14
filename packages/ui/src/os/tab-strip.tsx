"use client";

import { XIcon } from "lucide-react";
import React from "react";
import { Button } from "../components/button";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "../lib/utils";

function TabStrip({ className, ...props }: React.ComponentProps<typeof Tabs>) {
  return <Tabs className={cn("w-full", className)} {...props} />;
}

function TabStripRail({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tabstrip-rail"
      className={cn("tabstrip-rail overflow-x-auto px-1", className)}
      {...props}
    />
  );
}

function TabStripList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      variant="line"
      data-slot="tabstrip-list"
      className={cn(
        "min-w-max gap-1 rounded-md border border-border/40 px-1 py-1",
        className,
      )}
      {...props}
    />
  );
}

type TabStripTabContextValue = {
  isHidden: boolean;
};

const TabStripTabContext = React.createContext<TabStripTabContextValue | null>(
  null,
);

type TabStripTabProps = React.ComponentProps<"div"> & {
  isHidden?: boolean;
};

function TabStripTab({ className, isHidden, ...props }: TabStripTabProps) {
  const value = React.useMemo(
    () => ({ isHidden: Boolean(isHidden) }),
    [isHidden],
  );

  return (
    <TabStripTabContext.Provider value={value}>
      <div
        data-slot="tabstrip-tab"
        data-hidden={isHidden ? "true" : "false"}
        className={cn("group/tab relative", className)}
        {...props}
      />
    </TabStripTabContext.Provider>
  );
}

function useTabStripTabContext() {
  const context = React.useContext(TabStripTabContext);
  if (!context)
    throw new Error("TabStripTab components must be used within TabStripTab");
  return context;
}

type TabStripTabTriggerProps = React.ComponentProps<typeof TabsTrigger> & {
  scrollIntoViewOnSelect?: boolean;
};

function TabStripTabTrigger({
  className,
  scrollIntoViewOnSelect = true,
  onClick,
  ...props
}: TabStripTabTriggerProps) {
  const { isHidden } = useTabStripTabContext();
  const tabRef = React.useRef<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !scrollIntoViewOnSelect) return;
    const target = tabRef.current;
    if (!target) return;
    window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    });
  };

  return (
    <TabsTrigger
      ref={tabRef}
      data-slot="tabstrip-tab-trigger"
      aria-hidden={isHidden ? "true" : undefined}
      disabled={isHidden}
      className={cn(
        "h-7 max-w-48 justify-start rounded-md border border-transparent px-2 pr-6 text-foreground/70",
        "hover:bg-muted/60 hover:text-foreground",
        "data-[state=active]:bg-background/90 data-[state=active]:text-foreground",
        "data-[state=active]:border-border/60",
        "group-data-[hidden=true]/tab:border-dashed group-data-[hidden=true]/tab:opacity-60",
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

function TabStripTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabstrip-title"
      className={cn("truncate text-left", className)}
      {...props}
    />
  );
}

type TabStripCloseProps = React.ComponentProps<typeof Button> & {
  onClose?: () => void;
};

function TabStripClose({
  className,
  onClick,
  onClose,
  ...props
}: TabStripCloseProps) {
  const isMobile = useIsMobile();
  return (
    <Button
      size="icon"
      variant="ghost"
      data-slot="tabstrip-close"
      aria-label="Close Tab"
      type="button"
      className={cn(
        "absolute top-1/2 right-1 size-4 -translate-y-1/2 rounded-sm",
        "text-foreground/50 transition",
        isMobile ? "opacity-100" : "opacity-0",
        "hover:text-foreground focus-visible:opacity-100",
        "group-focus-within/tab:opacity-100 group-hover/tab:opacity-100",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onClose?.();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        onClose?.();
      }}
      {...props}
    >
      <XIcon className="size-full" />
    </Button>
  );
}

export {
  TabStrip,
  TabStripRail,
  TabStripList,
  TabStripTab,
  TabStripTabTrigger,
  TabStripTitle,
  TabStripClose,
};
