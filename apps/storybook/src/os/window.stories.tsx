import {
  Window,
  WindowAction,
  WindowActions,
  WindowContent,
  WindowDescription,
  WindowFooter,
  WindowHeader,
  WindowTitle,
} from "@acme/ui/os/window";
import { WindowProvider } from "@acme/ui/os/window-provider";
import type { Meta, StoryObj } from "@storybook/react-vite";

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

export const Default: Story = {
  render: () => {
    return (
      <WindowProvider>
        <div className="relative h-160 w-full overflow-hidden bg-muted/30 p-6">
          <Window
            defaultPosition={{ x: 96, y: 64 }}
            defaultSize={{ height: 380, width: 560 }}
          >
            <WindowHeader>
              <WindowTitle>About</WindowTitle>
              <WindowActions>
                <WindowAction aria-label="Minimize">—</WindowAction>
                <WindowAction aria-label="Maximize">□</WindowAction>
                <WindowAction aria-label="Close">×</WindowAction>
              </WindowActions>
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
        </div>
      </WindowProvider>
    );
  },
};

export const WithDescription: Story = {
  render: () => (
    <WindowProvider>
      <div className="relative h-160 w-full overflow-hidden bg-muted/30 p-6">
        <Window defaultPosition={{ x: 140, y: 120 }}>
          <WindowHeader>
            <div className="space-y-0.5">
              <WindowTitle>Explorer</WindowTitle>
              <WindowDescription>~/Projects/website</WindowDescription>
            </div>
            <WindowActions>
              <WindowAction aria-label="Minimize">—</WindowAction>
              <WindowAction aria-label="Maximize">□</WindowAction>
              <WindowAction aria-label="Close">×</WindowAction>
            </WindowActions>
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
      </div>
    </WindowProvider>
  ),
};

export const MultiWindow: Story = {
  render: () => {
    return (
      <WindowProvider>
        <div className="relative h-160 w-full overflow-hidden bg-muted/30 p-6">
          <Window
            defaultPosition={{ x: 80, y: 80 }}
            defaultSize={{ height: 340, width: 520 }}
          >
            <WindowHeader>
              <WindowTitle>About</WindowTitle>
              <WindowActions>
                <WindowAction aria-label="Minimize">—</WindowAction>
                <WindowAction aria-label="Maximize">□</WindowAction>
                <WindowAction aria-label="Close">×</WindowAction>
              </WindowActions>
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
            defaultPosition={{ x: 220, y: 160 }}
            defaultSize={{ height: 360, width: 520 }}
          >
            <WindowHeader>
              <div className="space-y-0.5">
                <WindowTitle>Explorer</WindowTitle>
                <WindowDescription>~/Projects/website</WindowDescription>
              </div>
              <WindowActions>
                <WindowAction aria-label="Minimize">—</WindowAction>
                <WindowAction aria-label="Maximize">□</WindowAction>
                <WindowAction aria-label="Close">×</WindowAction>
              </WindowActions>
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
        </div>
      </WindowProvider>
    );
  },
};

export const ConstrainedBounds: Story = {
  render: () => {
    return (
      <WindowProvider>
        <div className="relative h-180 w-full overflow-hidden bg-muted/30">
          <div className="flex h-14 items-center justify-between border-b bg-background/80 px-4 text-muted-foreground text-sm">
            <span>Top Bar</span>
            <span>Dock Area</span>
          </div>
          <div className="relative h-[calc(100%-3.5rem)] p-6">
            <Window
              defaultPosition={{ x: 120, y: 60 }}
              defaultSize={{ height: 340, width: 520 }}
            >
              <WindowHeader>
                <WindowTitle>Constrained Window</WindowTitle>
                <WindowActions>
                  <WindowAction aria-label="Minimize">—</WindowAction>
                  <WindowAction aria-label="Maximize">□</WindowAction>
                  <WindowAction aria-label="Close">×</WindowAction>
                </WindowActions>
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
        </div>
      </WindowProvider>
    );
  },
};
