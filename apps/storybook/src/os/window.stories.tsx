import { Shell } from "@acme/ui/os/shell";
import { Window } from "@acme/ui/os/window";
import {
  WindowControls,
  WindowFullscreenButton,
  WindowHideButton,
} from "@acme/ui/os/window-actions";
import {
  WindowCaption,
  WindowContent,
  WindowFooter,
  WindowHeader,
  WindowTitle,
} from "@acme/ui/os/window-layout";
import { WindowManagerProvider } from "@acme/ui/os/window-manager";
import { WindowSnap } from "@acme/ui/os/window-snap";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FloatingHiddenWindows } from "../scenes/taskbar/floating-hidden-windows";

const meta = {
  component: Window,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "OS/Window",
} satisfies Meta<typeof Window>;

export default meta;

type Story = StoryObj<typeof meta>;

function WindowControlsHeader() {
  return (
    <WindowHeader>
      <div className="space-y-0.5">
        <WindowTitle>Window Controls</WindowTitle>
        <WindowCaption>
          Click on the controls to interact with the window.
        </WindowCaption>
      </div>
      <WindowControls>
        <WindowHideButton aria-label="Hide">—</WindowHideButton>
        <WindowFullscreenButton aria-label="Fullscreen">
          □
        </WindowFullscreenButton>
      </WindowControls>
    </WindowHeader>
  );
}

export const Default: Story = {
  render: () => (
    <WindowManagerProvider>
      <Shell className="relative h-160 w-full overflow-hidden bg-muted/30 p-6">
        <Window>
          <WindowHeader>
            <WindowTitle>About</WindowTitle>
          </WindowHeader>
          <WindowContent>
            <div className="space-y-3 text-sm">
              <p className="font-medium">Robert Molina</p>
              <p>
                Staff Software Engineer focused on building high-scale web
                experiences with modern React and Next.js.
              </p>
              <p className="text-muted-foreground">
                Drag the window by its header, resize from the edges, and
                customize content as needed.
              </p>
            </div>
          </WindowContent>
        </Window>
      </Shell>
    </WindowManagerProvider>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <WindowManagerProvider>
      <Shell className="relative h-160 w-full overflow-hidden bg-muted/30 p-6">
        <Window>
          <WindowHeader>
            <div className="space-y-0.5">
              <WindowTitle>Explorer</WindowTitle>
              <WindowCaption>~/Projects/website</WindowCaption>
            </div>
          </WindowHeader>
          <WindowContent>
            <div className="grid gap-3 text-sm">
              <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
                Folder view content goes here.
              </div>
              <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
                You can reuse this for file previews or lists.
              </div>
            </div>
          </WindowContent>
          <WindowFooter className="text-muted-foreground text-xs">
            12 items · 3.4 MB
          </WindowFooter>
        </Window>
      </Shell>
    </WindowManagerProvider>
  ),
};

export const MultiWindow: Story = {
  render: () => (
    <WindowManagerProvider>
      <Shell className="relative h-160 w-full overflow-hidden bg-muted/30 p-6">
        <Window
          defaultFraming={{
            position: { x: 8, y: 8 },
            size: { height: 50, width: 50 },
          }}
        >
          <WindowHeader>
            <WindowTitle>About</WindowTitle>
          </WindowHeader>
          <WindowContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Robert Molina</p>
              <p className="text-muted-foreground">
                Focus a window by clicking its header.
              </p>
            </div>
          </WindowContent>
        </Window>

        <Window
          defaultFraming={{
            position: { x: 28, y: 18 },
            size: { height: 50, width: 50 },
          }}
        >
          <WindowHeader>
            <div className="space-y-0.5">
              <WindowTitle>Explorer</WindowTitle>
              <WindowCaption>~/Projects/website</WindowCaption>
            </div>
          </WindowHeader>
          <WindowContent>
            <div className="grid gap-3 text-sm">
              <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
                This window is focused when it sits on top.
              </div>
              <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
                Drag each window independently.
              </div>
            </div>
          </WindowContent>
          <WindowFooter className="text-muted-foreground text-xs">
            12 items · 3.4 MB
          </WindowFooter>
        </Window>
      </Shell>
    </WindowManagerProvider>
  ),
};

export const ConstrainedBounds: Story = {
  render: () => (
    <WindowManagerProvider>
      <Shell className="relative h-180 w-full overflow-hidden bg-muted/30">
        <div className="flex h-14 items-center justify-between border-b bg-background/80 px-4 text-muted-foreground text-sm">
          <span>Top Bar</span>
          <span>Dock Area</span>
        </div>
        <div className="relative h-[calc(100%-3.5rem)] p-6">
          <Window>
            <WindowHeader>
              <WindowTitle>Constrained Window</WindowTitle>
            </WindowHeader>
            <WindowContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Bounds: parent container</p>
                <p className="text-muted-foreground">
                  Try dragging and resizing — the window stays inside the
                  workspace area below the top bar.
                </p>
              </div>
            </WindowContent>
          </Window>
        </div>
      </Shell>
    </WindowManagerProvider>
  ),
};

export const WithSnapping: Story = {
  render: () => (
    <WindowManagerProvider>
      <Shell className="relative h-180 w-full overflow-hidden bg-muted/30 p-6">
        <WindowSnap>
          <Window
            defaultFraming={{
              position: { x: 8, y: 8 },
              size: { height: 50, width: 50 },
            }}
          >
            <WindowHeader>
              <WindowTitle>About</WindowTitle>
            </WindowHeader>
            <WindowContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Snap Assist</p>
                <p className="text-muted-foreground">
                  Drag a window to the left or right edge to preview snapping.
                </p>
              </div>
            </WindowContent>
          </Window>

          <Window
            defaultFraming={{
              position: { x: 30, y: 16 },
              size: { height: 50, width: 50 },
            }}
          >
            <WindowHeader>
              <WindowTitle>Explorer</WindowTitle>
            </WindowHeader>
            <WindowContent>
              <div className="grid gap-3 text-sm">
                <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
                  Snap to the right half.
                </div>
                <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
                  Overlay appears on hover.
                </div>
              </div>
            </WindowContent>
            <WindowFooter className="text-muted-foreground text-xs">
              Drag to edges
            </WindowFooter>
          </Window>
        </WindowSnap>
      </Shell>
    </WindowManagerProvider>
  ),
};

export const WithControls: Story = {
  render: () => (
    <WindowManagerProvider>
      <Shell className="relative h-180 w-full overflow-hidden bg-muted/30 p-6">
        <FloatingHiddenWindows />
        <Window
          defaultFraming={{
            position: { x: 10, y: 12 },
            size: { height: 45, width: 40 },
          }}
        >
          <WindowControlsHeader />
          <WindowContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Double-click the header.</p>
              <p className="text-muted-foreground">
                Use the hide button to move it to the dock.
              </p>
            </div>
          </WindowContent>
        </Window>
        <Window
          defaultFraming={{
            position: { x: 58, y: 30 },
            size: { height: 42, width: 38 },
          }}
        >
          <WindowControlsHeader />
          <WindowContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Third window</p>
              <p className="text-muted-foreground">
                Dock entries restore hidden windows.
              </p>
            </div>
          </WindowContent>
        </Window>
        <Window
          defaultFraming={{
            position: { x: 34, y: 22 },
            size: { height: 46, width: 42 },
          }}
        >
          <WindowControlsHeader />
          <WindowContent>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Second window</p>
              <p className="text-muted-foreground">Try hiding this one too.</p>
            </div>
          </WindowContent>
        </Window>
      </Shell>
    </WindowManagerProvider>
  ),
};
