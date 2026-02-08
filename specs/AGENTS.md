# Agent Guide

Purpose
- Provide build, lint, test, and style guidance for agentic coding tools.
- Keep this file updated as workflows or tooling change.
- This repo uses pnpm workspaces and Turbo for orchestration.

Repo layout
- apps/web: Vite + TanStack React Start app.
- apps/storybook: Storybook (Vite) for UI demos.
- packages/ui: Component library and OS UI primitives.
- tooling/tsconfig: Shared TS configs.
- specs: Planning and architecture notes.

Command runner
- Use pnpm (packageManager: pnpm@10.28.2) and Node >= 25.
- Prefer running commands from repo root unless noted.
- For package-specific commands, use pnpm filters.

Build commands
- Full build: `pnpm build` (turbo run build).
- Build web app: `pnpm --filter @acme/web build`.
- Build Storybook: `pnpm --filter @acme/storybook build`.

Dev commands
- Workspace dev watch: `pnpm dev` (turbo watch dev).
- Web dev server: `pnpm --filter @acme/web dev` (Vite on 3000).
- Storybook dev: `pnpm --filter @acme/storybook dev` (Storybook on 6006).

Lint/format/check
- Repo check (format + lint): `pnpm check` (turbo run check -- --write --unsafe).
- Format single package: `pnpm --filter @acme/ui format`.
- Lint single package: `pnpm --filter @acme/ui lint`.
- Biome check (non-writing): `pnpm --filter @acme/ui check`.

Typecheck
- Full typecheck: `pnpm typecheck` (turbo run typecheck).
- Package typecheck: `pnpm --filter @acme/ui typecheck`.

Tests
- Run all tests in a package: `pnpm --filter @acme/ui test`.
- Run a single test file: `pnpm --filter @acme/ui test -- path/to/file.test.ts`.
- Run a single test name: `pnpm --filter @acme/ui test -- -t "test name"`.
- Web tests: `pnpm --filter @acme/web test` (Vitest).
- Storybook tests: `pnpm --filter @acme/storybook test` (Vitest).

Clean
- Clean repo: `pnpm clean` (turbo run clean + git clean).
- Clean a package: `pnpm --filter @acme/ui clean`.

Package manager hygiene
- Postinstall runs `pnpm dependencies:check` (sherif).
- Fix dependency alignment: `pnpm dependencies:fix`.

Formatting rules
- Biome is the formatter/linter. Do not run Prettier.
- Indent: 2 spaces (EditorConfig).
- Quotes: double quotes in JS/TS (Biome).
- Keep files LF and trim trailing whitespace (EditorConfig).

Imports
- Biome organizes imports; keep them sorted.
- Use `import type` for type-only imports.
- Prefer relative imports inside a package; workspace packages use `@acme/*`.
- Keep React as `import * as React from "react"` in components.

TypeScript
- Strict mode is on everywhere (`strict: true`).
- Avoid unused locals/params; TS will error.
- Use `satisfies` for structural checks when helpful.
- Prefer explicit return types for exported functions when non-obvious.
- Avoid `any`; use unions or generics.

Lint rules to respect
- No unused imports or variables.
- No parameter reassignment.
- No `process.env` except in `env.ts` or `drizzle.config.ts`.
- `console` allowed only: `debug`, `info`, `warn`, `error`.
- Prefer self-closing elements where possible.
- `useDefaultParameterLast`, `useSingleVarDeclarator`, `useAsConstAssertion` enforced.

React/TSX conventions
- Function components with hooks; avoid classes.
- Use `React.useMemo`, `React.useCallback`, and `React.useId` per existing patterns.
- Keep component props as `type` aliases (common in this repo).
- Keep JSX concise and extract utilities when logic grows.

Naming conventions
- Components/types: PascalCase (`WindowManager`, `WindowProps`).
- Variables/functions: camelCase (`toggleHidden`).
- Files: kebab-case in `packages/ui/src/os` and components (`window-manager.tsx`).
- Constants: camelCase; use `UPPER_SNAKE` only for truly global constants.

CSS/Tailwind
- Tailwind is used for styling; class names often composed with `cn`.
- `useSortedClasses` is enabled (info-level); keep class ordering tidy.
- Prefer `className={cn("...", className)}` patterns for composition.

Error handling
- Use early returns and explicit null checks (strict + noUncheckedIndexedAccess).
- Avoid swallowing errors; prefer surfacing in logs or returning `null`/`undefined`.
- For state updates, use functional updates to avoid stale closures.

State management patterns
- Contexts are used for OS/windowing features.
- Window manager data is stored in maps + arrays; update immutably.
- Keep derived selectors in hooks or helpers (e.g., `getWindowData`).

Testing conventions
- Tests use Vitest; colocate tests near features when possible.
- Prefer `@testing-library/react` for UI behavior.
- Single-test workflows should use `-t` or file paths.

Storybook conventions
- Story files live in `apps/storybook/src/**`.
- Use package components from `@acme/ui` and keep stories focused.

Spelling
- Spellcheck config: `cspell.config.yaml`. Add project terms if needed.

Cursor/Copilot rules
- No `.cursor/rules`, `.cursorrules`, or `.github/copilot-instructions.md` found.

Specs folder note
- Update specs when behaviors/APIs change.
- Keep specs short, direct, and linked to code when useful.
