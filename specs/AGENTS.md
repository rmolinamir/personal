# Specs Guide

Purpose
- Explain how to work with the spec files in this repo.
- Keep specs aligned with shipped behavior.
- Use specs as the source of truth for product intent.

What lives here
- Primary product spec: `specs/personal-website.md`.
- Roadmap: `specs/roadmap.md`.
- Any future specs should follow the same structure and tone.

How to use specs
- Read the primary spec before making product or UX changes.
- Treat the roadmap as the backlog and priority signal.
- Prefer updating specs in the same PR as behavior changes.

When to update specs
- New features, removals, or changes in behavior.
- Scope shifts (MVP vs later work).
- Visual direction changes or interaction changes.

Writing guidelines
- Keep it high level; avoid implementation details.
- Use clear, short sections with bullet points.
- Reference code locations only when it clarifies ownership.
- Avoid date-based or environment-specific statements.

Completion and archive
- When a spec is complete, note completion in `specs/roadmap.md`.
- If a spec is retired, move it to `specs/archive/` and leave a short pointer.

Notes
- Specs are for humans first; keep them readable and concise.
