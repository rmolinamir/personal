import { Button } from "@acme/ui/components/button";
import { cn } from "@acme/ui/lib/utils";
import { Power } from "lucide-react";

type PowerButtonProps = Omit<React.ComponentProps<typeof Button>, "children">;

export function PowerButton({ className, ...props }: PowerButtonProps) {
  return (
    <div
      className={cn(
        "power-button-chroma transition-transform duration-200 ease-out",
        "hover:drop-shadow-[0_0_12px_var(--chart-5)]",
        "hover:[--chroma-opacity:1] hover:[--chroma-speed:2.2s]",
        "hover:[--chroma-boost-opacity:0.7] hover:[--chroma-brightness:1.15]",
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "relative z-1 size-22 p-16 text-chart-5 transition-transform duration-150",
          "hover:scale-[1.2] active:scale-95",
          className,
        )}
        {...props}
      >
        <Power className="size-22" />
      </Button>
    </div>
  );
}
