import type { ApplicationInstance } from "@acme/ui/os/application";
import * as React from "react";

type PowerState = "on" | "off";

type SystemContextValue = {
  loadingApplications: ApplicationInstance[];
  insertLoadingApplication: (application: ApplicationInstance) => void;
  removeLoadingApplication: (application: ApplicationInstance) => void;
  isLoadingApplication: (application: ApplicationInstance) => boolean;
  power: PowerState;
  shutdown: () => void;
  boot: () => void;
};

const SystemContext = React.createContext<SystemContextValue | null>(null);

type SystemProviderProps = {
  children: React.ReactNode;
};

export function SystemProvider({ children }: SystemProviderProps) {
  const [power, setPower] = React.useState<PowerState>("on");
  const [loadingApplications, setLoadingApplications] = React.useState<
    ApplicationInstance[]
  >([]);

  const shutdown = React.useCallback(() => {
    setPower("off");
  }, []);

  const boot = React.useCallback(() => {
    setPower("on");
  }, []);

  const insertLoadingApplication = React.useCallback(
    (application: ApplicationInstance) => {
      setLoadingApplications((prev) => [...prev, application]);
    },
    [],
  );

  const removeLoadingApplication = React.useCallback(
    (application: ApplicationInstance) => {
      setLoadingApplications((prev) =>
        prev.filter((app) => app.id !== application.id),
      );
    },
    [],
  );

  const isLoadingApplication = React.useCallback(
    (application: ApplicationInstance) => {
      return loadingApplications.some((app) => app.id === application.id);
    },
    [loadingApplications],
  );

  const value = React.useMemo(
    () => ({
      boot,
      insertLoadingApplication,
      isLoadingApplication,
      loadingApplications,
      power,
      removeLoadingApplication,
      shutdown,
    }),
    [
      boot,
      power,
      shutdown,
      loadingApplications,
      insertLoadingApplication,
      removeLoadingApplication,
      isLoadingApplication,
    ],
  );

  return (
    <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
  );
}

export function useSystem() {
  const context = React.useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used within a SystemProvider.");
  }
  return context;
}
