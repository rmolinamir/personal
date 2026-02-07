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
    const dragStartPointerRef = React.useRef<WindowPosition | null>(null);

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

    const computeNextFraming = React.useCallback(
      (payload: WindowFraming) => {
        if (!bounds) return null;
        return clampPercentFraming(
          toPercentFraming(payload, bounds),
          bounds,
          minSize,
          maxSize,
        );
      },
      [bounds, maxSize, minSize],
    );

    const handleDragStop = React.useCallback<RndDragCallback>(
      (event, data) => {
        if (!bounds) return;
        dragStartPointerRef.current = null;
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

        const desiredPixelFraming = {
          position: { x: data.x, y: data.y },
          size: currentSize,
        };
        desiredPixelFramingRef.current = desiredPixelFraming;

        const nextFraming = computeNextFraming(desiredPixelFraming);
        if (nextFraming) {
          setFraming(nextFraming);
        }
        snap?.clearOverlay();
      },
      [bounds, defaultSize, pixelFraming, setFraming, snap, computeNextFraming],
    );

    const handleDrag = React.useCallback<RndDragCallback>(
      (event) => {
        if (!bounds || isMaximized) return;
        const currentSize = pixelFraming?.size ?? defaultSize;
        const snapPointer = getPointerPosition(event);
        if (!snapPointer) return;

        snap?.handleDrag({
          pointer: snapPointer,
          size: currentSize,
        });
      },
      [bounds, defaultSize, isMaximized, pixelFraming, snap],
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
        const desiredPixelFraming = {
          position: nextPosition,
          size: nextSize,
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
      const nextFraming = computeNextFraming({
        position: defaultPosition,
        size: defaultSize,
      });
      if (nextFraming) {
        setFraming(nextFraming);
      }
    }, [
      bounds,
      defaultPosition,
      defaultSize,
      framing,
      setFraming,
      computeNextFraming,
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
          disableDragging={!draggable || isMaximized}
          enableResizing={resizable && !isMaximized}
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
            data-maximized={isMaximized ? "true" : "false"}
            className={cn(
              "os-window flex h-full w-full flex-col gap-0 border-border/80 p-0 shadow-lg",
              "transition-shadow data-[focused=true]:shadow-xl",
              "data-[focused=false]:**:data-[slot=window-content]:select-none",
              "data-[focused=true]:**:data-[slot=window-content]:select-text",
              "data-[maximized=false]:**:data-[slot=window-content]:cursor-move",
              "data-[maximized=true]:**:data-[slot=window-content]:cursor-default",
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

export { Window, useWindowController };

export type {
  WindowFraming,
  WindowPosition,
  WindowSize,
} from "./window-utils";
