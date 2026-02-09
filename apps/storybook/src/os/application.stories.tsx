import { ActionLauncher } from "@acme/ui/os/action-launcher";
import {
  type ApplicationDescriptor,
  defineApplication,
  useApplication,
} from "@acme/ui/os/application";
import {
  ApplicationManager,
  useApplicationManager,
} from "@acme/ui/os/application-manager";
import { LauncherIcon, LauncherLabel } from "@acme/ui/os/launcher";
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
import {
  useWindowManager,
  WindowManagerProvider,
} from "@acme/ui/os/window-manager";
import { WindowSnap } from "@acme/ui/os/window-snap";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { PurpleWallpaper } from "../scenes/desktop/purple-wallpaper";

const meta = {
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "OS/Applications",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

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
        <WindowManagerProvider>
          <Shell>
            <PurpleWallpaper className="h-full p-6">
              <WindowSnap>
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
                <Applications />
                <div className="absolute bottom-4 left-1/2 flex h-12 w-[min(760px,92%)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 text-white shadow-xl backdrop-blur-md">
                  <div className="flex flex-1 items-center gap-2">
                    <Taskbar />
                  </div>
                  <div className="text-white/70 text-xs">10:24</div>
                </div>
              </WindowSnap>
            </PurpleWallpaper>
          </Shell>
        </WindowManagerProvider>
      </ApplicationManager>
    );
  },
};

function ApplicationControls() {
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
const AboutContent = React.lazy(() =>
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

const AboutApplication = defineApplication("about-application")({
  component: ({ appId }: { appId: string }) => (
    <Window
      id={appId}
      defaultFraming={{
        position: { x: 12, y: 12 },
        size: { height: 46, width: 45 },
      }}
    >
      <WindowHeader>
        <WindowTitle>About</WindowTitle>
        <ApplicationControls />
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
          <AboutContent />
        </React.Suspense>
      </WindowContent>
    </Window>
  ),
  title: "About",
});

// Pretend code-splitting is happening here
const NotesContent = React.lazy(() =>
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

const NotesApplication = defineApplication("notes-application")({
  component: ({ appId }: { appId: string }) => (
    <Window
      id={appId}
      defaultFraming={{
        position: { x: 42, y: 18 },
        size: { height: 48, width: 42 },
      }}
    >
      <WindowHeader>
        <WindowTitle>Notes</WindowTitle>
        <ApplicationControls />
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
          <NotesContent />
        </React.Suspense>
      </WindowContent>
    </Window>
  ),
  title: "Notes",
});

function LaunchPad() {
  const { listApplications } = useApplicationManager();
  const { getWindowData } = useWindowManager();
  const apps = listApplications();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid w-full max-w-sm auto-cols-[96px] grid-flow-col grid-rows-4 gap-4">
        {apps.map((app) => (
          <ApplicationLauncher
            key={app.id}
            application={app}
            isHidden={Boolean(getWindowData(app.id)?.isHidden)}
          />
        ))}
      </div>
    </div>
  );
}

function Applications() {
  const { running, getApplication } = useApplicationManager();

  return running.map((entry) => {
    const app = getApplication(entry.appId);
    if (!app) return null;
    const AppComponent = app.component;
    return <AppComponent key={entry.appId} appId={entry.appId} />;
  });
}

type ApplicationLauncherProps = {
  application: ApplicationDescriptor;
  isHidden: boolean;
};

function ApplicationLauncher({
  application,
  isHidden,
}: ApplicationLauncherProps) {
  const { activateWindow } = useWindowManager();
  const status = isHidden ? "hidden" : "default";
  const letter = application.title.trim().slice(0, 1) || "?";

  return (
    <ActionLauncher
      application={application}
      status={status}
      className="text-white/90"
      onClick={(event) => {
        if (isHidden) {
          event.preventDefault();
          activateWindow(application.id);
        }
      }}
    >
      <LauncherIcon className="bg-white/10 text-white ring-white/20">
        {letter}
      </LauncherIcon>
      <LauncherLabel className="text-white/90">
        {application.title}
      </LauncherLabel>
    </ActionLauncher>
  );
}

function Taskbar() {
  const { running, getApplication } = useApplicationManager();
  const { getWindowData } = useWindowManager();

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
          />
        );
      })}
    </>
  );
}

type TaskbarItemProps = {
  application: ApplicationDescriptor;
  isHidden: boolean;
};

function TaskbarItem({ application, isHidden }: TaskbarItemProps) {
  const { activateWindow } = useWindowManager();
  const { close, launch } = application.useApplication();

  return (
    <div className="relative flex h-8 items-center gap-1 rounded-xl bg-white/5 px-2 py-1 text-white/90 text-xs">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg bg-white/15 px-2 py-1 font-medium text-white/90 text-xs hover:bg-white/25"
        onClick={() => {
          if (isHidden) {
            activateWindow(application.id);
          } else {
            launch();
          }
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
