import { Shell } from "@acme/ui/os/shell";
import { Window } from "@acme/ui/os/window";
import {
  WindowContent,
  WindowHeader,
  WindowTitle,
} from "@acme/ui/os/window-layout";
import { WindowManagerProvider } from "@acme/ui/os/window-manager";
import { WindowSnap } from "@acme/ui/os/window-snap";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  title: "OS/Shell",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const FixedShell: Story = {
  render: () => (
    <div className="bg-blue-100 p-6">
      <WindowManagerProvider>
        <Shell className="relative m-6 h-70 w-120 overflow-hidden border border-red-500 bg-green-200">
          <WindowSnap>
            <Window>
              <WindowHeader>
                <WindowTitle>Fixed Shell</WindowTitle>
              </WindowHeader>
              <WindowContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Fixed height shell</p>
                  <p className="text-muted-foreground">
                    Windows are bound to this shell.
                  </p>
                </div>
              </WindowContent>
            </Window>
          </WindowSnap>
        </Shell>
      </WindowManagerProvider>
    </div>
  ),
};

export const FluidShell: Story = {
  render: () => (
    <WindowManagerProvider>
      <div className="h-180 w-full">
        <Shell className="relative h-full w-full overflow-hidden bg-muted/30 p-6">
          <WindowSnap>
            <Window>
              <WindowHeader>
                <WindowTitle>Fluid Shell</WindowTitle>
              </WindowHeader>
              <WindowContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Percent-based shell</p>
                  <p className="text-muted-foreground">
                    Shell fills its parent container.
                  </p>
                </div>
              </WindowContent>
            </Window>
          </WindowSnap>
        </Shell>
      </div>
    </WindowManagerProvider>
  ),
};
