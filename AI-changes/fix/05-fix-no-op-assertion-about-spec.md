# Fix 5: Fix no-op assertion in tests/about.spec.ts

## Problem

`tests/about.spec.ts:20`:

```ts
await expect(page.getByRole('link', { name: 'About' }).click());
```

`expect()` here just wraps and awaits the promise returned by `.click()` — there's no matcher chained (no `.resolves`, no `.toBe...`), so this asserts nothing beyond "the promise didn't reject." Reads as a copy-paste mistake.

## Change

Replace with a plain awaited click, since the real assertions already follow (URL and page content checks):

```ts
await page.getByRole('link', { name: 'About' }).click();
```

## Verification

- `npx playwright test tests/about.spec.ts` — the click now behaves correctly and navigation to saucelabs.com still succeeds (`toHaveURL(/saucelabs\.com/)` passes). The final `toContainText("The World's Only Full-Lifecycle AI-Quality Platform")` assertion fails, but this is pre-existing and unrelated to this fix: the live saucelabs.com marketing page copy has since changed and no longer contains that exact string (confirmed via `git diff`, which shows that assertion line is byte-for-byte unchanged by this fix). Updating that assertion to match the current page content is outside the scope of this 10-item batch and left for separate triage.
- No bare `expect(...)` wrapping a non-assertion call remains in the file.
