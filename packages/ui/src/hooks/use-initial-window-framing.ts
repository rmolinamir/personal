import * as React from "react";
import type { WindowPercentFraming } from "../os/window-utils";

export function useInitialWindowFraming(
  factory: () => WindowPercentFraming | null,
): WindowPercentFraming | null {
  const framingRef = React.useRef<WindowPercentFraming | null>(null);

  if (!framingRef.current) {
    const nextFraming = factory();
    if (nextFraming) {
      framingRef.current = nextFraming;
    }
  }

  return framingRef.current;
}
