import { useIsMobile } from "@acme/ui/hooks/use-mobile";
import { cn } from "@acme/ui/lib/utils";
import React from "react";

type Game = "doom1" | "freedoom1" | "freedoom2";

export function Doom() {
  const [game, setGame] = React.useState<Game>("doom1");
  const [nonce, setNonce] = React.useState(() => Date.now());
  const [started, setStarted] = React.useState(false);
  const [iframeReady, setIframeReady] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const isMobile = useIsMobile();

  function selectGame(next: Game): void {
    setGame(next);
    if (!started) return;
    // force a clean engine restart
    setNonce(Date.now());
  }

  function startGame(next?: Game): void {
    if (next) setGame(next);
    setNonce(Date.now());
    setStarted(true);
  }

  React.useEffect(() => {
    if (!started || !iframeReady) return;
    const target = iframeRef.current?.contentWindow;
    if (!target) return;
    target.postMessage(
      {
        iwad: game,
        type: "BOOT",
      },
      window.location.origin,
    );
  }, [game, iframeReady, started]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-background/80 p-2 text-foreground shadow-lg sm:gap-4 sm:p-5">
      <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
        <div
          className={cn(
            "relative w-full",
            started
              ? isMobile
                ? "h-full"
                : "aspect-4/3 max-h-full sm:max-w-[calc(80vh*4/3)]"
              : "h-full w-full p-4",
          )}
        >
          <div className="pointer-events-none absolute -inset-2 animate-pulse bg-primary/60 opacity-70 blur-lg" />
          <div className="relative h-full w-full border border-border/60 bg-card/80 p-1 sm:p-3">
            <div className="relative h-full w-full overflow-hidden bg-background/95">
              {started ? (
                <div className="h-full w-full">
                  <iframe
                    key={nonce}
                    title="Doom"
                    src="/dwasm/index.html"
                    className="h-full w-full border-0"
                    ref={iframeRef}
                    allowFullScreen
                    allow="gamepad"
                    onLoad={() => setIframeReady(true)}
                  />
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 overflow-y-auto px-3 py-4 text-center sm:gap-4 sm:px-4 sm:py-6">
                  <img
                    src="/dwasm/freedoom.webp"
                    alt="Freedoom"
                    width={1536}
                    height={1024}
                    className="w-auto max-w-90 object-contain drop-shadow-xl sm:max-w-105"
                  />
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <DoomSelectButton
                      active={game === "doom1"}
                      onClick={() => selectGame("doom1")}
                    >
                      Shareware Doom
                    </DoomSelectButton>
                    <DoomSelectButton
                      active={game === "freedoom1"}
                      onClick={() => selectGame("freedoom1")}
                    >
                      Freedoom I
                    </DoomSelectButton>
                    <DoomSelectButton
                      active={game === "freedoom2"}
                      onClick={() => selectGame("freedoom2")}
                    >
                      Freedoom II
                    </DoomSelectButton>
                  </div>
                  <button
                    className="border border-primary/70 bg-primary px-6 py-2 font-mono text-[12px] text-primary-foreground uppercase tracking-[0.3em] shadow-sm transition hover:bg-primary/90"
                    onClick={() => startGame()}
                    type="button"
                  >
                    Start Game
                  </button>
                  <div className="max-w-105 text-balance font-mono text-[11px] text-muted-foreground uppercase tracking-[0.14em] sm:text-xs">
                    WebAssembly Doom port with Dwasm. Select a game and get in.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {started && <DoomFooter active={started} runKey={`${nonce}-${game}`} />}
    </div>
  );
}

type DoomSelectButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function DoomSelectButton({
  active,
  children,
  onClick,
}: DoomSelectButtonProps) {
  return (
    <button
      className={cn(
        "border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition",
        "border-border/60 bg-muted/40 text-muted-foreground",
        "hover:bg-muted/60 hover:text-foreground",
        active && "border-primary/70 bg-primary/15 text-foreground",
      )}
      data-active={active}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

type DoomFooterProps = {
  active: boolean;
  runKey: string | number;
};

function DoomFooter({ active, runKey }: DoomFooterProps) {
  const isMobile = useIsMobile();
  return (
    <div
      className={cn(
        isMobile ? "hidden" : "flex items-center justify-center",
        "min-h-12 shrink-0 px-3 pb-1 text-center font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em] sm:min-h-14 sm:px-4 sm:text-xs",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <span className="relative block w-full max-w-full" key={runKey}>
        {/*Invisible instructions to about layout shift.*/}
        <DoomInstructions className="text-foreground/0 text-md lg:text-lg" />
        <DoomInstructions
          className={cn(
            "pointer-events-none absolute inset-0 text-md text-primary lg:text-lg",
            active && "animate-doom-reveal",
          )}
        />
      </span>
    </div>
  );
}

type DoomControlsTextProps = Omit<React.ComponentProps<"span">, "children">;

function DoomInstructions({ className, ...props }: DoomControlsTextProps) {
  return (
    <span
      className={cn("block whitespace-normal leading-relaxed", className)}
      {...props}
    >
      AIM: MOUSE OR O/P · FIRE: LEFT MOUSE OR SPACE · MOVE: WASD · RUN: SHIFT ·
      USE: E · MENU: ESC · TAB: MAP
    </span>
  );
}
