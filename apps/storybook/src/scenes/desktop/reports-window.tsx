import { Window, withCenteredFraming } from "@acme/ui/os/window";
import {
  WindowContent,
  WindowHeader,
  WindowTitle,
} from "@acme/ui/os/window-layout";

type ReportsWindowProps = {
  appId: string;
};

function ReportsWindow({ appId }: ReportsWindowProps) {
  return (
    <Window
      id={appId}
      defaultFraming={withCenteredFraming({ height: 80, width: 70 })}
    >
      <WindowHeader>
        <WindowTitle>Reports</WindowTitle>
      </WindowHeader>
      <WindowContent>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Code-split analytics</p>
          <p className="text-muted-foreground">
            This window is lazy-loaded to demonstrate React.lazy integration.
          </p>
          <div className="rounded-lg border border-muted-foreground/30 border-dashed px-3 py-3 text-muted-foreground text-xs">
            Data refresh queued
          </div>
        </div>
      </WindowContent>
    </Window>
  );
}

export default ReportsWindow;
