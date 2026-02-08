import * as React from "react";
import type { ApplicationDescriptor } from "./application";

type RunningApplication = {
  appId: string;
};

type ApplicationManagerContextValue = {
  registry: Record<string, ApplicationDescriptor>;
  running: RunningApplication[];
  launch: (appId: string) => void;
  close: (appId: string) => void;
};

const ApplicationManagerContext =
  React.createContext<ApplicationManagerContextValue | null>(null);

export type ApplicationManagerProps = {
  applications: ApplicationDescriptor[];
  children: React.ReactNode;
};

function ApplicationManager({ applications, children }: ApplicationManagerProps) {
  const [running, setRunning] = React.useState<RunningApplication[]>([]);
  const registry = React.useMemo(() => {
    const entries = applications.map((app) => [app.id, app] as const);
    return Object.fromEntries(entries) as Record<string, ApplicationDescriptor>;
  }, [applications]);

  const launch = React.useCallback((appId: string) => {
    setRunning((prev) => {
      if (prev.some((app) => app.appId === appId)) {
        return prev;
      }
      return [...prev, { appId }];
    });
  }, []);

  const close = React.useCallback((appId: string) => {
    setRunning((prev) => prev.filter((app) => app.appId !== appId));
  }, []);

  const value = React.useMemo<ApplicationManagerContextValue>(
    () => ({ close, launch, registry, running }),
    [close, launch, registry, running],
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
    throw new Error("useApplicationManager must be used within ApplicationManager");
  }

  const getApplication = React.useCallback(
    (id: string) => context.registry[id],
    [context.registry],
  );

  const listApplications = React.useCallback(
    () => Object.values(context.registry),
    [context.registry],
  );

  return {
    close: context.close,
    getApplication,
    launch: context.launch,
    listApplications,
    running: context.running,
  };
}

export { ApplicationManager, useApplicationManager };
