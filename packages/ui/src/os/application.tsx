import * as React from "react";
import { useApplicationManager } from "./application-manager";

export type ApplicationComponent =
  | React.ComponentType
  | React.LazyExoticComponent<React.ComponentType>;

export type ApplicationDefinition = {
  component: ApplicationComponent;
  title: string;
  fallback?: React.ComponentType;
  icon?: React.ReactNode;
};

export type ApplicationInstance = {
  appId: string;
  title: string;
  icon?: React.ReactNode;
  launch: () => void;
  close: () => void;
};

export type ApplicationDescriptor = ApplicationDefinition & {
  id: string;
  useApplication: () => ApplicationInstance;
};

type ApplicationContextValue = {
  appId: string;
  title: string;
  icon?: React.ReactNode;
};

const ApplicationContext = React.createContext<ApplicationContextValue | null>(
  null,
);

function ApplicationProvider({
  value,
  children,
}: {
  value: ApplicationContextValue;
  children: React.ReactNode;
}) {
  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

function defineApplication(id: string) {
  return function define(
    definition: ApplicationDefinition,
  ): ApplicationDescriptor {
    function useApplication(): Omit<ApplicationInstance, "icon"> {
      const manager = useApplicationManager();
      const launch = React.useCallback(() => manager.launch(id), [manager]);
      const close = React.useCallback(() => manager.close(id), [manager]);

      return {
        appId: id,
        close,
        launch,
        title: definition.title,
      };
    }

    function WrappedComponent() {
      const Component = definition.component;
      const Fallback = definition.fallback;

      return (
        <ApplicationProvider
          value={{ appId: id, icon: definition.icon, title: definition.title }}
        >
          <React.Suspense fallback={Fallback ? <Fallback /> : undefined}>
            <Component />
          </React.Suspense>
        </ApplicationProvider>
      );
    }
    const componentDisplayName =
      "displayName" in definition.component
        ? definition.component.displayName
        : definition.component.name;
    WrappedComponent.displayName = `Wrapped${componentDisplayName}`;

    return {
      id,
      ...definition,
      component: WrappedComponent,
      useApplication,
    };
  };
}

function useApplication(): ApplicationInstance {
  const context = React.useContext(ApplicationContext);
  if (!context) {
    throw new Error("useApplication must be used within an application");
  }
  const manager = useApplicationManager();

  return {
    appId: context.appId,
    close: () => manager.close(context.appId),
    icon: context.icon,
    launch: () => manager.launch(context.appId),
    title: context.title,
  };
}

export { defineApplication, useApplication };
