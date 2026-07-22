# Fix 7: Add and enforce ESLint + Prettier

## Problem

No ESLint config or dependency exists at all. `.prettierrc` exists but `prettier` itself isn't a declared dependency, there's no `format`/`lint` script, and quote style is already inconsistent across test files (single vs. double quotes) despite `.prettierrc` mandating `singleQuote: true`. Nothing currently catches dead code, `any` usage, unused imports, or style drift.

## Change

1. Add devDependencies: `eslint`, `typescript-eslint`, `eslint-config-prettier`, `prettier`.
2. Add a flat `eslint.config.js` at the repo root covering all `.ts` files (`locators/`, `pages/`, `tests/`, `types/`, `Interface/`), using `typescript-eslint`'s recommended rules and `eslint-config-prettier` to disable any formatting rules that would conflict with Prettier:
   ```js
   const tseslint = require('typescript-eslint');
   const eslintConfigPrettier = require('eslint-config-prettier');

   module.exports = tseslint.config(
     {
       ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'],
     },
     ...tseslint.configs.recommended,
     eslintConfigPrettier
   );
   ```
3. `lint`/`format` npm scripts are added together with the rest of `package.json`'s scripts in fix 8 (same file, avoiding two separate diffs to `scripts`).
4. Run `npx prettier --write .` once across the repo to normalize the existing quote-style/indentation drift called out in the original review (not a separate numbered item, but a natural side effect of actually wiring Prettier up).

## Verification

- `npm run lint` runs (config itself is clean) and currently surfaces 2 pre-existing `@typescript-eslint/no-unused-vars` findings unrelated to any of the 10 scoped items — `tests/API/posts.spec.ts:29` (`createdPostId`) and `tests/home.spec.ts:83` (`page`). These are left for separate triage rather than silently fixed here, to keep this batch scoped to the 10 approved items.
- `npm run format -- --check` reports the repo as already formatted after the one-time `prettier --write .` pass.
