# Fix 6: Add a tsconfig.json

## Problem

No `tsconfig.json` exists anywhere in the repo. TypeScript behavior (strictness, module resolution, target) relies entirely on Playwright's internal default transform rather than an explicit, reviewable project decision.

## Change

Add a root `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "lib": ["ES2021"],
    "types": ["node", "@playwright/test"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

- `module`/`target` match the project's `"type": "commonjs"` in `package.json`.
- `strict: true` turns on `noImplicitAny`, strict null checks, etc. — matches the "fresh scaffolding" intent rather than silently relying on defaults.

## Verification

- `npx tsc --noEmit` (once the `typecheck` script from fix 8 exists: `npm run typecheck`) reports no new errors introduced by adding the config — if `strict` mode does surface pre-existing type issues, they should be triaged separately rather than silently loosened.
