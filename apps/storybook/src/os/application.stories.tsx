import {
  type ApplicationDescriptor,
  defineApplication,
  useApplication,
} from "@acme/ui/os/application";
import {
  ApplicationManager,
  useApplicationManager,
} from "@acme/ui/os/application-manager";
import { Shell } from "@acme/ui/os/shell";
import { Window } from "@acme/ui/os/window";
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
import { useWindowManager } from "@acme/ui/os/window-manager";
import { WindowSnap } from "@acme/ui/os/window-snap";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

function AppWindowControls() {
  const { close } = useApplication();

  return (
    <WindowControls>
      <WindowHideButton aria-label="Hide">—</WindowHideButton>
      <WindowFullscreenButton aria-label="Fullscreen">□</WindowFullscreenButton>
      <WindowAction aria-label="Close" onClick={() => close()}>
        ×
      </WindowAction>
    </WindowControls>
  );
}

// Pretend code-splitting is happening here
const AboutAppContent = React.lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="space-y-2 text-sm">
        <p className="font-medium">About Application</p>
        <p className="text-muted-foreground">
          This app renders its own window content.
        </p>
      </div>
    ),
  }),
);

const AboutAppComponent = ({ appId }: { appId: string }) => (
  <Window
    id={appId}
    defaultFraming={{
      position: { x: 12, y: 12 },
      size: { height: 46, width: 45 },
    }}
  >
    <WindowHeader>
      <WindowTitle>About</WindowTitle>
      <AppWindowControls />
    </WindowHeader>
    <WindowContent>
      <React.Suspense
        fallback={
          <div className="space-y-2 text-sm">
            <div className="h-4 w-32 rounded bg-muted/60" />
            <div className="h-3 w-48 rounded bg-muted/50" />
            <div className="h-3 w-40 rounded bg-muted/50" />
          </div>
        }
      >
        <AboutAppContent />
      </React.Suspense>
    </WindowContent>
  </Window>
);

const AboutApplication = defineApplication("about-application")({
  component: AboutAppComponent,
  title: "About",
});

// Pretend code-splitting is happening here
const NotesAppContent = React.lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="space-y-2 text-sm">
        <p className="font-medium">Notes Application</p>
        <p className="text-muted-foreground">
          Another lazy-loaded application window.
        </p>
      </div>
    ),
  }),
);

const NotesAppComponent = ({ appId }: { appId: string }) => (
  <Window
    id={appId}
    defaultFraming={{
      position: { x: 42, y: 18 },
      size: { height: 48, width: 42 },
    }}
  >
    <WindowHeader>
      <WindowTitle>Notes</WindowTitle>
      <AppWindowControls />
    </WindowHeader>
    <WindowContent>
      <React.Suspense
        fallback={
          <div className="space-y-2 text-sm">
            <div className="h-4 w-28 rounded bg-muted/60" />
            <div className="h-3 w-52 rounded bg-muted/50" />
            <div className="h-3 w-44 rounded bg-muted/50" />
          </div>
        }
      >
        <NotesAppContent />
      </React.Suspense>
    </WindowContent>
  </Window>
);

const NotesApplication = defineApplication("notes-application")({
  component: NotesAppComponent,
  title: "Notes",
});

