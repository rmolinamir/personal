# Application Routing Integration

## Purpose
Describe how routing integrates with application launch and window state without
embedding router behavior in the UI library.

## Principles
- The UI library is routing-agnostic.
- Routes launch applications on mount.
- Launch is idempotent: if already running, activate the window instead.
- Workspace does not scan routes; routes opt-in to launch.
- WindowManager handles focus/z-index; ApplicationManager tracks running apps.

## Route-driven launch flow
1. Route component mounts.
2. If app is running, activate its window.
3. Otherwise, launch the app by id.

Example (app layer, not UI library):
```tsx
function AboutRoute() {
  const { isRunning, launch } = useApplicationManager();
  const { activateWindow } = useWindowManager();

  React.useEffect(() => {
    if (isRunning("about")) {
      activateWindow("about");
      return;
    }
    launch("about");
  }, [activateWindow, isRunning, launch]);

  return null;
}
```

## URL hydration flow (PostHog-style)
1. Parse URL to window entries (app id, framing, zIndex, focused id).
2. Resolve app id to a registered application.
3. Launch each app (idempotent).
4. Apply framing for each window.
5. Activate the focused window (and optionally reapply z-index ordering).

Example (app layer, not UI library):
```ts
const windows = parseUrl();

for (const entry of windows) {
  const app = getApplication(entry.appId);
  if (!app) continue;
  launch(entry.appId);
  setFraming(entry.appId, entry.framing);
}

if (focusedId) {
  activateWindow(focusedId);
}
```

## Registry requirement
Hydration and route-driven launch need an id -> app lookup. A centralized
registry can live in the UI package, populated by defineApplication() at module
load time. The registry is read-only from routing code.

## Window lifecycle -> route sync
Route synchronization for focus/close should stay in the app layer. The window
manager remains the source of truth and emits lifecycle events for the web app
to react to. The UI library does not import or depend on the router.

Proposed manager events (app layer consumers only):
- `onWindowFocused(id)` fires after focus changes.
- `onWindowClosed(nextTopId?)` fires after a window closes, with the next top
  window id (if any) so the app can navigate.

Route sync flow:
1. Window closes or focus changes.
2. Manager determines next focused window.
3. App layer maps window id -> application route and calls `navigate()`.
4. If no matching app, fall back to `/`.

Example (app layer, not UI library):
```tsx
<WindowManagerProvider
  onWindowFocused={(id) => {
    const route = getRouteForWindow(id) ?? "/";
    navigate({ to: route });
  }}
  onWindowClosed={(nextTopId) => {
    const route = nextTopId ? getRouteForWindow(nextTopId) : "/";
    navigate({ to: route });
  }}
/>
```

## Non-goals
- The UI library does not import or depend on the router.
- Routes are not automatically discovered or scanned by the workspace.
