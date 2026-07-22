# Fix 8: Fill in empty package.json scripts + declare real dependencies

## Problem

- `package.json`'s `scripts` is `{}` — no `test`, `lint`, `format`, or `typecheck` entries; contributors have to know the raw `npx playwright test` invocation.
- `playwright` and `dotenv` are imported directly in all `tests/API/*.spec.ts` files but aren't declared in `package.json` — they only resolve today as transitive `node_modules` dependencies, which would break on a clean/pruned install.
- `@dotenvx/dotenvx` is declared and documented in the README as the env-management tool, but the code never actually imports it — it uses plain `dotenv.config()` instead.
- Fix 6 added `tsconfig.json` but `typescript` itself isn't declared as a dependency, so `tsc`/`typecheck` isn't reproducible outside a machine that happens to have it cached.

## Change

In `package.json`:

1. Add scripts:
   ```json
   "scripts": {
     "test": "playwright test",
     "lint": "eslint .",
     "format": "prettier --write .",
     "typecheck": "tsc --noEmit"
   }
   ```
2. Add explicit devDependencies: `playwright`, `dotenv`, `typescript` (alongside the ESLint/Prettier deps added in fix 7). `typescript` is pinned to `^5.9.3` rather than the newest `7.x` because `typescript-eslint@8.65.0` (added in fix 7) declares a peer range of `>=4.8.4 <6.1.0` — installing latest `typescript` breaks `npm install` with an `ERESOLVE` conflict.
3. Remove `@dotenvx/dotenvx` — it's unused in code, and the codebase already has a working, simpler `dotenv` + `.env` setup. (Alternative would be migrating the API specs to `@dotenvx/dotenvx`, but that's a larger behavior change than this fix's scope; removing the unused/mismatched dependency is the minimal correct fix.)

## Verification

- `npm install` succeeds and resolves `playwright`, `dotenv`, `typescript`, `eslint`, `prettier`, `typescript-eslint`, `eslint-config-prettier` as direct devDependencies.
- `npm test`, `npm run lint`, `npm run format -- --check`, `npm run typecheck` all run (using the scripts instead of raw `npx` invocations).
- README's claim of using `@dotenvx/dotenvx` is now inconsistent with `package.json` — tracked as a documentation follow-up (item 19 in the original review, out of scope for this batch of 10).
