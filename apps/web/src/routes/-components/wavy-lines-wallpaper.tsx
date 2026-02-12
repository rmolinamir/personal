import {
  DotGrid,
  FloatingParticles,
  FlowField,
  Glow,
  Liquify,
  Perspective,
  Shader,
  SolidColor,
  WaveDistortion,
} from "shaders/react";

type WavyLinesWallpaperProps = React.ComponentProps<typeof Shader>;

export function WavyLinesWallpaper(props: WavyLinesWallpaperProps) {
  return (
    <Shader {...props}>
      <SolidColor color="#050505" />
      <Glow intensity={0.55} threshold={0.25} size={9}>
        <Perspective tilt={-10} fov={56} zoom={1.04} edges="mirror">
          <WaveDistortion
            strength={0.06}
            frequency={1.3}
            speed={0.16}
            angle={6}
            waveType="sine"
            edges="mirror"
          >
            <FlowField strength={0.08} detail={1.3} speed={0.18} edges="mirror">
              <Liquify intensity={0.35} decay={4} radius={1.2} edges="mirror">
                <DotGrid
                  color="#e6e6e6"
                  density={120}
                  dotSize={0.22}
                  twinkle={0.03}
                />
              </Liquify>
            </FlowField>
          </WaveDistortion>
        </Perspective>
      </Glow>
      <FloatingParticles
        particleColor="#d9d9d9"
        particleSize={0.6}
        particleSoftness={0.6}
        particleDensity={1.2}
        count={2}
        speed={0.2}
        angle={100}
        twinkle={0.1}
        speedVariance={0.2}
        angleVariance={12}
      />
    </Shader>
  );
}

export function WavyLinesWallpaperLight(props: WavyLinesWallpaperProps) {
  return (
    <Shader {...props}>
      <SolidColor color="#f4f2ee" />
      <Glow intensity={0.25} threshold={0.4} size={6}>
        <Perspective tilt={-10} fov={56} zoom={1.04} edges="mirror">
          <WaveDistortion
            strength={0.05}
            frequency={1.2}
            speed={0.14}
            angle={6}
            waveType="sine"
            edges="mirror"
          >
            <FlowField strength={0.06} detail={1.2} speed={0.16} edges="mirror">
              <Liquify intensity={0.28} decay={4} radius={1.1} edges="mirror">
                <DotGrid
                  color="#1b1b1b"
                  density={120}
                  dotSize={0.2}
                  twinkle={0.02}
                />
              </Liquify>
            </FlowField>
          </WaveDistortion>
        </Perspective>
      </Glow>
      <FloatingParticles
        particleColor="#1f1f1f"
        particleSize={0.5}
        particleSoftness={0.7}
        particleDensity={1}
        count={2}
        speed={0.2}
        angle={100}
        twinkle={0.08}
        speedVariance={0.2}
        angleVariance={12}
      />
    </Shader>
  );
}
