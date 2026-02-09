import { cn } from "@acme/ui/lib/utils";
import { useWindowManager } from "@acme/ui/os/window-manager";

type HiddenWindowsDockProps = {
  className?: string;
};

function FloatingHiddenWindows({ className }: HiddenWindowsDockProps) {
  const { windows, activateWindow, getWindowData } = useWindowManager();
  const hiddenWindows = windows.filter(
    (window) => getWindowData(window.id)?.isHidden,
  );

  if (hiddenWindows.length === 0) return null;

  return (
    <div
      className={cn(
        "absolute bottom-4 left-4 z-30 rounded-xl border bg-background/90 px-3 py-2 text-xs shadow-lg",
        className,
      )}
    >
      <div className="text-muted-foreground">Hidden windows</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {hiddenWindows.map((window) => (
          <button
            type="button"
            key={window.id}
            className="rounded-md border border-border/80 bg-muted/60 px-2 py-1 text-xs"
            onClick={() => {
              activateWindow(window.id);
            }}
          >
            Show
          </button>
        ))}
      </div>
    </div>
  );
}

export { FloatingHiddenWindows };
