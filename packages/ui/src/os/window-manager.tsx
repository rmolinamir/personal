import * as React from "react";

export type WindowEntry = {
  id: string;
  zIndex: number;
  focused: boolean;
};

export type WindowRegistrationOptions = {
  autoFocus?: boolean;
  zIndex?: number;
};

export type WindowManagerState = {
  windows: WindowEntry[];
  focusedId?: string;
  zIndexCounter: number;
};

export type WindowManagerContextValue = {
  windows: WindowEntry[];
  focusedId?: string;
  registerWindow: (id: string, options?: WindowRegistrationOptions) => void;
  unregisterWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  getWindow: (id: string) => WindowEntry | undefined;
  getWindowProps: (id: string) => {
    focused: boolean;
    zIndex: number;
    onFocus: () => void;
  };
};

const WindowManagerContext = React.createContext<WindowManagerContextValue | null>(
  null,
);

export type WindowManagerProviderProps = {
  children: React.ReactNode;
  initialZIndex?: number;
};

const defaultState: WindowManagerState = {
  windows: [],
  focusedId: undefined,
  zIndexCounter: 10,
};

function getNextZIndex(current: number) {
  return current + 1;
}

function findTopWindow(windows: WindowEntry[]) {
  return windows.reduce<WindowEntry | null>((top, window) => {
    if (!top || window.zIndex > top.zIndex) return window;
    return top;
  }, null);
}

const WindowManagerProvider = ({
  children,
  initialZIndex,
}: WindowManagerProviderProps) => {
  const [state, setState] = React.useState<WindowManagerState>(() => ({
    ...defaultState,
    zIndexCounter: initialZIndex ?? defaultState.zIndexCounter,
  }));

  const registerWindow = React.useCallback(
    (id: string, options?: WindowRegistrationOptions) => {
      setState((prev) => {
        if (prev.windows.some((window) => window.id === id)) {
          return prev;
        }

        const shouldFocus = Boolean(options?.autoFocus);
        const nextZIndex =
          options?.zIndex ?? getNextZIndex(prev.zIndexCounter);

        const windows = shouldFocus
          ? prev.windows.map((window) => ({ ...window, focused: false }))
          : prev.windows;

        const entry: WindowEntry = {
          id,
          zIndex: nextZIndex,
          focused: shouldFocus,
        };

        return {
          windows: [...windows, entry],
          focusedId: shouldFocus ? id : prev.focusedId,
          zIndexCounter: Math.max(prev.zIndexCounter, nextZIndex),
        };
      });
    },
    [],
  );

  const unregisterWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const windows = prev.windows.filter((window) => window.id !== id);
      if (prev.focusedId !== id) {
        return { ...prev, windows };
      }

      const nextFocused = findTopWindow(windows);
      const nextFocusedId = nextFocused?.id;
      const updatedWindows = windows.map((window) => ({
        ...window,
        focused: window.id === nextFocusedId,
      }));

      return {
        ...prev,
        windows: updatedWindows,
        focusedId: nextFocusedId,
      };
    });
  }, []);

  const focusWindow = React.useCallback((id: string) => {
    setState((prev) => {
      const nextZIndex = getNextZIndex(prev.zIndexCounter);
      const hasWindow = prev.windows.some((window) => window.id === id);

      const windows = hasWindow
        ? prev.windows.map((window) =>
            window.id === id
              ? { ...window, focused: true, zIndex: nextZIndex }
              : { ...window, focused: false },
          )
        : [
            ...prev.windows.map((window) => ({
              ...window,
              focused: false,
            })),
            { id, focused: true, zIndex: nextZIndex },
          ];

      return {
        ...prev,
        windows,
        focusedId: id,
        zIndexCounter: nextZIndex,
      };
    });
  }, []);

  const getWindow = React.useCallback(
    (id: string) => state.windows.find((window) => window.id === id),
    [state.windows],
  );

  const getWindowProps = React.useCallback(
    (id: string) => {
      const windowEntry = state.windows.find((window) => window.id === id);
      return {
        focused: windowEntry?.focused ?? false,
        zIndex: windowEntry?.zIndex ?? state.zIndexCounter,
        onFocus: () => focusWindow(id),
      };
    },
    [focusWindow, state.windows, state.zIndexCounter],
  );

  const value = React.useMemo<WindowManagerContextValue>(
    () => ({
      windows: state.windows,
      focusedId: state.focusedId,
      registerWindow,
      unregisterWindow,
      focusWindow,
      getWindow,
      getWindowProps,
    }),
    [
      focusWindow,
      getWindow,
      getWindowProps,
      registerWindow,
      state.focusedId,
      state.windows,
      unregisterWindow,
    ],
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
};

function useWindowManager() {
  const context = React.useContext(WindowManagerContext);
  if (!context) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }
  return context;
}

export type UseManagedWindowOptions = WindowRegistrationOptions;

function useManagedWindow(id: string, options?: UseManagedWindowOptions) {
  const manager = useWindowManager();
  const autoFocus = options?.autoFocus;
  const zIndex = options?.zIndex;

  React.useEffect(() => {
    manager.registerWindow(id, { autoFocus, zIndex });
    return () => manager.unregisterWindow(id);
  }, [autoFocus, id, manager, zIndex]);

  return manager.getWindowProps(id);
}

export { WindowManagerProvider, useWindowManager, useManagedWindow };
