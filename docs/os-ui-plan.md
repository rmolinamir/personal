# OS UI mental model and design plan

## Goals
- Build an OS-themed portfolio UI inspired by PostHog.
- Desktop surface with launchers, draggable/resizable windows, and a simple dock.
- URL reflects focused window later (TanStack route sync), but we are focusing on window mechanics first.

## Mental model (aligned to real OSes)
- App: a renderer/adapter (Explorer, MarkdownViewer, VideoPlayer, AIAgent, etc.).
- Launchable: a file/folder/link/shortcut that selects an app and provides context.
- Window: the container that hosts an app plus launchable context.
- Workspace: the desktop surface that shows launchers and owns the window stack.
- Dock: simple shortcuts (not pinned/running state yet).

## Routing model (future)
- Use TanStack routes as the source of truth for launchables.
- Each route carries window metadata (title, icon, defaults, etc.).
- Route <-> focused window syncing will be added after the window stack is stable.

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
- WindowManagerProvider: stack context with mount/unmount/focus/getWindow.
- useWindowStack(id): hook that returns focused/zIndex/onFocus.
- Window auto-registers with the stack and auto-generates its id via useId().

## Controlled vs uncontrolled behavior
- Focus/z-index are controlled by WindowManagerProvider when present.
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
