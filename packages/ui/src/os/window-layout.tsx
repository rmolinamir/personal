import * as React from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card";
import { cn } from "../lib/utils";

const WindowHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader
    ref={ref}
    data-slot="window-header"
    className={cn(
      "flex select-none flex-row items-center justify-between gap-3",
      "border-border/80 border-b bg-muted/60 px-3 py-2!",
      "auto-rows-auto grid-rows-none items-center",
      className,
    )}
    {...props}
  />
));

WindowHeader.displayName = "WindowHeader";

const WindowTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardTitle
    ref={ref}
    data-slot="window-title"
    className={cn("truncate font-medium text-sm", className)}
    {...props}
  />
));

WindowTitle.displayName = "WindowTitle";

const WindowCaption = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardDescription
    ref={ref}
    data-slot="window-description"
    className={cn("text-xs", className)}
    {...props}
  />
));

WindowCaption.displayName = "WindowDescription";

const WindowFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter
    ref={ref}
    data-slot="window-footer"
    className={cn("px-3 py-2", className)}
    {...props}
  />
));

WindowFooter.displayName = "WindowFooter";

const WindowContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent
    ref={ref}
    data-slot="window-content"
    className={cn("flex-1 select-text overflow-auto px-3 py-2", className)}
    {...props}
  />
));

WindowContent.displayName = "WindowContent";

export {
  WindowContent,
  WindowCaption,
  WindowFooter,
  WindowHeader,
  WindowTitle,
};
