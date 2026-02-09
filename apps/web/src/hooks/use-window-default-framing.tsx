import {
  type WindowPercentFraming,
  withCenteredFraming,
} from "@acme/ui/os/window";
import { useIsMobile } from "node_modules/@acme/ui/src/hooks/use-mobile";

/**
 * @returns If device is mobile, returns a centered frame with a height and width of 100% of the screen.
 * Otherwise, returns a centered frame with a height and width of 90%.
 */
export function useWindowDefaultFraming(): WindowPercentFraming {
  const isMobile = useIsMobile();

  return withCenteredFraming(
    isMobile
      ? {
          height: 100,
          width: 100,
        }
      : {
          height: 90,
          width: 90,
        },
  );
}
