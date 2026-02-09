import * as React from "react";
import { cn } from "../lib/utils";
import { useWindowBoundary } from "./window-boundary";
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
type WindowSnapContextValue = {
  handleDrag: (payload: SnapPayload) => void;
  getSnapFraming: (payload: SnapPayload) => WindowPercentFraming | null;
  clearOverlay: () => void;
};

const WindowSnapContext = React.createContext<WindowSnapContextValue | null>(
  null,
);

export type WindowSnapProps = {
  children?: React.ReactNode;
};

function WindowSnap({ children }: WindowSnapProps) {
  const { element, size } = useWindowBoundary();
  const [snapTarget, setSnapTarget] = React.useState<SnapTarget>(null);

  const handleDrag = React.useCallback(
    (payload: SnapPayload) => {
      if (!size || !element) return;
      const rect = element.getBoundingClientRect();
      setSnapTarget(getSnapTarget(payload, rect));
    },
    [element, size],
  );

  const getSnapFraming = React.useCallback(
    (payload: SnapPayload) => {
      if (!size || !element) return null;
      const rect = element.getBoundingClientRect();
      const target = getSnapTarget(payload, rect);
      setSnapTarget(target);
      return getSnapTargetFraming(target);
    },
    [element, size],
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
    </WindowSnapContext.Provider>
  );
}

function useWindowSnap() {
  return React.useContext(WindowSnapContext);
}

export { WindowSnap, useWindowSnap };
