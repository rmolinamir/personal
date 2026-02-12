"use client";

import { XIcon } from "lucide-react";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "../components/tabs";
import { cn } from "../lib/utils";

function TabSTrip({ className, ...props }: React.ComponentProps<typeof Tabs>) {
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

function TabSTripList({
  className,
  ...props
}: React.ComponentProps<typeof TabsList>) {
  return (
    <TabsList
      variant="line"
      data-slot="tabstrip-list"
      className={cn(
        "min-w-max gap-1 rounded-md border border-border/40 bg-background/70 px-1 py-1 text-foreground/70 backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  );
}

type TabSTripTabProps = React.ComponentProps<typeof TabsTrigger> & {
  isHidden?: boolean;
  scrollIntoViewOnSelect?: boolean;
};

function TabSTripTab({
  className,
  isHidden,
  scrollIntoViewOnSelect = true,
  onClick,
  ...props
}: TabSTripTabProps) {
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
      data-slot="tabstrip-tab"
      data-hidden={isHidden ? "true" : "false"}
      className={cn(
        "group/tab relative h-7 max-w-48 justify-start rounded-md border border-transparent px-2 pr-6 text-foreground/70",
        "hover:bg-muted/60 hover:text-foreground",
        "data-[state=active]:bg-background/90 data-[state=active]:text-foreground",
        "data-[state=active]:border-border/60",
        "data-[hidden=true]:border-dashed data-[hidden=true]:opacity-60",
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

function TabSTripTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="tabstrip-title"
      className={cn("truncate text-left", className)}
      {...props}
    />
  );
}

type TabSTripCloseProps = React.ComponentProps<"button"> & {
  onClose?: () => void;
};

function TabSTripClose({
  className,
  onClick,
  onClose,
  ...props
}: TabSTripCloseProps) {
  return (
    <button
      type="button"
      data-slot="tabstrip-close"
      aria-label="Close tab"
      className={cn(
        "absolute top-1/2 right-1 -translate-y-1/2 rounded-sm p-0.5",
        "text-foreground/50 opacity-0 transition",
        "hover:text-foreground",
        "group-hover/tab:opacity-100 group-data-[state=active]/tab:opacity-100",
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick?.(event);
        if (event.defaultPrevented) return;
        onClose?.();
      }}
      {...props}
    >
      <XIcon className="size-3" />
    </button>
  );
}

export {
  TabSTrip,
  TabStripRail,
  TabSTripList,
  TabSTripTab,
  TabSTripTitle,
  TabSTripClose,
};