const meta = {
  parameters: {
    layout: "fullscreen",
  },
  title: "OS/Applications",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function LaunchPad() {
  const { listApplications } = useApplicationManager();
  const { showWindow, activateWindow, getWindowData } = useWindowManager();
  const apps = listApplications();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full max-w-sm auto-cols-[96px] grid-flow-col grid-rows-4 gap-4">
        {apps.map((app) => (
          <LaunchIcon
            key={app.id}
            application={app}
            isHidden={Boolean(getWindowData(app.id)?.isHidden)}
            onRestore={() => {
              showWindow(app.id);
              activateWindow(app.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Desktop() {
  const { running, getApplication } = useApplicationManager();

  return (
    <>
      {running.map((entry) => {
        const app = getApplication(entry.appId);
        if (!app) return null;
        const AppComponent = app.component;
        return <AppComponent key={entry.appId} appId={entry.appId} />;
      })}
    </>
  );
}

function Taskbar() {
  const { running, getApplication } = useApplicationManager();
  const { showWindow, activateWindow, getWindowData } = useWindowManager();

  return (
    <>
      {running.map((entry) => {
        const app = getApplication(entry.appId);
        if (!app) return null;
        const windowData = getWindowData(entry.appId);
        const isHidden = windowData?.isHidden ?? false;
        return (
          <TaskbarItem
            key={entry.appId}
            application={app}
            isHidden={isHidden}
            onRestore={() => {
              showWindow(entry.appId);
              activateWindow(entry.appId);
            }}
          />
        );
      })}
    </>
  );
}

type LaunchIconProps = {
  application: ApplicationDescriptor;
  isHidden: boolean;
  onRestore: () => void;
};

function LaunchIcon({ application, isHidden, onRestore }: LaunchIconProps) {
  const { launch } = application.useApplication();

  return (
    <button
      type="button"
      className="group flex flex-col items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-left transition hover:border-white/30 hover:bg-white/10"
      onClick={() => {
        if (isHidden) {
          onRestore();
          return;
        }
        launch();
      }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-white/20 via-white/10 to-white/5 font-semibold text-sm text-white shadow-lg ring-1 ring-white/20">
        {application.title.slice(0, 1)}
      </div>
      <span className="font-medium text-white/90 text-xs">
        {application.title}
      </span>
    </button>
  );
}

type TaskbarItemProps = {
  application: ApplicationDescriptor;
  isHidden: boolean;
  onRestore: () => void;
};

function TaskbarItem({ application, isHidden, onRestore }: TaskbarItemProps) {
  const { close, launch } = application.useApplication();

  return (
    <div className="relative flex h-8 items-center gap-1 rounded-xl bg-white/5 px-2 py-1 text-white/90 text-xs">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-white/15 px-2 py-1 font-medium text-white/90 text-xs hover:bg-white/25"
        onClick={() => {
          if (isHidden) {
            onRestore();
            return;
          }
          launch();
        }}
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/20 font-semibold text-[10px]">
          {application.title.slice(0, 1)}
        </span>
        {application.title}
      </button>
      <button
        type="button"
        className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/80 font-semibold text-[11px] text-slate-900 shadow-sm ring-1 ring-white/60 hover:bg-white"
        onClick={close}
        aria-label={`Close ${application.title}`}
      >
        ×
      </button>
    </div>
  );
}

export const Default: Story = {
  render: () => {
    const [isActivated, setIsActivated] = React.useState(false);

    React.useEffect(() => {
      let buffer = "";
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key.length !== 1) return;
        buffer = `${buffer}${event.key}`.slice(-24);
        const normalized = buffer.toLowerCase();
        if (normalized.includes("doughnut")) {
          setIsActivated(true);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
      <ApplicationManager applications={[AboutApplication, NotesApplication]}>
        <Shell className="relative h-full w-full overflow-hidden bg-linear-to-br from-slate-900 via-indigo-900 to-slate-950 p-6">
          <WindowSnap>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[48px_48px]" />
            <div className="select-none font-semibold text-sm text-white tracking-wide">
              Win-doughs 11
            </div>
            {!isActivated && (
              <div className="pointer-events-none absolute top-4 right-6 select-none text-white/70">
                <div className="font-medium text-[13px]">
                  Activate Win-dough
                </div>
                <div className="text-[11px] text-white/35">
                  Type <code>`doughnut`</code> to activate Win-dough.
                </div>
              </div>
            )}
            <div className="mt-6">
              <LaunchPad />
            </div>
            <Desktop />
            <div className="absolute bottom-4 left-1/2 flex h-12 w-[min(760px,92%)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 text-white shadow-xl backdrop-blur-md">
              <div className="flex flex-1 items-center gap-2">
                <Taskbar />
              </div>
              <div className="text-white/70 text-xs">10:24</div>
            </div>
          </WindowSnap>
        </Shell>
      </ApplicationManager>
    );
  },
};
