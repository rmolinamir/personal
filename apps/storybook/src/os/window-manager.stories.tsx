import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

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
import {
  WindowManagerProvider,
  useManagedWindow,
} from "@acme/ui/os/window-manager";

const meta = {
  title: "OS/WindowManager",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type ManagedWindowProps = {
  id: string;
  title: string;
  description?: string;
  defaultPosition: { x: number; y: number };
  defaultSize: { width: number; height: number };
  autoFocus?: boolean;
  footer?: string;
  children: React.ReactNode;
};

const ManagedWindow = ({
  id,
  title,
  description,
  defaultPosition,
  defaultSize,
  autoFocus,
  footer,
  children,
}: ManagedWindowProps) => {
  const { focused, zIndex, onFocus } = useManagedWindow(id, { autoFocus });

  return (
    <Window
      bounds="parent"
      defaultPosition={defaultPosition}
      defaultSize={defaultSize}
      focused={focused}
      zIndex={zIndex}
      onFocus={onFocus}
    >
      <WindowHeader>
        <div className="space-y-0.5">
          <WindowTitle>{title}</WindowTitle>
          {description ? (
            <WindowDescription>{description}</WindowDescription>
          ) : null}
        </div>
        <WindowActions>
          <WindowAction aria-label="Minimize">—</WindowAction>
          <WindowAction aria-label="Maximize">□</WindowAction>
          <WindowAction aria-label="Close">×</WindowAction>
        </WindowActions>
      </WindowHeader>
      <WindowContent>{children}</WindowContent>
      {footer ? (
        <WindowFooter className="text-muted-foreground text-xs">
          {footer}
        </WindowFooter>
      ) : null}
    </Window>
  );
};

export const FocusAndZIndex: Story = {
  render: () => (
    <WindowManagerProvider>
      <div className="relative h-[720px] w-full overflow-hidden bg-muted/30 p-6">
        <ManagedWindow
          id="about"
          title="About"
          defaultPosition={{ x: 90, y: 80 }}
          defaultSize={{ width: 520, height: 320 }}
          autoFocus
        >
          <div className="space-y-2 text-sm">
            <p className="font-medium">Robert Molina</p>
            <p className="text-muted-foreground">
              Click a window header to bring it forward.
            </p>
          </div>
        </ManagedWindow>

        <ManagedWindow
          id="explorer"
          title="Explorer"
          description="~/projects/portfolio"
          defaultPosition={{ x: 220, y: 180 }}
          defaultSize={{ width: 520, height: 360 }}
          footer="12 items · 3.4 MB"
        >
          <div className="grid gap-3 text-sm">
            <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
              Drag and resize within the workspace.
            </div>
            <div className="rounded-lg border border-muted-foreground/40 border-dashed px-3 py-4">
              Focus updates z-index automatically.
            </div>
          </div>
        </ManagedWindow>
      </div>
    </WindowManagerProvider>
  ),
};
