import { Progress } from "@acme/ui/components/progress";
import React from "react";
import { useSystem } from "../system/system-provider";

type ApplicationProgressProps = Omit<
  React.ComponentProps<typeof Progress>,
  "value"
>;

export function ApplicationProgressBar({ ...props }: ApplicationProgressProps) {
  const { loadingApplications } = useSystem();
  const [progress, setProgress] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);
  const completionTimeoutRef = React.useRef<number | null>(null);
  const previousCountRef = React.useRef(0);

  const clearTimers = React.useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (completionTimeoutRef.current) {
      window.clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  const startProgress = React.useCallback(() => {
    clearTimers();
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        const ceiling = 92;
        const rate = prev < 50 ? 0.18 : 0.06;
        const next = prev + (ceiling - prev) * rate;
        return Math.min(next, ceiling);
      });
    }, 120);
  }, [clearTimers]);

  const resetProgress = React.useCallback(() => {
    clearTimers();
    setProgress(0);
  }, [clearTimers]);

  /**
   * @privateRemarks
   * We set the progress to as close to 100 as possible to make it look like it's done.
   * The progress bar will be hidden after a short delay when setting the progress to 100.
   * If another application starts within this range, it will be reset to 0.
   */
  const finishProgress = React.useCallback(() => {
    clearTimers();
    setProgress(99.99999);
    completionTimeoutRef.current = window.setTimeout(() => {
      setProgress(100);
    }, 360);
  }, [clearTimers]);

  React.useEffect(() => {
    const previousCount = previousCountRef.current;
    const currentCount = loadingApplications.length;

    if (currentCount > 0) {
      if (currentCount > previousCount) resetProgress();
      startProgress();
    } else if (previousCount > 0) {
      finishProgress();
    }

    previousCountRef.current = currentCount;
  }, [
    loadingApplications.length,
    startProgress,
    resetProgress,
    finishProgress,
  ]);

  // If unmounted, clear any pending timers.
  React.useEffect(() => clearTimers, [clearTimers]);

  const shouldShowProgress =
    loadingApplications.length > 0 || (progress > 0 && progress < 100);

  // Hide the progress bar as soon as it's complete.
  if (!shouldShowProgress) return null;

  return <Progress value={progress} {...props} />;
}
