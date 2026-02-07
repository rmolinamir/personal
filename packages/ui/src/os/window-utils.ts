import type { RefObject } from "react";
import type { Rnd } from "react-rnd";

export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowFraming = {
  position: WindowPosition;
  size: WindowSize;
};

export type RndInstance = Rnd & {
  updatePosition: (position: WindowPosition) => void;
  updateSize: (size: WindowSize) => void;
  getSelfElement?: () => HTMLElement | null;
  resizableElement?: HTMLElement;
};

export function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getCenteredPosition(bounds: WindowSize, size: WindowSize) {
  const x = Math.max(0, (bounds.width - size.width) / 2);
  const y = Math.max(0, (bounds.height - size.height) / 2);
  return { x: Math.round(x), y: Math.round(y) };
}

export function getParentElement(rndRef: RefObject<Rnd | null>) {
  const instance = rndRef.current as RndInstance | null;
  const selfElement =
    instance?.getSelfElement?.() ?? instance?.resizableElement ?? null;
  return selfElement?.parentElement ?? null;
}

export function toPercentFraming(
  framing: WindowFraming,
  bounds: WindowSize,
): WindowFraming {
  const width = bounds.width || 1;
  const height = bounds.height || 1;

  return {
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
  framing: WindowFraming,
  bounds: WindowSize,
): WindowFraming {
  return {
    position: {
      x: (framing.position.x / 100) * bounds.width,
      y: (framing.position.y / 100) * bounds.height,
    },
    size: {
      width: (framing.size.width / 100) * bounds.width,
      height: (framing.size.height / 100) * bounds.height,
    },
  };
}

export function clampPercentFraming(
  framing: WindowFraming,
  bounds: WindowSize,
  minSize: WindowSize,
  maxSize?: WindowSize,
): WindowFraming {
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
    position: { x, y },
    size: { width, height },
  };
}
