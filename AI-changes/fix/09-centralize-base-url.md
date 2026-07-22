# Fix 9: Centralize baseURL instead of hardcoding it

## Problem
`https://www.saucedemo.com` is hardcoded in two separate places:
- `pages/basePage.ts:22` — `await this.page.goto(\`https://www.saucedemo.com${path}\`);`
- `tests/login.spec.ts:120` — `await page.goto('https://www.saucedemo.com/inventory.html');`

while `playwright.config.ts:19` has `baseURL` commented out (`//baseURL : ''`). The suite can't target another environment (e.g. staging) without editing code in multiple places.

## Change
1. `playwright.config.ts`: set `use.baseURL` to an env-driven value defaulting to the current site:
   ```ts
   use: {
     baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
     ...
   }
   ```
2. `pages/basePage.ts:21-23`: use the relative path via Playwright's `baseURL` instead of hardcoding the domain:
   ```ts
   async navigate(path: string = '') {
     await this.page.goto(path);
   }
   ```
3. `tests/login.spec.ts:120`: use a relative path:
   ```ts
   await page.goto('/inventory.html');
   ```

## Verification
- `npx playwright test tests/login.spec.ts` still passes — navigation still resolves to `https://www.saucedemo.com/...` via the configured `baseURL`.
- Setting `BASE_URL` to a different value (e.g. in `.env`/CI) would redirect the whole suite without touching `basePage.ts` or `login.spec.ts`.
