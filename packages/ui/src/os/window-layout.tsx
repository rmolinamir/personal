import * as React from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { cn } from "../lib/utils";
import { useWindowController } from "./window";

function WindowHeader({
  className,
  ref,
  onDoubleClick,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  const controller = useWindowController();
  const handleHeaderDoubleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onDoubleClick?.(event);
      if (event.defaultPrevented) return;
      controller?.toggleFullscreen();
    },
    [controller, onDoubleClick],
  );

  return (
    <CardHeader
      ref={ref}
      data-slot="window-header"
      onDoubleClick={handleHeaderDoubleClick}
      className={cn(
        "flex select-none flex-row items-center justify-between gap-3",
        "border-border/80 border-b bg-muted/60 px-3 py-2!",
        "auto-rows-auto grid-rows-none items-center",
        className,
      )}
      {...props}
    />
  );
}

function WindowTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle
      ref={ref}
      data-slot="window-title"
      className={cn("truncate font-medium text-sm", className)}
      {...props}
    />
  );
}

function WindowCaption({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CardDescription>) {
  return (
    <CardDescription
      ref={ref}
      data-slot="window-description"
      className={cn("text-xs", className)}
      {...props}
    />
  );
}

function WindowFooter({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CardFooter>) {
  return (
    <CardFooter
      ref={ref}
      data-slot="window-footer"
      className={cn("px-3 py-2", className)}
      {...props}
    />
  );
}

function WindowContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      ref={ref}
      data-slot="window-content"
      className={cn("flex-1 select-text overflow-auto px-3 py-2", className)}
      {...props}
    />
  );
}

export {
  WindowContent,
  WindowCaption,
  WindowFooter,
  WindowHeader,
  WindowTitle,
};
