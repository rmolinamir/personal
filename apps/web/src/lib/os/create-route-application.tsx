import { useInitialWindowFraming } from "@acme/ui/hooks/use-initial-window-framing";
import { useIsMobile } from "@acme/ui/hooks/use-mobile";
import {
  type ApplicationDefinition,
  defineApplication,
  useApplication,
} from "@acme/ui/os/application";
import { Launcher as LauncherPrimitive } from "@acme/ui/os/launcher";
import { getCascadingWindowFraming, Window } from "@acme/ui/os/window";
import {
  WindowCloseButton,
  WindowControls,
  WindowFullscreenButton,
  WindowHideButton,
} from "@acme/ui/os/window-actions";
import { useWindowBoundary } from "@acme/ui/os/window-boundary";
import {
  WindowContent,
  WindowHeader,
  WindowTitle,
} from "@acme/ui/os/window-layout";
import { useWindowManager } from "@acme/ui/os/window-manager";
import { Link } from "@tanstack/react-router";
import { Maximize, Minimize, Minus, X } from "lucide-react";
import React, { useEffect } from "react";
import type { FileRoutesByTo } from "../../routeTree.gen";

type RouteApplicationDefinition = ApplicationDefinition & {
  launcher: ApplicationDefinition["component"];
};

export function createApplicationRoute(toPath: keyof FileRoutesByTo) {
  const applicationFactory = defineApplication(toPath);

  return ({
    component: ApplicationComponent,
    launcher: LauncherComponent,
    ...applicationFactoryDefinition
  }: RouteApplicationDefinition) => {
    const Application = applicationFactory({
      ...applicationFactoryDefinition,
      component: () => {
        const {
          application: { id, metadata },
        } = useApplication();
        const isMobile = useIsMobile();
        const { size: bounds } = useWindowBoundary();
        const { getTopWindow, toggleFullscreen, getWindowData } =
          useWindowManager();
        const defaultFraming = useInitialWindowFraming(() => {
          if (!bounds) return null;
          return getCascadingWindowFraming({
            bounds,
            size: isMobile
              ? { height: 100, width: 100 }
              : { height: 90, width: 90 },
            topWindowFraming: getTopWindow()?.framing ?? null,
          });
        });

        const { isFullscreen } = getWindowData(id) ?? {};

        useEffect(() => {
          if (isMobile && !isFullscreen) {
            toggleFullscreen(id);
          }
        }, [isMobile, isFullscreen, toggleFullscreen, id]);

        return (
          <Window defaultFraming={defaultFraming ?? undefined}>
            <WindowHeader>
              <WindowTitle>{metadata.title}</WindowTitle>
              <WindowControls>
                <WindowHideButton aria-label="Hide">
                  <Minus className="size-4" />
                </WindowHideButton>
                {!isMobile && (
                  <WindowFullscreenButton aria-label="Fullscreen">
                    {isFullscreen ? (
                      <Minimize className="size-3.5" />
                    ) : (
                      <Maximize className="size-3.5" />
                    )}
                  </WindowFullscreenButton>
                )}
                <WindowCloseButton aria-label="Close">
                  <X className="size-4" />
                </WindowCloseButton>
              </WindowControls>
            </WindowHeader>
            <WindowContent>
              <ApplicationComponent />
            </WindowContent>
          </Window>
        );
      },
    });

    function Launcher() {
      const { launchWindow } = Application.useApplication();

      return (
        <LauncherPrimitive
          onClick={() => {
            launchWindow();
          }}
          asChild
        >
          <Link to={toPath}>
            <LauncherComponent />
          </Link>
        </LauncherPrimitive>
      );
    }

    function Route({ children }: React.PropsWithChildren) {
      const { launchWindow } = Application.useApplication();

      const launch = React.useEffectEvent(() => {
        launchWindow();
      });

      React.useEffect(() => {
        launch();
      }, []);

      return children;
    }

    return {
      Application,
      Launcher,
      Route,
    };
  };
}
