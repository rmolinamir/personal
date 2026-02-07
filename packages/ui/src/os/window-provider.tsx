import * as React from "react";
import type { WindowFraming } from "./window-utils";

export type ActiveWindow = {
  id: string;
  zIndex: number;
};

export type WindowProviderState = {
  stack: ActiveWindow[];
  windows: Record<string, WindowData>;
  focusedId?: string;
};

type WindowData = {
  framing?: WindowFraming;
  isMaximized?: boolean;
  previousFraming?: WindowFraming | null;
};

export type WindowContextValue = {
  stack: ActiveWindow[];
  windows: Record<string, WindowData>;
  focusedId?: string;
  mountWindow: (id: string) => void;
  unmountWindow: (id: string) => void;
  activateWindow: (id: string) => void;
  getWindow: (id: string) => ActiveWindow | undefined;
  getFraming: (id: string) => WindowFraming | undefined;
  setFraming: (id: string, framing: WindowFraming) => void;
  toggleMaximize: (id: string) => void;
  getIsMaximized: (id: string) => boolean;
};

const WindowContext = React.createContext<WindowContextValue | null>(null);

function findTopWindow(windows: ActiveWindow[]) {
  let top: ActiveWindow | null = null;

  for (const window of windows) {
    if (!top || window.zIndex > top.zIndex) {
      top = window;
    }
  }

  return top;
}

export type WindowManagerProviderProps = {
  children: React.ReactNode;
};

const WindowProvider = ({ children }: WindowManagerProviderProps) => {
  const [state, setState] = React.useState<WindowProviderState>(() => ({
    focusedId: undefined,
    stack: [],
    windows: {},
  }));

  const mountWindow = React.useCallback((id: string) => {
    setState((prev) => {
      // If the window is already mounted, do nothing
      if (prev.stack.some((window) => window.id === id)) {
        return prev;
      }

      const entry: ActiveWindow = { id, zIndex: prev.stack.length + 1 };

      return {
        ...prev,
        focusedId: id,
        stack: [...prev.stack, entry],
      };
    });
  }, []);

  const unmountWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const stack = prev.stack.filter((window) => window.id !== id);
      const { [id]: _removedWindow, ...windows } = prev.windows;

      if (prev.focusedId !== id) {
        return { ...prev, stack: stack, windows: windows };
      }

      // If the window being unmounted is the focused window, also focus the next window
      const nextFocused = findTopWindow(stack);
      const nextFocusedId = nextFocused?.id;
      return {
        ...prev,
        focusedId: nextFocusedId,
        stack: stack,
        windows: windows,
      };
    });
  }, []);

  const activateWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const hasWindow = prev.stack.some((window) => window.id === id);
      if (!hasWindow) {
        return prev;
      }

      const activeWindow = prev.stack.find((window) => window.id === id);
      if (!activeWindow) return prev;

      // Recalculating the z-index values based on the new order
      const reordered = prev.stack.filter((window) => window.id !== id);
      const windows = [...reordered, activeWindow].map((window, index) => ({
        ...window,
        zIndex: index + 1,
      }));

      return {
        ...prev,
        focusedId: id,
        stack: windows,
      };
    });
  }, []);

  const getWindow = React.useCallback(
    (id: string) => state.stack.find((window) => window.id === id),
    [state.stack],
  );

  const getFraming = React.useCallback(
    (id: string) => state.windows[id]?.framing,
    [state.windows],
  );

  const setFraming = React.useCallback((id: string, framing: WindowFraming) => {
    setState((prev) => ({
      ...prev,
      windows: {
        ...prev.windows,
        [id]: {
          ...prev.windows[id],
          framing,
        },
      },
    }));
  }, []);

  const getIsMaximized = React.useCallback(
    (id: string) => Boolean(state.windows[id]?.isMaximized),
    [state.windows],
  );

  const toggleMaximize = React.useCallback((id: string) => {
    setState((prev) => {
      const windowData = prev.windows[id];
      if (!windowData?.framing) return prev;

      if (windowData.isMaximized) {
        const restoredFraming =
          windowData.previousFraming ?? windowData.framing;
        return {
          ...prev,
          windows: {
            ...prev.windows,
            [id]: {
              ...windowData,
              framing: restoredFraming,
              isMaximized: false,
              previousFraming: null,
            },
          },
        };
      }

      return {
        ...prev,
        windows: {
          ...prev.windows,
          [id]: {
            ...windowData,
            framing: {
              position: { x: 0, y: 0 },
              size: { height: 100, width: 100 },
            },
            isMaximized: true,
            previousFraming: windowData.framing,
          },
        },
      };
    });
  }, []);

  const value = React.useMemo<WindowContextValue>(
    () => ({
      activateWindow,
      focusedId: state.focusedId,
      getFraming: getFraming,
      getIsMaximized,
      getWindow,
      mountWindow,
      setFraming: setFraming,
      stack: state.stack,
      toggleMaximize,
      unmountWindow,
      windows: state.windows,
    }),
    [
      activateWindow,
      getIsMaximized,
      getFraming,
      getWindow,
      state.windows,
      mountWindow,
      setFraming,
      state.focusedId,
      state.stack,
      toggleMaximize,
      unmountWindow,
    ],
  );

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
};

function useWindowContext() {
  return React.useContext(WindowContext);
}

function useWindows() {
  const context = useWindowContext();
  if (!context) {
    throw new Error("useWindows must be used within WindowProvider");
  }
  return context;
}

export type WindowState = {
  isActive: boolean;
  isMaximized: boolean;
  zIndex: number;
  activate: () => void;
  framing?: WindowFraming;
  setFraming: (framing: WindowFraming) => void;
  toggleMaximize: () => void;
};

function useWindowState(id: string): WindowState {
  const manager = useWindows();

  const mountWindow = React.useEffectEvent((windowId: string) => {
    manager.mountWindow(windowId);
  });
  const unmountWindow = React.useEffectEvent((windowId: string) => {
    manager.unmountWindow(windowId);
  });
  const activateWindow = React.useEffectEvent((windowId: string) => {
    manager.activateWindow(windowId);
  });

  React.useEffect(() => {
    mountWindow(id);
    return () => unmountWindow(id);
  }, [id]);

  const activeWindow = manager.getWindow(id);

  return {
    activate: () => activateWindow(id),
    framing: manager.getFraming(id),
    isActive: manager.focusedId === id,
    isMaximized: manager.getIsMaximized(id),
    setFraming: (framing) => manager.setFraming(id, framing),
    toggleMaximize: () => manager.toggleMaximize(id),
    zIndex: activeWindow?.zIndex ?? 1,
  };
}

export { WindowProvider, useWindowState, useWindowContext, useWindows };
