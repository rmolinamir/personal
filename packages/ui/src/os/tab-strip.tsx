"use client";

import { XIcon } from "lucide-react";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { cn } from "../lib/utils";

function TabStrip({ className, ...props }: React.ComponentProps<typeof Tabs>) {
  return <Tabs className={cn("w-full", className)} {...props} />;
}

function TabStripRail({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="tabstrip-scroll"
      className={cn("tabstrip-rail max-w-[46vw] overflow-x-auto", className)}
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

type TabStripTabProps = React.ComponentProps<"div"> & {
  isHidden?: boolean;
};

function TabStripTab({ className, isHidden, ...props }: TabStripTabProps) {
  return (
    <div
      data-slot="tabstrip-tab"
      data-hidden={isHidden ? "true" : "false"}
      className={cn("group/tab relative", className)}
      {...props}
    />
  );
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

type TabStripCloseProps = React.ComponentProps<"button"> & {
  onClose?: () => void;
};

function TabStripClose({
  className,
  onClick,
  onClose,
  ...props
}: TabStripCloseProps) {
  return (
    <button
      data-slot="tabstrip-close"
      aria-label="Close tab"
      tabIndex={0}
      type="button"
      className={cn(
        "absolute top-1/2 right-1 -translate-y-1/2 rounded-sm p-0.5",
        "text-foreground/50 opacity-0 transition",
        "hover:text-foreground",
        "group-hover/tab:opacity-100 group-data-[state=active]/tab:opacity-100",
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
      <XIcon className="size-3" />
    </button>
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
