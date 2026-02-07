import * as React from "react";
import {
  Rnd,
  type RndDragCallback,
  type RndResizeCallback,
  type RndResizeStartCallback,
} from "react-rnd";
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
import { useWindowBounds } from "./window-hooks";
import { useWindowState } from "./window-provider";
import type { WindowFraming, WindowPosition, WindowSize } from "./window-utils";
import {
  clampPercentFraming,
  getCenteredPosition,
  toPercentFraming,
  toPixelFraming,
} from "./window-utils";

const fallbackMinSize: WindowSize = { height: 200, width: 280 };
const fallbackPosition: WindowPosition = { x: 0, y: 0 };
const fallbackSize: WindowSize = { height: 360, width: 480 };

export type WindowProps = React.HTMLAttributes<HTMLDivElement> & {
  defaultPosition?: WindowPosition;
  defaultSize?: WindowSize;
  minSize?: WindowSize;
  maxSize?: WindowSize;
  draggable?: boolean;
  resizable?: boolean;
};

const Window = React.forwardRef<HTMLDivElement, WindowProps>(
  (
    {
      className,
      children,
      defaultPosition: initialPosition,
      defaultSize: initialSize,
      minSize = fallbackMinSize,
      maxSize,
      draggable = true,
      resizable = true,
      style,
      ...props
    },
    ref,
  ) => {
    const windowId = React.useId();

    const rndRef = React.useRef<Rnd>(null);
    const previousBoundsRef = React.useRef<WindowSize | null>(null);
    const desiredPixelFramingRef = React.useRef<WindowFraming | null>(null);

    const boundsSize = useWindowBounds(rndRef);
    const { activate, framing, isActive, setFraming, zIndex } =
      useWindowState(windowId);

    const defaultSize = initialSize ?? fallbackSize;

    const defaultPosition = React.useMemo(() => {
      if (!boundsSize || initialPosition) {
        return initialPosition ?? fallbackPosition;
      }
      return getCenteredPosition(boundsSize, defaultSize);
    }, [boundsSize, defaultSize, initialPosition]);

    const pixelFraming = React.useMemo(() => {
      if (!boundsSize || !framing) return null;
      return toPixelFraming(framing, boundsSize);
    }, [boundsSize, framing]);

    const handleDragStop = React.useCallback<RndDragCallback>(
      (_event, data) => {
        if (!boundsSize) return;
        const currentSize = pixelFraming?.size ?? defaultSize;
        desiredPixelFramingRef.current = {
          position: { x: data.x, y: data.y },
          size: currentSize,
        };
        const nextFraming = clampPercentFraming(
          toPercentFraming(
            {
              position: { x: data.x, y: data.y },
              size: currentSize,
            },
            boundsSize,
          ),
          boundsSize,
          minSize,
          maxSize,
        );
        setFraming(nextFraming);
      },
      [boundsSize, defaultSize, maxSize, minSize, pixelFraming, setFraming],
    );

    const handleDragStart = React.useCallback<RndDragCallback>(() => {
      activate();
    }, [activate]);

    const handleResizeStop = React.useCallback<RndResizeCallback>(
      (_event, _direction, refElement, _delta, nextPosition) => {
        if (!boundsSize) return;
        const nextSize = {
          height: refElement.offsetHeight,
          width: refElement.offsetWidth,
        };
        desiredPixelFramingRef.current = {
          position: nextPosition,
          size: nextSize,
        };
        const nextFraming = clampPercentFraming(
          toPercentFraming(
            {
              position: nextPosition,
              size: nextSize,
            },
            boundsSize,
          ),
          boundsSize,
          minSize,
          maxSize,
        );
        setFraming(nextFraming);
      },
      [boundsSize, maxSize, minSize, setFraming],
    );

    const handleResizeStart = React.useCallback<RndResizeStartCallback>(() => {
      activate();
    }, [activate]);

    const handleMouseDown = React.useCallback(() => {
      activate();
    }, [activate]);

    // Initialize the frame once we know bounds
    React.useEffect(() => {
      if (!boundsSize || framing) return;
      const nextFraming = clampPercentFraming(
        toPercentFraming(
          {
            position: defaultPosition,
            size: defaultSize,
          },
          boundsSize,
        ),
        boundsSize,
        minSize,
        maxSize,
      );
      setFraming(nextFraming);
    }, [
      boundsSize,
      defaultPosition,
      defaultSize,
      framing,
      maxSize,
      minSize,
      setFraming,
    ]);

    // Keep the window inside bounds when the workspace size changes
    React.useEffect(() => {
      if (!boundsSize || !framing) {
        previousBoundsRef.current = boundsSize;
        return;
      }

      const previousBounds = previousBoundsRef.current;
      if (!previousBounds) {
        previousBoundsRef.current = boundsSize;
        return;
      }

      const boundsDecreased =
        boundsSize.width < previousBounds.width ||
        boundsSize.height < previousBounds.height;
      const boundsIncreased =
        boundsSize.width > previousBounds.width ||
        boundsSize.height > previousBounds.height;

      if (boundsDecreased || boundsIncreased) {
        // Use the last user-driven pixel frame as the target
        const desiredPixelFraming = desiredPixelFramingRef.current ??
          pixelFraming ?? {
            position: { x: 0, y: 0 },
            size: defaultSize,
          };

        const widthOverflow = desiredPixelFraming.size.width > boundsSize.width;
        const heightOverflow =
          desiredPixelFraming.size.height > boundsSize.height;

        const nextSize = {
          height: heightOverflow
            ? Math.max(
                minSize.height,
                Math.min(desiredPixelFraming.size.height, boundsSize.height),
              )
            : desiredPixelFraming.size.height,
          width: widthOverflow
            ? Math.max(
                minSize.width,
                Math.min(desiredPixelFraming.size.width, boundsSize.width),
              )
            : desiredPixelFraming.size.width,
        };

        const maxX = Math.max(0, boundsSize.width - nextSize.width);
        const maxY = Math.max(0, boundsSize.height - nextSize.height);

        const nextPosition = {
          x: Math.min(Math.max(desiredPixelFraming.position.x, 0), maxX),
          y: Math.min(Math.max(desiredPixelFraming.position.y, 0), maxY),
        };

        const nextFraming = toPercentFraming(
          {
            position: nextPosition,
            size: nextSize,
          },
          boundsSize,
        );

        if (
          nextFraming.position.x !== framing.position.x ||
          nextFraming.position.y !== framing.position.y ||
          nextFraming.size.width !== framing.size.width ||
          nextFraming.size.height !== framing.size.height
        ) {
          setFraming(nextFraming);
        }
      }

      previousBoundsRef.current = boundsSize;
    }, [boundsSize, framing, minSize, setFraming, pixelFraming, defaultSize]);

    return (
      <Rnd
        ref={rndRef}
        bounds="parent"
        disableDragging={!draggable}
        enableResizing={resizable}
        dragHandleClassName="os-window__drag-handle"
        minWidth={minSize.width}
        minHeight={minSize.height}
        maxWidth={maxSize?.width}
        maxHeight={maxSize?.height}
        default={{
          ...defaultSize,
          ...defaultPosition,
        }}
        position={pixelFraming?.position}
        size={pixelFraming?.size}
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          ...style,
          zIndex,
        }}
        onDragStop={handleDragStop}
        onDragStart={handleDragStart}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
        onMouseDown={handleMouseDown}
      >
        <Card
          ref={ref}
          data-slot="window"
          data-focused={isActive ? "true" : "false"}
          className={cn(
            "os-window flex h-full w-full flex-col gap-0 border-border/80 p-0 shadow-lg",
            "transition-shadow data-[focused=true]:shadow-xl",
            "data-[focused=false]:**:data-[slot=window-content]:select-none",
            "data-[focused=true]:**:data-[slot=window-content]:select-text",
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
    className={cn("flex-1 select-text overflow-auto px-3 py-2", className)}
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

export type {
  WindowFraming,
  WindowPosition,
  WindowSize,
} from "./window-utils";
