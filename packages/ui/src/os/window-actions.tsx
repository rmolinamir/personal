import * as React from "react";
import { Button } from "../components/button";
import { CardAction } from "../components/card";
import { cn } from "../lib/utils";
import { useWindowController } from "./window";

function WindowControls({
  className,
  ref,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <CardAction
      ref={ref}
      data-slot="window-controls"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

function WindowAction({
  className,
  size = "icon-sm",
  variant = "ghost",
  ref,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      ref={ref}
      data-slot="window-control"
      data-window-control
      size={size}
      variant={variant}
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function WindowFullscreenButton({
  onClick,
  ref,
  ...props
}: React.ComponentProps<typeof WindowAction>) {
  const controls = useWindowController();

  return (
    <WindowAction
      ref={ref}
      data-window-fullscreen
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        controls?.toggleFullscreen();
      }}
      {...props}
    />
  );
}

function useWindowFullscreen() {
  const controls = useWindowController();

  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!controls) return;
      if (event.currentTarget !== event.target) return;
      controls.toggleFullscreen();
    },
    [controls],
  );

  const toggleFullscreen = React.useCallback(() => {
    controls?.toggleFullscreen();
  }, [controls]);

  return {
    handleDoubleClick: handleDoubleClick,
    isFullscreen: controls?.isFullscreen ?? false,
    toggleFullscreen,
  };
}

export {
  WindowAction,
  WindowControls,
  WindowFullscreenButton,
  useWindowFullscreen,
};
