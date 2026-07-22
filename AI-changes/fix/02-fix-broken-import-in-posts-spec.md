# Fix 2: Fix broken import in tests/API/posts.spec.ts

## Problem

`tests/API/posts.spec.ts:5` imports `userData` from `../../dataApi/user`:

```ts
import { userData } from '../../dataApi/user';
```

No `dataApi/` directory exists anywhere in the repo, so this spec file cannot compile or run.

## Change

Define `userData` locally in `posts.spec.ts`, following the exact pattern already used in `tests/API/comments.spec.ts` and `tests/API/toDos.spec.ts`:

```ts
import { User } from '../../Interface/user';

const userData: User = {
  name: Math.random().toString(36).substring(2, 15),
  email: Math.random().toString(36).substring(2, 15) + '@example.com',
  gender: 'male',
  status: 'active',
};
```

Remove the broken `dataApi/user` import.

## Verification

- `npx playwright test tests/API/posts.spec.ts --list` resolves without a module-not-found error.
- `npx playwright test tests/API/posts.spec.ts` runs (requires a valid `.env` with `baseURL`/`token`).
