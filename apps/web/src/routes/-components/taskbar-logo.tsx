import { cn } from "@acme/ui/lib/utils";

type TaskbarLogoProps = React.ComponentPropsWithoutRef<"svg">;

export function TaskbarLogo({ className, ...props }: TaskbarLogoProps) {
  return (
    <svg
      className={cn("h-6 w-6", className)}
      viewBox="0 0 433 289"
      fill="currentColor"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Personal Logo</title>
      <path d="M0.769226 288.228L128.269 1.22754L212.951 190.362L300.269 1.22754L431.769 288.228H256.769L212.951 190.362L167.769 288.228H0.769226Z" />
      <path d="M0.769226 288.228L128.269 1.22754L256.769 288.228H431.769L300.269 1.22754L167.769 288.228H0.769226Z" />
    </svg>
  );
}
