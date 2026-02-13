import { useApplicationManager } from "@acme/ui/os/application-manager";
import {
  TabStrip,
  TabStripClose,
  TabStripList,
  TabStripRail,
  TabStripTab,
  TabStripTabTrigger,
  TabStripTitle,
} from "@acme/ui/os/tab-strip";
import { useWindowManager } from "@acme/ui/os/window-manager";

type ApplicationTabStripProps = Omit<
  typeof TabStrip,
  "value" | "onValueChange"
>;

export function ApplicationTabStrip(props: ApplicationTabStripProps) {
  const { runningApplications, close } = useApplicationManager();
  const { activateWindow, getWindowData, getTopWindow, hideWindow } =
    useWindowManager();

  const activeWindow = getTopWindow();

  return (
    <TabStrip
      value={activeWindow?.id}
      onValueChange={activateWindow}
      {...props}
      className="border-none"
    >
      <TabStripRail>
        <TabStripList className="border-none p-0">
          {runningApplications.map((application) => {
            const window = getWindowData(application.id);
            return (
              <TabStripTab key={application.id} isHidden={window?.isHidden}>
                <TabStripTabTrigger
                  value={application.id}
                  onClick={() => activateWindow(application.id)}
                  onDoubleClick={() => hideWindow(application.id)}
                >
                  <TabStripTitle>{application.metadata.title}</TabStripTitle>
                </TabStripTabTrigger>
                <TabStripClose onClose={() => close(application)} />
              </TabStripTab>
            );
          })}
        </TabStripList>
      </TabStripRail>
    </TabStrip>
  );
}
