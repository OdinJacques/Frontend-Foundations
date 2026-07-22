# Why the Changes

Rationale for each of the 10 fixes applied (see `AI-changes/fix/` for the individual per-item plans and `AI-changes/plan-ai-assisted.md` for the original batch selection). Group A covers active bugs/security/test-correctness issues; Group B covers missing tooling/config scaffolding.

## Group A — Bugs, security & test correctness

1. **Rotate & stop tracking the committed API token.** A live GoRest bearer token was tracked in git with no `.gitignore` entry — anyone with repo access (including anyone who ever clones or forks it) could read and reuse it. Untracking it and adding a `.env.example` stops the bleeding going forward; rotating the actual token and scrubbing history are manual, external, higher-risk steps left to the repo owner.

2. **Fix broken import in `tests/API/posts.spec.ts`.** The file imported from a `dataApi/` module that never existed in the repo, so it couldn't compile or run at all. A broken test file provides zero coverage while looking like it exists — worse than no test, since it creates false confidence in CI dashboards that don't distinguish "skipped/broken" from "passing."

3. **Remove leftover `console.log` debug statements.** Each log was already redundant with a real `expect(...)` assertion running immediately before it — it added console noise without adding verification. Clean CI logs make real failures easier to spot.

4. **Replace the flaky wall-clock timing assertion.** Asserting `duration > 4000` against real elapsed time (network + browser overhead included) is a textbook flaky pattern — a slow CI runner could fail it for reasons unrelated to the app, and a fast one could pass it even if the "glitch" behavior broke. The behavioral assertion (user still logs in) is what actually matters and is what remains.

5. **Fix no-op assertion in `tests/about.spec.ts`.** `expect(...click())` with no matcher chained asserts nothing — it only confirmed the click promise didn't reject, which `await` alone already guarantees. Leaving it in place gave a false sense that the click was being verified.

## Group B — Tooling & config setup

6. **Add a `tsconfig.json`.** Without one, TypeScript strictness (or lack of it) was an accident of Playwright's default transform rather than a deliberate project decision. An explicit `strict: true` config makes type-safety guarantees intentional and consistent across contributors' machines and CI.

7. **Add and enforce ESLint + Prettier.** `.prettierrc` existed but nothing actually ran it — quote style had already drifted (single vs. double quotes across test files) despite the config mandating single quotes. Without a linter, dead code, unused imports, and `any`-typed footguns go uncaught. Wiring both up (plus a one-time `prettier --write .` pass) turns "we have a style guide" into "the style guide is enforced."

8. **Fill in empty `package.json` scripts + declare real dependencies.** `playwright` and `dotenv` were imported directly in API specs but only resolved as transitive dependencies — a clean/pruned `npm install` would have broken those tests with no warning. An empty `scripts` object also meant every contributor had to already know the raw `npx playwright test` incantation instead of running `npm test`.

9. **Centralize `baseURL`.** The site URL was hardcoded in two separate places (`basePage.ts` and `login.spec.ts`) while Playwright's own `baseURL` config sat commented out. Centralizing it means the whole suite can point at a different environment (staging, a PR preview, etc.) by changing one config value instead of hunting down every hardcoded string.

10. **Re-enable commented-out CI safety settings.** With `forbidOnly` disabled, a stray `test.only` accidentally left in a commit would silently narrow a CI run to one test while still reporting a green build — a common, hard-to-notice way for regressions to slip through. Re-enabling it (along with `retries`/`workers`, both still CI-conditional) restores a standard safety net without changing local development behavior.

## Notes from verification
- All of Group A was verified by running the actual affected specs (`login.spec.ts`, `about.spec.ts`, `posts.spec.ts`, `comments.spec.ts`) against the real target sites.
- `about.spec.ts` has one pre-existing, out-of-scope failure: the final content assertion expects marketing copy on saucelabs.com that has since changed. This is unrelated to fix 5 (confirmed via diff — that assertion line was untouched) and is left for separate triage.
- `npm run lint` surfaced 2 pre-existing unused-variable issues (`tests/API/posts.spec.ts:29`, `tests/home.spec.ts:83`) unrelated to any of the 10 items — left untouched to keep this batch scoped, now visible for future triage precisely because linting is finally wired up.
