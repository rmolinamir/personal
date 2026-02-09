import { defineApplication, useApplication } from "@acme/ui/os/application";
import { Window, withCenteredFraming } from "@acme/ui/os/window";
import {
  WindowAction,
  WindowCloseButton,
  WindowControls,
  WindowFullscreenButton,
  WindowHideButton,
} from "@acme/ui/os/window-actions";
import {
  WindowContent,
  WindowHeader,
  WindowTitle,
} from "@acme/ui/os/window-layout";
import { Minus, Square, X } from "lucide-react";
import { useWindowDefaultFraming } from "@/hooks/use-window-default-framing";

const AboutApplication = defineApplication("mail")({
  component: () => {
    const { title } = useApplication();
    const defaultFraming = useWindowDefaultFraming();

    return (
      <Window defaultFraming={defaultFraming}>
        <WindowHeader>
          <WindowTitle>{title}</WindowTitle>
          <WindowControls>
            <WindowHideButton aria-label="Hide" className="text-slate-500">
              <Minus className="size-4" />
            </WindowHideButton>
            <WindowFullscreenButton
              aria-label="Fullscreen"
              className="text-slate-500"
            >
              <Square className="size-3.5" />
            </WindowFullscreenButton>
            <WindowCloseButton aria-label="Close" className="text-slate-500">
              <X className="size-4" />
            </WindowCloseButton>
          </WindowControls>
        </WindowHeader>
        <WindowContent>
          <div className="space-y-3 text-sm">
            <p className="font-medium">About Me</p>
            <p className="text-muted-foreground">
              I'm a software engineer that just hits tab whenever the IDE
              predicts the next lines of code. I promise the code is always
              correct.
            </p>
          </div>
        </WindowContent>
      </Window>
    );
  },
  title: "Mail",
});

export { AboutApplication };
