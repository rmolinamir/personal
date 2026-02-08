# OS UI mental model and design plan

## Goals
- Build an OS-themed portfolio UI inspired by PostHog.
- Desktop surface with launchers, draggable/resizable windows, and a simple dock.
- URL reflects focused window later (TanStack route sync), but we are focusing on window mechanics first.

## Mental model (aligned to real OSes)
- App: a renderer/adapter (Explorer, MarkdownViewer, VideoPlayer, AIAgent, etc.).
- Launcher: a file/folder/link/shortcut that selects an app and provides context.
- Window: the container that hosts an app plus launcher context.
- Workspace: the desktop surface that shows launchers and owns the window stack.
- Dock: simple shortcuts (not pinned/running state yet).

## Routing model (future)
- Use TanStack routes as the source of truth for launchers.
- Each route carries window metadata (title, icon, defaults, etc.).
- Route <-> focused window syncing will be added after the window stack is stable.

Route launches (no Workspace route scanning):
- Each route is responsible for launching its own app on mount.
- Visiting /about calls launch({ id: "about", ... }) from inside the /about route.
- Visiting / does not launch anything; launchers drive navigation or direct launch.
- Launch is idempotent: if the app is already running, do nothing (or restore/activate).
- Closing a window removes the app instance; revisiting the route can launch again.

Launcher types (naming TBD):
- RouteLauncher: a link that navigates to a route which launches an app.
- ActionLauncher: a button that calls launch() directly without route change.

## Window system (current implementation)
- Windows are rendered with react-rnd for drag/resize.
- Uses shadcn Card and Button primitives for chrome and controls.
- Window content is slotted via WindowContent.

Window components (exported from @acme/ui/os/window):
- Window
- WindowHeader (CardHeader)
- WindowTitle (CardTitle)
- WindowDescription (CardDescription)
- WindowActions (CardAction)
- WindowAction (Button)
- WindowContent (CardContent)
- WindowFooter (CardFooter)

## Window stack (focus/z-index)
- Minimal context that only tracks focus + z-index.
- Each Window owns its own local UI state (position/size) unless you explicitly control it.
- Focus updates z-index by bumping a counter; focused window is highest z-index.
- Unmounting a focused window focuses the current top window if any.

Implementation details:
- WindowManager: stack context with mount/unmount/focus/getWindow.
- useWindowStack(id): hook that returns focused/zIndex/onFocus.
- Window auto-registers with the stack and auto-generates its id via useId().

## Controlled vs uncontrolled behavior
- Focus/z-index are controlled by WindowManager when present.
- Outside the provider, Window uses focused/zIndex props (no internal focus state).
- Drag/resize are uncontrolled by default via react-rnd default position/size.
- For controlled drag/resize: pass position/size and handle onPositionChange/onSizeChange.

## Relevant files
- packages/ui/src/os/window.tsx
- packages/ui/src/os/window-manager.tsx
- apps/storybook/src/os/window.stories.tsx
- apps/storybook/src/os/window-manager.stories.tsx

## Next steps (planned)
1) Workspace primitive: desktop canvas + bounds container + background.
2) Launcher primitive: icon + label + double-click handler.
3) Dock primitive: simple shortcuts.
4) App adapters: Explorer, MarkdownViewer, VideoPlayer, AIAgent.
5) TanStack route sync: focus <-> URL and auto-open on route.
