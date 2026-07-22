# Fix 3: Remove leftover console.log debug statements

## Problem

Debug `console.log` calls left in test code, not asserted on, just clutter CI logs:

- `tests/login.spec.ts:56`
- `tests/API/posts.spec.ts:83,103,123` (renumbered after fix 2's import change; originally reported at 75/95/115)
- `tests/API/comments.spec.ts:110,127`

In every case, the log statement sits immediately after a real `expect(...)` assertion already covering the same response — the log added no verification value, only noise.

## Change

Delete each `console.log(...)` call. No assertion logic changes are needed since a proper `expect(responseBody).toEqual(...)` (or equivalent) already runs immediately before each log line in `posts.spec.ts`/`comments.spec.ts`. (`login.spec.ts:56`'s log is handled together with the timing assertion rework in fix 4.)

## Verification

- `grep -rn "console.log" tests/` returns no matches in `login.spec.ts`, `posts.spec.ts`, `comments.spec.ts`.
- Existing assertions in the affected tests are unchanged and still pass.
