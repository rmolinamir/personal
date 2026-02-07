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
import { useWindowSnap } from "./window-snap";
import {
  clampPercentFraming,
  getCenteredPosition,
  getPointerPosition,
  toPercentFraming,
  toPixelFraming,
  type WindowFraming,
  type WindowPosition,
  type WindowSize,
} from "./window-utils";

const fallbackMinSize: WindowSize = { height: 200, width: 280 };
const fallbackPosition: WindowPosition = { x: 0, y: 0 };
const fallbackSize: WindowSize = { height: 360, width: 480 };

type WindowControlsContextValue = {
  isMaximized: boolean;
  toggleMaximize: () => void;
};

const WindowControllerContext =
  React.createContext<WindowControlsContextValue | null>(null);

function useWindowController() {
  return React.useContext(WindowControllerContext);
}

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

    const {
      activate,
      framing,
      isActive,
      isMaximized,
      setFraming,
      toggleMaximize,
      zIndex,
    } = useWindowState(windowId);
    const bounds = useWindowBounds(rndRef);
    const snap = useWindowSnap();

    const defaultSize = initialSize ?? fallbackSize;

    const controller = React.useMemo<WindowControlsContextValue>(
      () => ({ isMaximized, toggleMaximize }),
      [isMaximized, toggleMaximize],
    );

    const defaultPosition = React.useMemo(() => {
      if (!bounds || initialPosition) {
        return initialPosition ?? fallbackPosition;
      }
      return getCenteredPosition(bounds, defaultSize);
    }, [bounds, defaultSize, initialPosition]);

    const pixelFraming = React.useMemo(() => {
      if (!bounds || !framing) return null;
      return toPixelFraming(framing, bounds);
    }, [bounds, framing]);

    const handleDragStop = React.useCallback<RndDragCallback>(
      (event, data) => {
        if (!bounds) return;
        const currentSize = pixelFraming?.size ?? defaultSize;
        const snapPointer = getPointerPosition(event);
        const snapFraming = snapPointer
          ? snap?.getSnapFraming({
              pointer: snapPointer,
              size: currentSize,
            })
          : null;

        // If the window is snapping, use the snap's framing then clear the overlay
        if (snapFraming) {
          setFraming(snapFraming);
          snap?.clearOverlay();
          return;
        }

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
            bounds,
          ),
          bounds,
          minSize,
          maxSize,
        );
        setFraming(nextFraming);
        snap?.clearOverlay();
      },
      [bounds, defaultSize, maxSize, minSize, pixelFraming, setFraming, snap],
    );

    const handleDrag = React.useCallback<RndDragCallback>(
      (event) => {
        if (!bounds) return;
        const currentSize = pixelFraming?.size ?? defaultSize;
        const snapPointer = getPointerPosition(event);
        if (!snapPointer) return;
        snap?.onDrag({
          pointer: snapPointer,
          size: currentSize,
        });
      },
      [bounds, defaultSize, pixelFraming, snap],
    );

    const handleDragStart = React.useCallback<RndDragCallback>(() => {
      activate();
    }, [activate]);

    const handleResizeStop = React.useCallback<RndResizeCallback>(
      (_event, _direction, refElement, _delta, nextPosition) => {
        if (!bounds) return;
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
            bounds,
          ),
          bounds,
          minSize,
          maxSize,
        );
        setFraming(nextFraming);
      },
      [bounds, maxSize, minSize, setFraming],
    );

    const handleResizeStart = React.useCallback<RndResizeStartCallback>(() => {
      activate();
    }, [activate]);

    const handleMouseDown = React.useCallback(() => {
      activate();
    }, [activate]);

    // Initialize the frame once we know bounds
    React.useEffect(() => {
      if (!bounds || framing) return;
      const nextFraming = clampPercentFraming(
        toPercentFraming(
          {
            position: defaultPosition,
            size: defaultSize,
          },
          bounds,
        ),
        bounds,
        minSize,
        maxSize,
      );
      setFraming(nextFraming);
    }, [
      bounds,
      defaultPosition,
      defaultSize,
      framing,
      maxSize,
      minSize,
      setFraming,
    ]);

    // Keep the window inside bounds when the workspace size changes
    React.useEffect(() => {
      if (!bounds || !framing || isMaximized) {
        previousBoundsRef.current = bounds;
        return;
      }

      const previousBounds = previousBoundsRef.current;
      if (!previousBounds) {
        previousBoundsRef.current = bounds;
        return;
      }

      const boundsDecreased =
        bounds.width < previousBounds.width ||
        bounds.height < previousBounds.height;
      const boundsIncreased =
        bounds.width > previousBounds.width ||
        bounds.height > previousBounds.height;

      if (boundsDecreased || boundsIncreased) {
        // Use the last user-driven pixel frame as the target
        const desiredPixelFraming = desiredPixelFramingRef.current ??
          pixelFraming ?? {
            position: { x: 0, y: 0 },
            size: defaultSize,
          };

        const widthOverflow = desiredPixelFraming.size.width > bounds.width;
        const heightOverflow = desiredPixelFraming.size.height > bounds.height;

        const nextSize = {
          height: heightOverflow
            ? Math.max(
                minSize.height,
                Math.min(desiredPixelFraming.size.height, bounds.height),
              )
            : desiredPixelFraming.size.height,
          width: widthOverflow
            ? Math.max(
                minSize.width,
                Math.min(desiredPixelFraming.size.width, bounds.width),
              )
            : desiredPixelFraming.size.width,
        };

        const maxX = Math.max(0, bounds.width - nextSize.width);
        const maxY = Math.max(0, bounds.height - nextSize.height);

        const nextPosition = {
          x: Math.min(Math.max(desiredPixelFraming.position.x, 0), maxX),
          y: Math.min(Math.max(desiredPixelFraming.position.y, 0), maxY),
        };

        const nextFraming = toPercentFraming(
          {
            position: nextPosition,
            size: nextSize,
          },
          bounds,
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

      previousBoundsRef.current = bounds;
    }, [
      bounds,
      framing,
      isMaximized,
      minSize,
      setFraming,
      pixelFraming,
      defaultSize,
    ]);

    return (
      <WindowControllerContext.Provider value={controller}>
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
          onDrag={handleDrag}
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
      </WindowControllerContext.Provider>
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
      "border-border/80 border-b bg-muted/60 px-3 py-2!",
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

function useWindowMaximize() {
  const controls = useWindowController();

  const onDoubleClick = React.useCallback(
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
    isMaximized: controls?.isMaximized ?? false,
    onDoubleClick,
    toggleMaximize,
  };
}

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
  WindowMaximizeButton,
  WindowContent,
  WindowFooter,
};

export { useWindowMaximize };

export type {
  WindowFraming,
  WindowPosition,
  WindowSize,
} from "./window-utils";
