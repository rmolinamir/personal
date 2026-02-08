import * as React from "react";
import type { ApplicationDescriptor } from "./application";
import { Launcher, type LauncherProps } from "./launcher";

export type ActionLauncherProps = Omit<LauncherProps, "onClick"> & {
  application: ApplicationDescriptor;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function ActionLauncher({ application, onClick, ...props }: ActionLauncherProps) {
  const { launch } = application.useApplication();

  const handleClick = React.useCallback<
    React.MouseEventHandler<HTMLButtonElement>
  >(
    (event) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        launch();
      }
    },
    [launch, onClick],
  );

  return <Launcher {...props} onClick={handleClick} />;
}

export { ActionLauncher };
