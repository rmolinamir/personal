import * as React from "react";
import { cn } from "../lib/utils";
import type { WindowSize } from "./window-utils";

type ShellContextValue = {
  element: HTMLDivElement | null;
  size: WindowSize | null;
};

const ShellContext = React.createContext<ShellContextValue | null>(null);

export type ShellProps = React.ComponentProps<"div">;

function Shell({ className, children, ref, ...props }: ShellProps) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState<WindowSize | null>(null);

  const handleRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      setElement(node);
      if (!ref) return;
      if (typeof ref === "function") {
        ref(node);
      } else {
        ref.current = node;
      }
    },
    [ref],
  );

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!element) {
      setSize(null);
      return undefined;
    }

    const updateBounds = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (width <= 0 || height <= 0) return;
      setSize({ height, width });
    };

    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(element);

    return () => observer.disconnect();
  }, [element]);

  const value = React.useMemo<ShellContextValue>(
    () => ({ element, size }),
    [element, size],
  );

  return (
    <ShellContext.Provider value={value}>
      <div ref={handleRef} className={cn("relative", className)} {...props}>
        {children}
      </div>
    </ShellContext.Provider>
  );
}

function useShell() {
  const context = React.useContext(ShellContext);
  if (!context) {
    throw new Error("useShell must be used within Shell");
  }
  return context;
}

export { Shell, useShell };
