import { cn } from "@acme/ui/lib/utils";
import { useNotFound } from "@/hooks/use-not-found";
import { Desktop } from "../desktop/desktop";
import { PowerButton, PowerScreen } from "../power/power";
import { useSystem } from "../system/system-provider";

type SystemLayoutProps = React.ComponentProps<"div">;

export function RootLayout({
  children,
  className,
  ...props
}: SystemLayoutProps) {
  const { isNotFound } = useNotFound();
  const { power, boot } = useSystem();
  const isOff = power === "off";
  const isOn = power === "on";

  return (
    <div
      className={cn(
        {
          "animate-power-off": isOff,
          "animate-power-on": isOn,
        },
        className,
      )}
      {...props}
    >
      {isNotFound ? children : <Desktop>{children}</Desktop>}
      {isOff && (
        <PowerScreen
          className={cn(
            "absolute inset-0 z-20000",
            "animate-screen-blackout opacity-0",
          )}
        >
          <PowerButton
            className="rounded-full bg-transparent!"
            onClick={boot}
          />
        </PowerScreen>
      )}
    </div>
  );
}
