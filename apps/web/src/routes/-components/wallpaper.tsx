import { useTheme } from "@acme/ui/components/theme";
import { ClientOnly } from "@tanstack/react-router";
import type React from "react";
import {
  CRTScreen,
  FlowField,
  Glitch,
  ImageTexture,
  Liquify,
  Shader,
} from "shaders/react";

type WallpaperProps = React.ComponentProps<typeof Shader>;

export function Wallpaper(props: WallpaperProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <ClientOnly>
      <Shader {...props}>
        <CRTScreen
          pixelSize={140}
          colorShift={1.2}
          scanlineIntensity={0.32}
          scanlineFrequency={220}
          brightness={1.11}
          contrast={1.06}
          vignetteIntensity={1.16}
          vignetteRadius={0.33}
        >
          <Glitch intensity={0.1} speed={0.5}>
            <Liquify intensity={1} decay={2.5} radius={1.5} edges="mirror">
              <FlowField
                strength={0.25}
                detail={1.2}
                speed={0.1}
                edges="mirror"
              >
                <ImageTexture
                  url={
                    isLight
                      ? "/vibrant-wallpaper-light.webp"
                      : "/vibrant-wallpaper-dark.webp"
                  }
                />
              </FlowField>
            </Liquify>
          </Glitch>
        </CRTScreen>
      </Shader>
    </ClientOnly>
  );
}
