import * as React from "react";
import type { WindowPercentFraming } from "./window-utils";

export type WindowInstance = {
  id: string;
  zIndex: number;
  framing?: WindowPercentFraming;
  isFullscreen?: boolean;
  isHidden?: boolean;
  previousFraming?: WindowPercentFraming | null;
};

export type WindowManagerState = {
  windows: WindowInstance[];
  map: Record<string, WindowInstance>;
  focusedId?: string;
};

export type WindowManagerContextValue = {
  windows: WindowInstance[];
  focusedId?: string;
  mountWindow: (id: string) => void;
  unmountWindow: (id: string) => void;
  activateWindow: (id: string) => void;
  hideWindow: (id: string) => void;
  showWindow: (id: string) => void;
  getWindow: (id: string) => WindowInstance | undefined;
  getWindowData: (id: string) => WindowInstance | undefined;
  getFraming: (id: string) => WindowPercentFraming | undefined;
  setFraming: (id: string, framing: WindowPercentFraming) => void;
  toggleFullscreen: (id: string) => void;
  getIsFullscreen: (id: string) => boolean;
  getIsHidden: (id: string) => boolean;
};

const WindowManagerContext = React.createContext<
  WindowManagerContextValue | null
>(null);

function findTopWindow(
  windows: WindowInstance[],
  map: Record<string, WindowInstance>,
) {
  let top: WindowInstance | null = null;

  for (const window of windows) {
    if (map[window.id]?.isHidden) continue;
    if (!top || window.zIndex > top.zIndex) {
      top = window;
    }
  }

  return top;
}

export type WindowManagerProps = {
  children: React.ReactNode;
};

