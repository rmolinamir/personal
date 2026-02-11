# Personal Website (Desktop OS)

## Purpose
Define the product scope for the personal website built as a desktop OS experience.
This spec is the source of truth for UX, content apps, theming, and interactions.

## Scope
- OS shell: taskbar, launcher grid, windows, background.
- About app as the primary content hub.
- Additional apps for content + utilities.
- Theming, animations, and easter eggs.

## Desktop Shell
- Launcher grid for app launchers (desktop icons).
- Window layer with snap, focus, hide, and cascade placement.
- Taskbar with running apps + system tray + profile menu.

## Taskbar Items
- Start/launcher button (left).
- Running apps with active state + hidden badge.
- System tray: theme toggle, power button, profile menu.
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

## Additional Apps (MVP)
- Projects: featured projects (standalone view).
- Experience: focused timeline.
- Skills: matrix/table.
- Open Source: list of repos/contributions.
- Settings: theme toggle + wallpaper + dock/taskbar options.
- Terminal: command-driven navigation + easter egg hooks.

## Additional Apps (Later)
- Resume: PDF viewer + download CTA.
- Gallery: wallpaper/pixel art gallery.
- Notes: TL;DR + now/next/learning.
- Changelog: updates + latest work.
- Contact: richer profile card + links.

## Profile Menu (Taskbar)
- Resume (view/download).
- LinkedIn, GitHub, email, calendar.
- Theme toggle.
- Power button (shutdown easter egg).

## Background
- Pixelated art wallpaper with subtle animation (parallax or shimmer).
- Light/dark variants with matching palette.

## Theming
- Replace hardcoded colors with theme tokens from `packages/ui/src/styles.css`.
  Use `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`,
  `border-border`, `text-primary`, `bg-accent`, `ring-ring`, etc.
- Add a theme toggle in taskbar/profile menu.
- Respect `prefers-color-scheme` and persist selection.

## Animations
- Window open/close: scale + fade + slight translate.
- Focus: shadow/outline bump.
- Launcher hover/active: lift + glow.
- Background: slow drift + pixel shimmer.

## Not Found + Easter Eggs
- 404: “Lost & Found” window with Return to Desktop.
- Power button: iris-close animation to black; cancel on mouse move after 1s.
- Terminal commands: hidden apps or playful responses.

## Implementation Notes
- Keep launcher content-only; wrapper controls behavior.
- Use initial-only framing factories for default window placement.
- Avoid routing logic in UI packages; integrate in app layer.
