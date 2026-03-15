# Task Queue Assessment (React + TypeScript)

This is a 90-minute frontend practice assessment with a CodeSignal-style test harness.

## Goal

Build a Task Queue page in `src/routes/task-queue/-components/app.tsx` that uses:

- `useState`
- `useEffect`
- controlled inputs
- native `fetch`

Do not use React Query, Axios, Redux, Zustand, or form libraries.

## API

- `GET https://jsonplaceholder.typicode.com/todos?_limit=20`
- `PATCH https://jsonplaceholder.typicode.com/todos/:id` with `{ completed: boolean }`

## Progressive levels

1. Render static task UI
2. Add local search/filter interactions
3. Replace static data with fetched data + loading/error/empty states
4. Add PATCH mutation flow with per-row saving/error UI and in-place updates

## Minimum UI contract for tests

These labels/texts are what the tests look for:

- Heading: `Task Queue`
- Search textbox with accessible name containing `Search`
- Status select with accessible name containing `Status`
- Status options values: `all`, `open`, `completed`
- Loading text containing `Loading`
- Error text containing `Something went wrong`
- Retry button labeled `Retry`
- Empty text containing `No tasks found`
- Row action button labels:
  - incomplete task: `Mark Complete`
  - complete task: `Reopen`
  - while saving: `Saving...`
- Inline PATCH error text containing `Could not update task`

## Run the grader

From repo root:

```bash
pnpm --filter @acme/coinbase test -- src/routes/task-queue/-components/app.test.tsx
```

If all tests pass, your implementation is in strong interview shape for this problem style.