function WindowManager({ children }: WindowManagerProps) {
  const [state, setState] = React.useState<WindowManagerState>(() => ({
    focusedId: undefined,
    map: {},
    windows: [],
  }));

  const mountWindow = React.useCallback((id: string) => {
    setState((prev) => {
      // If the window is already mounted, do nothing
      if (prev.windows.some((window) => window.id === id)) {
        return prev;
      }

      const entry: WindowInstance = {
        id,
        zIndex: prev.windows.length + 1,
      };

      return {
        ...prev,
        focusedId: id,
        map: {
          ...prev.map,
          [id]: entry,
        },
        windows: [...prev.windows, entry],
      };
    });
  }, []);

  const unmountWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const windows = prev.windows.filter((window) => window.id !== id);
      const { [id]: _removedWindow, ...map } = prev.map;

      if (prev.focusedId !== id) {
        return { ...prev, map, windows };
      }

      // If the window being unmounted is the focused window, also focus the next window
      const nextFocused = findTopWindow(windows, map);
      const nextFocusedId = nextFocused?.id;
      return {
        ...prev,
        focusedId: nextFocusedId,
        map,
        windows,
      };
    });
  }, []);

  const activateWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const hasWindow = prev.windows.some((window) => window.id === id);
      if (!hasWindow) {
        return prev;
      }

      const activeWindow = prev.windows.find((window) => window.id === id);
      if (!activeWindow) return prev;

      // Recalculating the z-index values based on the new order
      const reordered = prev.windows.filter((window) => window.id !== id);
      const windows = [...reordered, activeWindow].map((window, index) => ({
        ...window,
        zIndex: index + 1,
      }));

      const nextMap = { ...prev.map };
      for (const window of windows) {
        nextMap[window.id] = {
          ...(nextMap[window.id] ?? window),
          ...window,
        };
      }
      nextMap[id] = {
        ...(nextMap[id] ?? activeWindow),
        isHidden: false,
      };

      return {
        ...prev,
        focusedId: id,
        map: nextMap,
        windows,
      };
    });
  }, []);

  const hideWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const windowData = prev.map[id];
      const nextMap = {
        ...prev.map,
        [id]: {
          ...(windowData ?? { id, zIndex: prev.windows.length + 1 }),
          isHidden: true,
        },
      };
      const nextFocusedId =
        prev.focusedId === id
          ? findTopWindow(prev.windows, nextMap)?.id
          : prev.focusedId;

      return {
        ...prev,
        focusedId: nextFocusedId,
        map: nextMap,
      };
    });
  }, []);

  const showWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const windowData = prev.map[id];
      if (!windowData) return prev;

      return {
        ...prev,
        map: {
          ...prev.map,
          [id]: {
            ...windowData,
            isHidden: false,
          },
        },
      };
    });
  }, []);

  const getWindow = React.useCallback(
    (id: string) => state.windows.find((window) => window.id === id),
    [state.windows],
  );

  const getWindowData = React.useCallback(
    (id: string) => state.map[id],
    [state.map],
  );

  const getFraming = React.useCallback(
    (id: string) => state.map[id]?.framing,
    [state.map],
  );

  const setFraming = React.useCallback(
    (id: string, framing: WindowPercentFraming) => {
      setState((prev) => ({
        ...prev,
        map: {
          ...prev.map,
          [id]: {
            ...(prev.map[id] ?? { id, zIndex: prev.windows.length + 1 }),
            framing,
          },
        },
      }));
    },
    [],
  );

  const getIsFullscreen = React.useCallback(
    (id: string) => Boolean(state.map[id]?.isFullscreen),
    [state.map],
  );

  const getIsHidden = React.useCallback(
    (id: string) => Boolean(state.map[id]?.isHidden),
    [state.map],
  );

  const toggleFullscreen = React.useCallback((id: string) => {
    setState((prev) => {
      const windowData = prev.map[id];
      if (!windowData?.framing) return prev;

      if (windowData.isFullscreen) {
        const restoredFraming =
          windowData.previousFraming ?? windowData.framing;
        return {
          ...prev,
          map: {
            ...prev.map,
            [id]: {
              ...windowData,
              framing: restoredFraming,
              isFullscreen: false,
              previousFraming: null,
            },
          },
        };
      }

      return {
        ...prev,
        map: {
          ...prev.map,
          [id]: {
            ...windowData,
            framing: {
              position: { x: 0, y: 0 },
              size: { height: 100, width: 100 },
              unit: "percent",
            },
            isFullscreen: true,
            previousFraming: windowData.framing,
          },
        },
      };
    });
  }, []);

  const value = React.useMemo<WindowManagerContextValue>(
    () => ({
      activateWindow,
      focusedId: state.focusedId,
      getFraming: getFraming,
      getIsFullscreen,
      getIsHidden,
      getWindow,
      getWindowData,
      hideWindow,
      mountWindow,
      setFraming: setFraming,
      showWindow,
      toggleFullscreen,
      unmountWindow,
      windows: state.windows,
    }),
    [
      activateWindow,
      getIsFullscreen,
      getIsHidden,
      getFraming,
      getWindow,
      getWindowData,
      hideWindow,
      mountWindow,
      showWindow,
      setFraming,
      state.focusedId,
      state.windows,
      toggleFullscreen,
      unmountWindow,
    ],
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

function useWindowManager() {
  const context = React.useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within WindowManager");
  }
  return context;
}

export type WindowState = {
  isActive: boolean;
  isFullscreen: boolean;
  isHidden: boolean;
  zIndex: number;
  activate: () => void;
  framing?: WindowPercentFraming;
  setFraming: (framing: WindowPercentFraming) => void;
  hide: () => void;
  show: () => void;
  toggleHidden: () => void;
  toggleFullscreen: () => void;
};

function useWindowManagerState(id: string): WindowState {
  const manager = useWindowManager();

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
    hide: () => manager.hideWindow(id),
    isActive: manager.focusedId === id,
    isFullscreen: manager.getIsFullscreen(id),
    isHidden: manager.getIsHidden(id),
    setFraming: (framing) => manager.setFraming(id, framing),
    show: () => {
      manager.showWindow(id);
      manager.activateWindow(id);
    },
    toggleFullscreen: () => manager.toggleFullscreen(id),
    toggleHidden: () => {
      if (manager.getIsHidden(id)) {
        manager.showWindow(id);
        manager.activateWindow(id);
        return;
      }
      manager.hideWindow(id);
    },
    zIndex: activeWindow?.zIndex ?? 1,
  };
}

export { WindowManager, useWindowManagerState, useWindowManager };
