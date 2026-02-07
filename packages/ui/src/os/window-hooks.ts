import * as React from "react";
import type { Rnd } from "react-rnd";

import type { WindowSize } from "./window-utils";
import { getParentElement } from "./window-utils";

export function useWindowBounds(rndRef: React.RefObject<Rnd | null>) {
  const [boundsSize, setBoundsSize] = React.useState<WindowSize | null>(null);

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    const boundsElement = getParentElement(rndRef);
    if (!boundsElement) {
      setBoundsSize(null);
      return undefined;
    }

    const updateBoundsSize = () => {
      const height = boundsElement.clientHeight;
      const width = boundsElement.clientWidth;
      if (height <= 0 || width <= 0) return;
      setBoundsSize({ height, width });
    };

    updateBoundsSize();
    const observer = new ResizeObserver(updateBoundsSize);
    observer.observe(boundsElement);

    return () => observer.disconnect();
  }, [rndRef]);

  return boundsSize;
}
