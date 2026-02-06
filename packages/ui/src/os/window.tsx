import * as React from "react";
import { Rnd, type RndDragCallback, type RndResizeCallback } from "react-rnd";
import { Button } from "../components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { cn } from "../lib/utils";

export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowBounds = string | HTMLElement;

export type WindowProps = React.HTMLAttributes<HTMLDivElement> & {
  position?: WindowPosition;
  defaultPosition?: WindowPosition;
  size?: WindowSize;
  defaultSize?: WindowSize;
  minSize?: WindowSize;
  maxSize?: WindowSize;
  bounds?: WindowBounds;
  draggable?: boolean;
  resizable?: boolean;
  focused?: boolean;
  zIndex?: number;
  onFocus?: () => void;
  onPositionChange?: (position: WindowPosition) => void;
  onSizeChange?: (size: WindowSize) => void;
};

const defaultPosition: WindowPosition = { x: 120, y: 120 };
const defaultSize: WindowSize = { height: 380, width: 560 };
const defaultMinSize: WindowSize = { height: 200, width: 280 };

function toRndSize(size: WindowSize) {
  return { height: size.height, width: size.width };
}

function toRndPosition(position: WindowPosition) {
  return { x: position.x, y: position.y };
}

const Window = React.forwardRef<HTMLDivElement, WindowProps>(
  (
    {
      className,
      children,
      position,
      defaultPosition: initialPosition,
      size,
      defaultSize: initialSize,
      minSize = defaultMinSize,
      maxSize,
      bounds,
      draggable = true,
      resizable = true,
      focused,
      zIndex,
      onFocus,
      onPositionChange,
      onSizeChange,
      style,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledPosition, setUncontrolledPosition] = React.useState(
      initialPosition ?? position ?? defaultPosition,
    );
    const [uncontrolledSize, setUncontrolledSize] = React.useState(
      initialSize ?? size ?? defaultSize,
    );

    const resolvedPosition = position ?? uncontrolledPosition;
    const resolvedSize = size ?? uncontrolledSize;

    const handleDragStop = React.useCallback<RndDragCallback>(
      (_event, data) => {
        const nextPosition = { x: data.x, y: data.y };
        if (!position) {
          setUncontrolledPosition(nextPosition);
        }
        onPositionChange?.(nextPosition);
      },
      [onPositionChange, position],
    );

    const handleResizeStop = React.useCallback<RndResizeCallback>(
      (_event, _direction, refElement, _delta, nextPosition) => {
        const nextSize = {
          height: refElement.offsetHeight,
          width: refElement.offsetWidth,
        };
        if (!size) {
          setUncontrolledSize(nextSize);
        }
        if (!position) {
          setUncontrolledPosition(nextPosition);
        }
        onSizeChange?.(nextSize);
        onPositionChange?.(nextPosition);
      },
      [onPositionChange, onSizeChange, position, size],
    );

    const handlePointerDown = React.useCallback(() => {
      onFocus?.();
    }, [onFocus]);

    return (
      <Rnd
        bounds={bounds}
        disableDragging={!draggable}
        enableResizing={resizable}
        dragHandleClassName="os-window__drag-handle"
        minWidth={minSize.width}
        minHeight={minSize.height}
        maxWidth={maxSize?.width}
        maxHeight={maxSize?.height}
        position={toRndPosition(resolvedPosition)}
        size={toRndSize(resolvedSize)}
        style={{ zIndex, ...style }}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onMouseDown={handlePointerDown}
      >
        <Card
          ref={ref}
          data-slot="window"
          data-focused={focused ? "true" : "false"}
          className={cn(
            "os-window flex h-full w-full flex-col gap-0 border-border/80 p-0 shadow-lg",
            "transition-shadow data-[focused=true]:shadow-xl",
            className,
          )}
          {...props}
        >
          {children}
        </Card>
      </Rnd>
    );
  },
);

Window.displayName = "Window";

const WindowHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    data-slot="window-header"
    className={cn(
      "os-window__drag-handle flex cursor-grab select-none flex-row items-center justify-between gap-3",
      "border-border/80 border-b bg-muted/60 px-3 py-2",
      "auto-rows-auto grid-rows-none items-center",
      className,
    )}
    {...props}
  />
));

WindowHeader.displayName = "WindowHeader";

const WindowTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    data-slot="window-title"
    className={cn("truncate font-medium text-sm", className)}
    {...props}
  />
));

WindowTitle.displayName = "WindowTitle";

const WindowDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    data-slot="window-description"
    className={cn("text-xs", className)}
    {...props}
  />
));

WindowDescription.displayName = "WindowDescription";

const WindowActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardAction
    ref={ref}
    data-slot="window-actions"
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
));

WindowActions.displayName = "WindowActions";

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

const WindowFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    data-slot="window-footer"
    className={cn("px-3 py-2", className)}
    {...props}
  />
));

WindowFooter.displayName = "WindowFooter";

const WindowContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    data-slot="window-content"
    className={cn("flex-1 overflow-auto px-3 py-2", className)}
    {...props}
  />
));

WindowContent.displayName = "WindowContent";

export {
  Window,
  WindowHeader,
  WindowTitle,
  WindowDescription,
  WindowActions,
  WindowAction,
  WindowContent,
  WindowFooter,
};
