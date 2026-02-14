# Personal Website (Desktop OS)

## Purpose
Define the product scope for the personal website built as a desktop OS experience.
This spec is the source of truth for UX, content apps, theming, and interactions.

## Scope
- OS shell: taskbar, launcher grid, windows, background.
- About app as the primary content hub.
- Additional apps for content + utilities.
- Theming, animations, and easter eggs.
- MVP scope is complete; remaining work is tracked in `specs/roadmap.md`.

## Desktop Shell
- Launcher grid for app launchers (desktop icons).
- Window layer with snap, focus, hide, and cascade placement.
- Taskbar with running apps + system tray.

## Taskbar Items
- Start/launcher button (left) with power action in Start menu.
- Running apps with active state + hidden badge.
- System tray: theme toggle.
- Clock/date (right).

## About App (Primary Content Hub)
Sections (single window with scroll or tabs):
- Intro: short bio + avatar + quick facts.
- Work/Experience: timeline from old site.
- Projects: grid with role + tech badges + links.
- Skills/Stack: matrix/table from old site.
- Open Source: repo list + contributions.
- Education: summary + logos.
- Contact: mailto + social links.
- Status: content is partial; missing sections are tracked in `specs/roadmap.md`.

## MVP (Complete)
- Original MVP scope is complete. (complete)
- Desktop shell, taskbar, windowing, and wallpaper. (complete)
- Start menu with power button. (complete)
- BSOD 404 screen. (complete)
- Power shutdown flow. (complete)
- App shells: About, Doom, Resume. (complete)

## Missing Apps (Roadmap)
Missing apps are tracked in `specs/roadmap.md` (priority order, not strictly later).
- Blog.
- Settings (display options, wallpaper, taskbar/dock options).
- Projects.
- Experience.
- Skills.
- Open Source.
- Terminal.
- Gallery.
- Notes.
- Changelog.
- Contact.

## Background
- Animated wallpaper with subtle motion.
- Light/dark variants with matching palette.

## Theming
- Replace hardcoded colors with theme tokens from `packages/ui/src/styles.css`.
  Use `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`,
  `border-border`, `text-primary`, `bg-accent`, `ring-ring`, etc.
- Add a theme toggle in the taskbar system tray.
- Respect `prefers-color-scheme` and persist selection.

## Animations
- Window open/close: scale + fade + slight translate.
- Focus: shadow/outline bump.
- Launcher hover/active: lift + glow.
- Background: slow drift.

## Not Found + Easter Eggs
- 404: BSOD screen. (complete)
- Power button: shutdown easter egg. (complete)
- Terminal commands: hidden apps or playful responses.

## Implementation Notes
- Keep launcher content-only; wrapper controls behavior.
- Use initial-only framing factories for default window placement.
- Avoid routing logic in UI packages; integrate in app layer.
