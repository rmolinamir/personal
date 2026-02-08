# Application Management

## Purpose
Define how apps are launched, how routes participate, and how launchers behave. This is separate from Window mechanics and keeps launches app-centric.

## Core principles
- We launch apps, not windows.
- Apps own their own windows and layout (appId maps to window id).
- WindowManager only bounds/focuses running windows; it does not decide what launches.
- Closing a window removes the app instance and all its state.

## Launch model
- Routes are responsible for launching their own app instance on mount.
- The Workspace does not scan routes for matches.
- Launch is idempotent: if the app is already running, do nothing (or restore/activate if minimized).
- Navigating between routes launches new apps but does not close existing ones.

## Implementation split
- defineApplication + useApplication live in packages/ui/src/os/application.tsx.
- ApplicationManager + useApplicationManager live in packages/ui/src/os/application-manager.tsx.

## Launcher types (naming TBD)

### RouteLauncher
For navigation-driven launches. Clicking navigates to a route that triggers launch.

User story:
- User is on /about (About app running).
- User clicks Contact launcher (a link) and navigates to /contact.
- /contact route launches Contact app; /about remains open.

### ActionLauncher
For programmatic launches without a route change.

User story:
- User is on / (no apps running).
- User clicks a launcher that directly calls launch({ id: "about" }).
- About app opens without changing the URL.

## Route-driven launch examples
User story:
- User visits /about directly.
- /about route mounts and calls launch({ id: "about" }).
- If About is already running, nothing happens (or it is restored/activated).

User story:
- User navigates from /about to /contact.
- /contact route launches Contact app.
- About stays open until the user closes it manually.

## Notes
- Later, route sync should map the focused app to the URL (PostHog-style).
- URL serialization can be single-window or multi-window and can be layered on later.
- Those URLs can drive programmatic launches, decide whether to update the URL after launching,
  and hydrate per-app framing (position/size) on load.
- When serializing, store the route path (if any) alongside each window so apps can be re-launched.

### PostHog URL Examples

Single-window:
- /about?window[framing][x]=10&window[framing][y]=12&window[framing][width]=60&window[framing][height]=70

Multi-window:
- https://posthog.com/changelog?windows[0][path]=/&windows[0][position][x]=0&windows[0][position][y]=0&windows[0][size][width]=50&windows[0][size][height]=94.49481865284974&windows[0][zIndex]=1&windows[1][path]=/changelog&windows[1][position][x]=50&windows[1][position][y]=0&windows[1][size][width]=50&windows[1][size][height]=94.49481865284974&windows[1][zIndex]=2
