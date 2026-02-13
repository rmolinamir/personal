import * as React from "react";

type PowerState = "on" | "off";

type SystemContextValue = {
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

  const shutdown = React.useCallback(() => {
    setPower("off");
  }, []);

  const boot = React.useCallback(() => {
    setPower("on");
  }, []);

  const value = React.useMemo(
    () => ({ boot, power, shutdown }),
    [power, shutdown, boot],
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
