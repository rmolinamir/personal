import type * as React from "react";
import { Button } from "../components/button";
import { CardAction } from "../components/card";
import { cn } from "../lib/utils";
import { useApplication } from "./application";
import { useWindow } from "./window";

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

function WindowHideButton({
  onClick,
  ref,
  ...props
}: React.ComponentProps<typeof WindowAction>) {
  const { toggleHidden } = useWindow();

  return (
    <WindowAction
      ref={ref}
      data-window-hide
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toggleHidden();
      }}
      {...props}
    />
  );
}

function WindowFullscreenButton({
  onClick,
  ref,
  ...props
}: React.ComponentProps<typeof WindowAction>) {
  const { toggleFullscreen } = useWindow();

  return (
    <WindowAction
      ref={ref}
      data-window-fullscreen
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        toggleFullscreen();
      }}
      {...props}
    />
  );
}

function WindowCloseButton({
  onClick,
  ref,
  ...props
}: React.ComponentProps<typeof WindowAction>) {
  const { close } = useApplication();

  return (
    <WindowAction
      ref={ref}
      data-window-fullscreen
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        close();
      }}
      {...props}
    />
  );
}

export {
  WindowAction,
  WindowControls,
  WindowHideButton,
  WindowFullscreenButton,
  WindowCloseButton,
};
