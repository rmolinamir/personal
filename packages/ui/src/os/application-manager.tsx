import * as React from "react";
import type { ApplicationInstance } from "./application";

type ApplicationManagerContextValue = {
  close: (application: ApplicationInstance) => void;
  closeAll: () => void;
  isRunning: (application: ApplicationInstance) => boolean;
  launch: (application: ApplicationInstance) => void;
  runningApplications: ApplicationInstance[];
};

const ApplicationManagerContext =
  React.createContext<ApplicationManagerContextValue | null>(null);

type ApplicationManagerProps = {
  children: React.ReactNode;
};

function ApplicationManagerProvider({ children }: ApplicationManagerProps) {
  const [runningApplications, setApplications] = React.useState<
    ApplicationInstance[]
  >([]);

  const close = React.useCallback((application: ApplicationInstance) => {
    setApplications((prev) => prev.filter((app) => app !== application));
  }, []);

  const closeAll = React.useCallback(() => {
    setApplications([]);
  }, []);

  const isRunning = React.useCallback(
    (application: ApplicationInstance) => {
      return runningApplications.includes(application);
    },
    [runningApplications],
  );

  const launch = React.useCallback((application: ApplicationInstance) => {
    setApplications((prev) => {
      if (prev.includes(application)) {
        return prev;
      }
      return [...prev, application];
    });
  }, []);

  const value = React.useMemo<ApplicationManagerContextValue>(
    () => ({
      close,
      closeAll,
      isRunning,
      launch,
      runningApplications,
    }),
    [close, closeAll, launch, isRunning, runningApplications],
  );

  return (
    <ApplicationManagerContext.Provider value={value}>
      {children}
    </ApplicationManagerContext.Provider>
  );
}

function useApplicationManager() {
  const context = React.useContext(ApplicationManagerContext);
  if (!context) {
    throw new Error(
      "useApplicationManager must be used within ApplicationManagerProvider",
    );
  }
  return context;
}

export { ApplicationManagerProvider, useApplicationManager };
