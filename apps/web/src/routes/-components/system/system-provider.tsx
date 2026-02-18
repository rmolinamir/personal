import type { ApplicationInstance } from "@acme/ui/os/application";
import * as React from "react";

type PowerState = "on" | "off";

type SystemContextValue = {
  loadingApplications: ReadonlyArray<ApplicationInstance>;
  insertLoadingApplication: (application: ApplicationInstance) => void;
  removeLoadingApplication: (application: ApplicationInstance) => void;
  isLoadingApplication: (application: ApplicationInstance) => boolean;
  viewportAspect: number;
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
  const [viewportAspect, setViewportAspect] = React.useState(16 / 9);
  const [loadingApplications, setLoadingApplications] = React.useState<
    Set<ApplicationInstance>
  >(new Set());

  const shutdown = React.useCallback(() => {
    setPower("off");
  }, []);

  const boot = React.useCallback(() => {
    setPower("on");
  }, []);

  const insertLoadingApplication = React.useCallback(
    (application: ApplicationInstance) => {
      setLoadingApplications((prev) => new Set(prev).add(application));
    },
    [],
  );

  const removeLoadingApplication = React.useCallback(
    (application: ApplicationInstance) => {
      setLoadingApplications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(application);
        return newSet;
      });
    },
    [],
  );

  const isLoadingApplication = React.useCallback(
    (application: ApplicationInstance) => {
      return loadingApplications.has(application);
    },
    [loadingApplications],
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    function handleResize() {
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const aspect = height > 0 ? width / height : 16 / 9;
      setViewportAspect(aspect);
    }

    handleResize();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      viewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const value = React.useMemo(
    () => ({
      boot,
      insertLoadingApplication,
      isLoadingApplication,
      loadingApplications: Array.from(loadingApplications),
      power,
      removeLoadingApplication,
      shutdown,
      viewportAspect,
    }),
    [
      boot,
      power,
      shutdown,
      loadingApplications,
      insertLoadingApplication,
      removeLoadingApplication,
      isLoadingApplication,
      viewportAspect,
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
