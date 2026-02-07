import type { RefObject } from "react";
import type { Rnd, RndDragCallback } from "react-rnd";

export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowPercentFraming = {
  unit: "percent";
  position: WindowPosition;
  size: WindowSize;
};

export type WindowPixelFraming = {
  unit: "px";
  position: WindowPosition;
  size: WindowSize;
};

export type RndInstance = Rnd & {
  updatePosition: (position: WindowPosition) => void;
  updateSize: (size: WindowSize) => void;
  getSelfElement?: () => HTMLElement | null;
  resizableElement?: HTMLElement;
};

export type RndDraggableEvent = Parameters<RndDragCallback>[0];

export function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getCenteredPosition(bounds: WindowSize, size: WindowSize) {
  const x = Math.max(0, (bounds.width - size.width) / 2);
  const y = Math.max(0, (bounds.height - size.height) / 2);
  return { x: Math.round(x), y: Math.round(y) };
}

export function getCenteredFraming(size: WindowSize): WindowPercentFraming {
  return {
    unit: "percent",
    position: {
      x: Math.max(0, 50 - size.width / 2),
      y: Math.max(0, 50 - size.height / 2),
    },
    size,
  };
}

export function getParentElement(rndRef: RefObject<Rnd | null>) {
  const instance = rndRef.current as RndInstance | null;
  const selfElement =
    instance?.getSelfElement?.() ?? instance?.resizableElement ?? null;
  return selfElement?.parentElement ?? null;
}

export function getPointerPosition(event: RndDraggableEvent | null) {
  if (!event) return null;
  if ("touches" in event) {
    const touch = event.touches[0] ?? event.changedTouches[0];
    if (!touch) return null;
    return { x: touch.clientX, y: touch.clientY };
  }
  return { x: event.clientX, y: event.clientY };
}

export function toPercentFraming(
  framing: WindowPixelFraming,
  bounds: WindowSize,
): WindowPercentFraming {
  const width = bounds.width || 1;
  const height = bounds.height || 1;

  return {
    unit: "percent",
    position: {
      x: (framing.position.x / width) * 100,
      y: (framing.position.y / height) * 100,
    },
    size: {
      width: (framing.size.width / width) * 100,
      height: (framing.size.height / height) * 100,
    },
  };
}

export function toPixelFraming(
  framing: WindowPercentFraming,
  bounds: WindowSize,
): WindowPixelFraming {
  return {
    unit: "px",
    position: {
      x: (framing.position.x / 100) * bounds.width,
      y: (framing.position.y / 100) * bounds.height,
    },
    size: {
      width: Math.max(1, (framing.size.width / 100) * bounds.width),
      height: Math.max(1, (framing.size.height / 100) * bounds.height),
    },
  };
}

export function clampPercentFraming(
  framing: WindowPercentFraming,
  bounds: WindowSize,
  minSize: WindowSize,
  maxSize?: WindowSize,
): WindowPercentFraming {
  if (bounds.width <= 0 || bounds.height <= 0) return framing;

  const maxWidth = maxSize?.width ?? bounds.width;
  const maxHeight = maxSize?.height ?? bounds.height;
  const minWidthPercent = (minSize.width / bounds.width) * 100;
  const minHeightPercent = (minSize.height / bounds.height) * 100;
  const maxWidthPercent = (maxWidth / bounds.width) * 100;
  const maxHeightPercent = (maxHeight / bounds.height) * 100;

  const width = clampValue(framing.size.width, minWidthPercent, maxWidthPercent);
  const height = clampValue(
    framing.size.height,
    minHeightPercent,
    maxHeightPercent,
  );
  const maxX = Math.max(0, 100 - width);
  const maxY = Math.max(0, 100 - height);
  const x = clampValue(framing.position.x, 0, maxX);
  const y = clampValue(framing.position.y, 0, maxY);

  return {
    unit: "percent",
    position: { x, y },
    size: { width, height },
  };
}
