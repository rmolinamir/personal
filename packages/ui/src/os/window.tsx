import * as React from "react";
import {
  Rnd,
  type RndDragCallback,
  type RndResizeCallback,
  type RndResizeStartCallback,
} from "react-rnd";
import { Card } from "../components/card";
import { cn } from "../lib/utils";
import { useWindowBounds } from "./window-hooks";
import { useWindowState } from "./window-provider";
import { useWindowSnap } from "./window-snap";
import {
  clampPercentFraming,
  getCenteredFraming,
  getPointerPosition,
  toPercentFraming,
  toPixelFraming,
  type WindowPercentFraming,
  type WindowPixelFraming,
  type WindowPosition,
  type WindowSize,
} from "./window-utils";

const fallbackMinSize: WindowSize = { height: 200, width: 280 };
const fallbackFramingSize = { height: 70, width: 60 } satisfies WindowSize;
const fallbackFraming = getCenteredFraming(fallbackFramingSize);

type WindowControlsContextValue = {
  isFullscreen: boolean;
  isHidden: boolean;
  toggleHidden: () => void;
  toggleFullscreen: () => void;
};

const WindowControllerContext =
  React.createContext<WindowControlsContextValue | null>(null);

function useWindowController() {
  return React.useContext(WindowControllerContext);
}

export type WindowProps = React.ComponentProps<typeof Card> & {
  defaultFraming?: Omit<WindowPercentFraming, "unit">;
  minSize?: WindowSize;
  maxSize?: WindowSize;
  draggable?: boolean;
  resizable?: boolean;
};

