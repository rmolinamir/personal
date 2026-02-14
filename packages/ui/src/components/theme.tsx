import { Moon, Sun } from "lucide-react";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type DocumentTheme = "dark" | "light";

type Theme = DocumentTheme | "system";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeContextValue = {
  setTheme: () => null,
  theme: "system",
};

const ThemeContext = createContext<ThemeContextValue>(initialState);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () =>
      (localStorage.getItem(storageKey) as Theme) ||
      defaultTheme ||
      getSystemTheme(),
  );

  const initializeTheme = React.useEffectEvent(() => {
    updateDocumentTheme(toDocumentTheme(theme));
  });

  useEffect(() => {
    initializeTheme();
  }, []);

  const value = {
    setTheme: (newTheme: Theme) => {
      if (newTheme === theme) return;

      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);

      const previousDocumentTheme = toDocumentTheme(theme);
      const newDocumentTheme = toDocumentTheme(newTheme);

      if (previousDocumentTheme !== newDocumentTheme)
        safeViewTransition(() => updateDocumentTheme(newDocumentTheme));
    },
    theme,
  } satisfies ThemeContextValue;

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  const value = useMemo(() => {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    return {
      ...context,
      theme: context.theme === "system" ? systemTheme : context.theme,
    };
  }, [context]);

  return value;
}

type ThemeToggleProps = Omit<React.ComponentProps<typeof Button>, "children">;

export function ThemeMenu(props: ThemeToggleProps) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" {...props}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only bg-background">Toggle Theme</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Change theme</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LightThemeOnly({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { theme } = useTheme();

  if (theme !== "light") return null;

  return <div className={cn("hidden", className)} {...props} />;
}

export function DarkThemeOnly({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { theme } = useTheme();

  if (theme !== "dark") return null;

  return <div className={cn("hidden", className)} {...props} />;
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function safeViewTransition(callback: ViewTransitionUpdateCallback) {
  if (!document.startViewTransition) return callback();
  return document.startViewTransition(callback);
}

function toDocumentTheme(theme: Theme) {
  return theme === "system" ? getSystemTheme() : theme;
}

function updateDocumentTheme(theme: DocumentTheme) {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}
