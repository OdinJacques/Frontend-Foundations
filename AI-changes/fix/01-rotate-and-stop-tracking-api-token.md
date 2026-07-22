# Fix 1: Rotate & stop tracking the committed API token

## Problem

`.env` (repo root) is tracked in git — added in commit `4fe1a54` ("Api creation") — and contains a live-looking GoRest bearer token:

```
baseURL = "https://gorest.co.in/"
token = 6e4c66c859e4b658e659862d6c1fd3284d243d82cf4044cd793cb4a8f4e022e6
```

`.gitignore` only excludes Playwright artifacts (`node_modules/`, `/test-results/`, etc.) — it never excludes `.env`.

## Change

1. Add `.env` to `.gitignore`.
2. Untrack `.env` from git (`git rm --cached .env`) so it stays on disk locally but stops being committed going forward.
3. Add a `.env.example` with placeholder keys so contributors know what to set up locally, without a real secret.

## Explicitly out of scope (manual follow-ups for the repo owner)

- **Rotating the real token** on the GoRest account — this is an external action outside the codebase that only the account owner can perform.
- **Rewriting git history** to purge the token from past commits (e.g. `git filter-repo`) — this rewrites commit hashes and requires a force-push to any shared remote. It's destructive enough that it needs its own explicit go-ahead rather than being bundled into this fix.

## Verification

- `git status` shows `.env` as untracked (or listed under "Changes to be committed: deleted" for the cached removal) and no longer appears in `git ls-files`.
- `git ls-files | grep .env` returns nothing (or only `.env.example`).
- Local `.env` file still exists on disk with working credentials so tests keep running locally.
