import * as React from "react";
import { cn } from "../lib/utils";
import type {
  WindowPercentFraming,
  WindowPosition,
  WindowSize,
} from "./window-utils";

type SnapTarget = "left" | "right" | null;

type SnapPayload = {
  pointer: WindowPosition;
  size: WindowSize;
};

type WindowSnapContextValue = {
  handleDrag: (payload: SnapPayload) => void;
  getSnapFraming: (payload: SnapPayload) => WindowPercentFraming | null;
  clearOverlay: () => void;
};

const WindowSnapContext = React.createContext<WindowSnapContextValue | null>(
  null,
);

export type WindowSnapProps = React.ComponentProps<"div">;

const edgeThreshold = 24;

function getSnapTarget(payload: SnapPayload, rect: DOMRect): SnapTarget {
  const pointerX = payload.pointer.x;
  if (pointerX <= rect.left + edgeThreshold) return "left";
  if (pointerX >= rect.right - edgeThreshold) return "right";
  return null;
}

function getSnapTargetFraming(target: SnapTarget): WindowPercentFraming | null {
  if (!target) return null;
  return {
    position: { x: target === "left" ? 0 : 50, y: 0 },
    size: { height: 100, width: 50 },
    unit: "percent",
  };
}

function WindowSnap({ className, children, ref, ...props }: WindowSnapProps) {
  const snapRef = React.useRef<HTMLDivElement | null>(null);
  const [boundsSize, setBoundsSize] = React.useState<WindowSize | null>(null);
  const [snapTarget, setSnapTarget] = React.useState<SnapTarget>(null);

  React.useLayoutEffect(() => {
    const element = snapRef.current;
    if (!element) return undefined;

    const updateBounds = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (width <= 0 || height <= 0) return;
      setBoundsSize({ height, width });
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleDrag = React.useCallback(
    (payload: SnapPayload) => {
      if (!boundsSize || !snapRef.current) return;
      const rect = snapRef.current.getBoundingClientRect();
      setSnapTarget(getSnapTarget(payload, rect));
    },
    [boundsSize],
  );

  const getSnapFraming = React.useCallback(
    (payload: SnapPayload) => {
      if (!boundsSize || !snapRef.current) return null;
      const rect = snapRef.current.getBoundingClientRect();
      const target = getSnapTarget(payload, rect);
      setSnapTarget(target);
      return getSnapTargetFraming(target);
    },
    [boundsSize],
  );

  const clearOverlay = React.useCallback(() => {
    setSnapTarget(null);
  }, []);

  const value = React.useMemo<WindowSnapContextValue>(
    () => ({
      clearOverlay,
      getSnapFraming,
      handleDrag,
    }),
    [clearOverlay, handleDrag, getSnapFraming],
  );

  return (
    <WindowSnapContext.Provider value={value}>
      <div
        ref={(node) => {
          snapRef.current = node;
          if (!ref) return;
          if (typeof ref === "function") {
            ref(node);
          } else {
            ref.current = node;
          }
        }}
        className={cn("relative", className)}
        {...props}
      >
        {children}
        {snapTarget && (
          <div className="pointer-events-none absolute inset-0 z-20">
            <div
              className={cn([
                "absolute inset-y-0 w-1/2 rounded-2xl border-2 border-border/80 from-muted/60 via-muted/50 to-muted/30 shadow-inner",
                {
                  "left-0 bg-linear-to-r": snapTarget === "left",
                  "right-0 bg-linear-to-l": snapTarget === "right",
                },
              ])}
            />
          </div>
        )}
      </div>
    </WindowSnapContext.Provider>
  );
}

WindowSnap.displayName = "WindowSnap";

function useWindowSnap() {
  return React.useContext(WindowSnapContext);
}

export { WindowSnap, useWindowSnap };
