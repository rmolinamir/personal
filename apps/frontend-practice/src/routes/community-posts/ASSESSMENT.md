# Community Posts Assessment (React + TypeScript)

This is a Coinbase-style 90-minute progressive frontend assessment.

## Constraints

- Use React + TypeScript
- Use only native `fetch`
- Use `useState`, `useEffect`, and controlled inputs
- Do not use React Query, Axios, Redux, Zustand, or form libraries

## API

- `GET https://jsonplaceholder.typicode.com/posts?_limit=15`
- `PATCH https://jsonplaceholder.typicode.com/posts/:id` with `{ title: string }`

## Progressive levels

1. Render static post cards
2. Add local interactions (search, sort, like/dislike)
3. Replace static data with fetched data + loading/error/empty states
4. Add PATCH mutation flow for updating title with per-row saving/error UI

## Minimum UI contract for tests

The tests look for these labels/texts:

- Heading: `Community Posts`
- Search textbox with accessible name containing `Search`
- Sort select with accessible name containing `Sort`
- Sort option values: `newest`, `oldest`
- Loading text containing `Loading`
- Error text containing `Something went wrong`
- Retry button labeled `Retry`
- Empty text containing `No posts found`
- Like/dislike buttons: `Like`, `Dislike`
- Reaction labels: `Likes: <count>`, `Dislikes: <count>`
- Edit flow labels:
  - button: `Edit Title`
  - input label containing `Title`
  - save button: `Save`
  - while saving button text: `Saving...`
  - inline mutation error text containing `Could not update post`

## Run the grader

From repo root:

```bash
pnpm --filter @acme/frontend-practice test -- src/routes/community-posts/-components/app.test.tsx
```

Passing all tests means your implementation is in strong interview shape for this problem format.
