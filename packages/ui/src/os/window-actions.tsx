import * as React from "react";
import { Button } from "../components/button";
import { CardAction } from "../components/card";
import { cn } from "../lib/utils";
import { useWindowController } from "./window";

const WindowControls = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardAction
    ref={ref}
    data-slot="window-controls"
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));

WindowControls.displayName = "WindowControls";

const WindowAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, size = "icon-sm", variant = "ghost", ...props }, ref) => (
  <Button
    ref={ref}
    data-slot="window-control"
    data-window-control
    size={size}
    variant={variant}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
));

WindowAction.displayName = "WindowAction";

const WindowMaximizeButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof WindowAction>
>(({ onClick, ...props }, ref) => {
  const controls = useWindowController();

  return (
    <WindowAction
      ref={ref}
      data-window-maximize
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        controls?.toggleMaximize();
      }}
      {...props}
    />
  );
});

WindowMaximizeButton.displayName = "WindowMaximizeButton";

function useWindowMaximize() {
  const controls = useWindowController();

  const handleDoubleClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!controls) return;
      if (event.currentTarget !== event.target) return;
      controls.toggleMaximize();
    },
    [controls],
  );

  const toggleMaximize = React.useCallback(() => {
    controls?.toggleMaximize();
  }, [controls]);

  return {
    handleDoubleClick: handleDoubleClick,
    isMaximized: controls?.isMaximized ?? false,
    toggleMaximize,
  };
}

export {
  WindowAction,
  WindowControls,
  WindowMaximizeButton,
  useWindowMaximize,
};
