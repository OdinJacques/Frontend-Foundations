# Fix 10: Re-enable commented-out CI safety settings

## Problem
`playwright.config.ts` has `forbidOnly`, `retries`, and `workers` all commented out:
```ts
//forbidOnly: !!process.env.CI,
//retries: process.env.CI ? 2 : 0,
//workers: process.env.CI ? 1 : undefined,
```
Without `forbidOnly` in CI, a stray `test.only` left in a spec file would silently skip the rest of the suite while still reporting green.

## Change
Uncomment the three settings so they're active (all still conditional on `process.env.CI`, so local runs are unaffected):
```ts
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

## Verification
- Locally (`CI` unset): behavior unchanged — `test.only` still works for local debugging, no forced retries, default worker count.
- With `CI=true npx playwright test --list`: a `test.only` in a spec would now cause Playwright to error out instead of silently narrowing the run.
