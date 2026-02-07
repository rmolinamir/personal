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
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "OS/WindowManager",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const FocusAndZIndex: Story = {
  render: () => (
    <WindowProvider>
      <div className="relative h-180 w-full overflow-hidden bg-muted/30 p-6">
        <Window autoFocus defaultSize={{ height: 520, width: 520 }}>
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
                Click a window header to bring it forward.
              </p>
            </div>
          </WindowContent>
        </Window>

        <Window defaultSize={{ height: 320, width: 320 }}>
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
                Drag and resize within the workspace.
              </div>
              <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
                Focus updates z-index automatically.
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
