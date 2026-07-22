# AI-Assisted Change Plan

Scope: 10 items selected from a full-repo review, covering active bugs/security issues (Group A) and missing tooling/config scaffolding (Group B). Ordered so broken/live issues are fixed before scaffolding is added.

## Group A — Bugs, security & test correctness

### 1. Rotate & stop tracking the committed API token

- **Files:** `.env`, `.gitignore`
- **Problem:** `.env` is tracked in git (added in commit `4fe1a54`) and contains a live-looking GoRest bearer token. `.gitignore` never excludes `.env`.
- **Change:**
  - Rotate/revoke the current token at the source (GoRest account).
  - Add `.env` to `.gitignore`.
  - Remove `.env` from git tracking (`git rm --cached .env`) — note history still contains it; a full history scrub (e.g. `git filter-repo`) is a separate, more disruptive step to confirm with the user before running.
  - Commit a `.env.example` with placeholder keys (`baseURL`, `token`) so contributors know what to set locally.

### 2. Fix broken import in `tests/API/posts.spec.ts`

- **File:** `tests/API/posts.spec.ts:5`
- **Problem:** `import { userData } from '../../dataApi/user'` — `dataApi/` doesn't exist anywhere in the repo, so the file can't compile/run.
- **Change:** Determine the intended source of `userData` (likely the random-data generator pattern already duplicated in `comments.spec.ts`/`toDos.spec.ts`) and either import from the correct existing location or define it locally in the file, matching the pattern used by the other API spec files.

### 3. Remove leftover `console.log` debug statements

- **Files:** `tests/login.spec.ts:56`; `tests/API/posts.spec.ts:75,95,115`; `tests/API/comments.spec.ts:110,127`
- **Problem:** Debug output left in test code, not asserted on.
- **Change:** Delete the `console.log` calls. Where they were logging error/response bodies on a failure path, replace with a real assertion (e.g. `expect(response.ok(), \`unexpected response: ${responseBody}\`).toBeTruthy()`) so the diagnostic info surfaces in the failure message instead of stdout.

### 4. Replace the flaky wall-clock timing assertion

- **File:** `tests/login.spec.ts:49-58`
- **Problem:** `expect(duration).toBeGreaterThan(4000)` asserts on real elapsed wall-clock time around a login flow — flaky under CI load/slow runners.
- **Change:** Keep the behavioral assertion (`performance_glitch_user` still logs in and lands on `/inventory`) but drop the hard timing threshold, or loosen/replace it with a mechanism less sensitive to runner speed (e.g. asserting a loading indicator appears, or removing the timing assertion entirely if the behavior check is sufficient).

### 5. Fix no-op assertion in `tests/about.spec.ts`

- **File:** `tests/about.spec.ts:20`
- **Problem:** `await expect(page.getByRole("link", { name: "About" }).click());` wraps `.click()` in `expect()` with no matcher — asserts nothing.
- **Change:** Replace with `await page.getByRole("link", { name: "About" }).click();`. If a post-click assertion was intended, add an explicit one (e.g. URL/heading check) after the click.

## Group B — Tooling & config setup

### 6. Add a `tsconfig.json`

- **File:** new `tsconfig.json` at repo root
- **Problem:** No `tsconfig.json` exists; TS behavior relies entirely on Playwright's default transform (no explicit `strict`, `noImplicitAny`, etc.).
- **Change:** Add a `tsconfig.json` with `strict: true`, appropriate `target`/`module` for Playwright (`ES2020`+, `commonjs` per `package.json`'s `"type": "commonjs"`), and `types: ["node", "@playwright/test"]`. Run the suite afterward to confirm nothing regresses under stricter checking.

### 7. Add and enforce ESLint + Prettier

- **Files:** new `eslint.config.js` (flat config), `package.json`
- **Problem:** No ESLint config/dependency exists. `.prettierrc` exists but `prettier` isn't a declared dependency, and quote style is already inconsistent across test files despite `.prettierrc` mandating single quotes.
- **Change:**
  - Add `eslint`, `typescript-eslint`, `eslint-config-prettier`, and `prettier` as devDependencies.
  - Add a flat `eslint.config.js` covering `.ts` files in `locators/`, `pages/`, `tests/`, `types/`, `Interface/`.
  - Add `lint` and `format` scripts to `package.json` (see item 8).
  - Run `prettier --write` once across the repo to normalize existing quote-style/indentation drift (flagged in the broader review as items 11/18, out of scope for this 10 but this pass will incidentally fix the surface-level formatting).

### 8. Fill in empty `package.json` scripts + declare real dependencies

- **File:** `package.json`
- **Problem:** `scripts` is `{}`. `playwright` and `dotenv` are imported directly in `tests/API/*.spec.ts` but not declared (only present as transitive `node_modules` deps). `@dotenvx/dotenvx` is declared/documented but never actually imported (code uses plain `dotenv.config()`).
- **Change:**
  - Add scripts: `"test": "playwright test"`, `"lint": "eslint ."`, `"format": "prettier --write ."`, `"typecheck": "tsc --noEmit"`.
  - Add `playwright` and `dotenv` as explicit devDependencies (versions matching what's already resolved in `package-lock.json`).
  - Reconcile `@dotenvx/dotenvx`: either switch the API spec files to actually use it, or remove it from `package.json`/README if plain `dotenv` is the intended approach.

### 9. Centralize `baseURL`

- **Files:** `playwright.config.ts:19`, `pages/basePage.ts:22`, `tests/login.spec.ts:124`
- **Problem:** `https://www.saucedemo.com` is hardcoded in two separate places while `playwright.config.ts`'s `baseURL` option is commented out.
- **Change:** Set `use: { baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com' }` in `playwright.config.ts`. Update `pages/basePage.ts:22` to `await this.page.goto(path)` (relative, relying on `baseURL`). Update `tests/login.spec.ts:124` similarly to a relative path.

### 10. Re-enable commented-out CI safety settings

- **File:** `playwright.config.ts` (lines ~10, 12, 14)
- **Problem:** `forbidOnly`, `retries`, and `workers` are commented out — a stray `test.only` would silently pass in CI.
- **Change:** Uncomment and set the standard CI-conditional pattern:
  ```ts
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  ```

## Verification

- After items 1–5: run `npx playwright test tests/login.spec.ts tests/about.spec.ts tests/API/posts.spec.ts` to confirm the previously-broken/flaky specs now pass reliably.
- After items 6–8: run `npm run typecheck`, `npm run lint`, and `npm run format -- --check` to confirm the new tooling is wired up and the repo is currently clean (or fix any newly-surfaced violations).
- After items 9–10: run the full suite (`npm test`) once to confirm `baseURL` centralization didn't break navigation, and inspect `playwright.config.ts` to confirm the CI-conditional settings are active.