function Window({
  className,
  children,
  defaultFraming: defaultPercentageFraming,
  minSize = fallbackMinSize,
  maxSize,
  draggable = true,
  resizable = true,
  style,
  ref,
  ...props
}: WindowProps) {
  const defaultFraming = defaultPercentageFraming
    ? ({
        ...defaultPercentageFraming,
        unit: "percent",
      } satisfies WindowPercentFraming)
    : undefined;
  const windowId = React.useId();

  const rndRef = React.useRef<Rnd>(null);
  const previousBoundsRef = React.useRef<WindowSize | null>(null);
  const desiredPixelFramingRef = React.useRef<WindowPixelFraming | null>(null);
  const dragStartPointerRef = React.useRef<WindowPosition | null>(null);

  const {
    activate,
    framing,
    isActive,
    isFullscreen,
    isHidden,
    setFraming,
    toggleHidden,
    toggleFullscreen,
    zIndex,
  } = useWindowState(windowId);
  const bounds = useWindowBounds(rndRef);
  const snap = useWindowSnap();

  const controller = React.useMemo<WindowControlsContextValue>(
    () => ({ isFullscreen, isHidden, toggleFullscreen, toggleHidden }),
    [isFullscreen, isHidden, toggleFullscreen, toggleHidden],
  );

  const computeNextFraming = React.useCallback(
    (pixelFraming: WindowPixelFraming) => {
      if (!bounds) return null;
      return clampPercentFraming(
        toPercentFraming(pixelFraming, bounds),
        bounds,
        minSize,
        maxSize,
      );
    },
    [bounds, maxSize, minSize],
  );

  const pixelFraming = React.useMemo(() => {
    if (!bounds || !framing) return null;
    return toPixelFraming(framing, bounds);
  }, [bounds, framing]);

  const defaultPixelFraming = React.useMemo(() => {
    if (!bounds || !defaultFraming) return null;
    return toPixelFraming(defaultFraming, bounds);
  }, [bounds, defaultFraming]);

  const fallbackPixelFraming = React.useMemo(() => {
    if (!bounds) return null;
    return toPixelFraming(fallbackFraming, bounds);
  }, [bounds]);

  const handleDragStop = React.useCallback<RndDragCallback>(
    (event, data) => {
      if (!bounds) return;
      dragStartPointerRef.current = null;
      const currentSize =
        pixelFraming?.size ??
        defaultPixelFraming?.size ??
        fallbackPixelFraming?.size ??
        fallbackFraming.size;
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

      const desiredPixelFraming: WindowPixelFraming = {
        position: { x: data.x, y: data.y },
        size: currentSize,
        unit: "px",
      };
      desiredPixelFramingRef.current = desiredPixelFraming;

      const nextFraming = computeNextFraming(desiredPixelFraming);
      if (nextFraming) {
        setFraming(nextFraming);
      }
      snap?.clearOverlay();
    },
    [
      bounds,
      defaultPixelFraming,
      fallbackPixelFraming,
      pixelFraming,
      setFraming,
      snap,
      computeNextFraming,
    ],
  );

  const handleDrag = React.useCallback<RndDragCallback>(
    (event) => {
      if (!bounds || isFullscreen) return;
      const currentSize =
        pixelFraming?.size ??
        defaultPixelFraming?.size ??
        fallbackPixelFraming?.size ??
        fallbackFraming.size;
      const snapPointer = getPointerPosition(event);
      if (!snapPointer) return;

      snap?.handleDrag({
        pointer: snapPointer,
        size: currentSize,
      });
    },
    [
      bounds,
      defaultPixelFraming,
      fallbackPixelFraming,
      isFullscreen,
      pixelFraming,
      snap,
    ],
  );

  const handleDragStart = React.useCallback<RndDragCallback>(
    (event) => {
      dragStartPointerRef.current = getPointerPosition(event);
      activate();
    },
    [activate],
  );

  const handleResizeStop = React.useCallback<RndResizeCallback>(
    (_event, _direction, refElement, _delta, nextPosition) => {
      if (!bounds) return;
      const nextSize = {
        height: refElement.offsetHeight,
        width: refElement.offsetWidth,
      };
      const desiredPixelFraming: WindowPixelFraming = {
        position: nextPosition,
        size: nextSize,
        unit: "px",
      };
      desiredPixelFramingRef.current = desiredPixelFraming;

      const nextFraming = computeNextFraming(desiredPixelFraming);
      if (nextFraming) {
        setFraming(nextFraming);
      }
    },
    [bounds, setFraming, computeNextFraming],
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
    setFraming(defaultFraming ?? fallbackFraming);
  }, [bounds, defaultFraming, framing, setFraming]);

  // Keep the window inside bounds when the workspace size changes
  React.useEffect(() => {
    if (!bounds || !framing || isFullscreen) {
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
        pixelFraming ??
        defaultPixelFraming ??
        fallbackPixelFraming ?? {
          position: { x: 0, y: 0 },
          size: fallbackFraming.size,
          unit: "px",
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
          unit: "px",
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
    isFullscreen,
    minSize,
    setFraming,
    pixelFraming,
    defaultPixelFraming,
    fallbackPixelFraming,
  ]);

  return (
    <WindowControllerContext.Provider value={controller}>
      <Rnd
        ref={rndRef}
        bounds="parent"
        disableDragging={!draggable || isFullscreen || isHidden}
        enableResizing={resizable && !isFullscreen && !isHidden}
        minWidth={minSize.width}
        minHeight={minSize.height}
        maxWidth={maxSize?.width}
        maxHeight={maxSize?.height}
        default={undefined}
        position={pixelFraming?.position}
        size={pixelFraming?.size}
        style={{
          maxHeight: "100%",
          maxWidth: "100%",
          opacity: isHidden ? 0 : 1,
          pointerEvents: isHidden ? "none" : undefined,
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
          data-hidden={isHidden ? "true" : "false"}
          data-fullscreen={isFullscreen ? "true" : "false"}
          className={cn(
            "os-window flex h-full w-full flex-col gap-0 border-border/80 p-0 shadow-lg",
            "transition-shadow data-[focused=true]:shadow-xl",
            "data-[focused=false]:**:data-[slot=window-content]:select-none",
            "data-[focused=true]:**:data-[slot=window-content]:select-text",
            "data-[fullscreen=false]:**:data-[slot=window-content]:cursor-move",
            "data-[fullscreen=true]:**:data-[slot=window-content]:cursor-default",
            className,
          )}
          {...props}
        >
          {children}
        </Card>
      </Rnd>
    </WindowControllerContext.Provider>
  );
}

export { Window, useWindowController };

export type {
  WindowPercentFraming,
  WindowPixelFraming,
  WindowPosition,
  WindowSize,
} from "./window-utils";
