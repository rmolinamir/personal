import { defineApplication, useApplication } from "@acme/ui/os/application";
import { useApplicationManager } from "@acme/ui/os/application-manager";
import { Window, withCenteredFraming } from "@acme/ui/os/window";
import {
  WindowAction,
  WindowControls,
  WindowFullscreenButton,
  WindowHideButton,
} from "@acme/ui/os/window-actions";
import {
  WindowContent,
  WindowHeader,
  WindowTitle,
} from "@acme/ui/os/window-layout";
import { Minus, Square, X } from "lucide-react";
import * as React from "react";

const MailApplication = defineApplication("mail")({
  component: ({ appId }: { appId: string }) => (
    <ApplicationWindow appId={appId} title="Mail">
      <div className="space-y-3 text-sm">
        <p className="font-medium">Inbox zero-ish</p>
        <p className="text-muted-foreground">
          Your daily digest is waiting. Tap a message to open it in a new
          window.
        </p>
        <div className="rounded-lg border border-muted-foreground/30 border-dashed px-3 py-3 text-muted-foreground text-xs">
          12 new messages
        </div>
      </div>
    </ApplicationWindow>
  ),
  title: "Mail",
});

const NotesApplication = defineApplication("notes")({
  component: ({ appId }: { appId: string }) => (
    <ApplicationWindow appId={appId} title="Notes">
      <div className="space-y-2 text-sm">
        <p className="font-medium">Ideas in progress</p>
        <p className="text-muted-foreground">
          Three drafts synced from mobile.
        </p>
        <ul className="space-y-1 text-muted-foreground text-xs">
          <li>- Dock animations</li>
          <li>- Sidebar routing</li>
          <li>- Menu polish</li>
        </ul>
      </div>
    </ApplicationWindow>
  ),
  title: "Notes",
});

const InsightsApplication = defineApplication("insights")({
  component: ({ appId }: { appId: string }) => (
    <ApplicationWindow appId={appId} title="Insights">
      <div className="space-y-2 text-sm">
        <p className="font-medium">Pulse check</p>
        <p className="text-muted-foreground">
          Conversion rates are up 8% week over week.
        </p>
        <div className="rounded-lg bg-muted/40 px-3 py-2 text-muted-foreground text-xs">
          3 active experiments - 1 needs review
        </div>
      </div>
    </ApplicationWindow>
  ),
  title: "Insights",
});

type ApplicationWindowProps = {
  appId: string;
  title: string;
  children: React.ReactNode;
};

function ApplicationWindow({ appId, title, children }: ApplicationWindowProps) {
  const { close } = useApplication();

  return (
    <Window
      id={appId}
      defaultFraming={withCenteredFraming({
        height: 90,
        width: 90,
      })}
    >
      <WindowHeader>
        <WindowTitle>{title}</WindowTitle>
        <WindowControls>
          <WindowHideButton aria-label="Hide" className="text-slate-500">
            <Minus className="size-4" />
          </WindowHideButton>
          <WindowFullscreenButton
            aria-label="Fullscreen"
            className="text-slate-500"
          >
            <Square className="size-3.5" />
          </WindowFullscreenButton>
          <WindowAction
            aria-label="Close"
            className="text-slate-500"
            onClick={close}
          >
            <X className="size-4" />
          </WindowAction>
        </WindowControls>
      </WindowHeader>
      <WindowContent>{children}</WindowContent>
    </Window>
  );
}

function Applications() {
  const { running, getApplication } = useApplicationManager();

  return running.map((entry) => {
    const app = getApplication(entry.appId);
    if (!app) return null;
    const Component = app.component;
    return <Component key={entry.appId} appId={entry.appId} />;
  });
}

function DockStartupApps({ ids }: { ids: string[] }) {
  const { launch } = useApplicationManager();

  React.useEffect(() => {
    for (const id of ids) {
      launch(id);
    }
  }, [ids, launch]);

  return null;
}

export {
  Applications,
  DockStartupApps,
  MailApplication,
  NotesApplication,
  InsightsApplication,
};
