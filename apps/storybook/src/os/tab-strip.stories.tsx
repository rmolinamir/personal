import {
  TabSTrip,
  TabSTripClose,
  TabSTripList,
  TabSTripTab,
  TabSTripTitle,
  TabStripRail,
} from "@acme/ui/os/tab-strip";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "OS/Tab Strip",
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const initialTabs = [
  { id: "overview", title: "Overview" },
  { id: "materials", title: "Materials Import" },
  { id: "scrap", title: "Pilfering & Scrap" },
  { id: "patch", title: "Patch 11.2" },
  { id: "notes", title: "Release Notes (Long Name Example)" },
  { id: "hidden", isHidden: true, title: "Hidden Window" },
];

export const Default: Story = {
  render: () => {
    const [tabs, setTabs] = React.useState(initialTabs);
    const [activeId, setActiveId] = React.useState(tabs[0]?.id ?? "");

    const handleClose = (id: string) => {
      setTabs((prev) => {
        const nextTabs = prev.filter((tab) => tab.id !== id);
        if (id === activeId) {
          const closedIndex = prev.findIndex((tab) => tab.id === id);
          const nextActive =
            nextTabs[closedIndex] ?? nextTabs[closedIndex - 1] ?? nextTabs[0];
          setActiveId(nextActive?.id ?? "");
        }
        return nextTabs;
      });
    };

    return (
      <div className="w-full max-w-full rounded-xl border border-border/40 bg-background/80 p-4 shadow-sm">
        <TabSTrip value={activeId} onValueChange={setActiveId}>
          <TabStripRail className="max-w-140">
            <TabSTripList>
              {tabs.map((tab) => (
                <TabSTripTab
                  key={tab.id}
                  value={tab.id}
                  isHidden={tab.isHidden}
                >
                  <TabSTripTitle>{tab.title}</TabSTripTitle>
                  <TabSTripClose onClose={() => handleClose(tab.id)} />
                </TabSTripTab>
              ))}
            </TabSTripList>
          </TabStripRail>
        </TabSTrip>
      </div>
    );
  },
};
