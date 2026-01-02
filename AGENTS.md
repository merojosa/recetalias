# Agent Guidelines for Recetalias

## Build/Lint/Test Commands

- Dev: `pnpm dev` (or `npm run dev`)
- Build: `pnpm build`
- Type check: `svelte-check --tsconfig ./tsconfig.json`
- Lint: `pnpm lint` (runs svelte-check, Prettier, and ESLint)
- Format: `pnpm format`
- Preview: `pnpm preview`
- Test: `pnpm test` or `pnpm test:e2e` (Playwright E2E tests)
- Test single file: `pnpm playwright test e2e/demo.test.ts`

## Code Style

- **Formatting**: Tabs for indentation, single quotes, no trailing commas, 100 char width
- **Imports**: Use `$lib/` path alias for src/lib imports (e.g., `import foo from '$lib/data/recipes.json'`)
- **TypeScript**: Strict mode enabled. Use explicit types, avoid `any`. Export types with `type` keyword
- **Files**: `.svelte` for components, `.ts` for logic/loaders, `.svx` for markdown components
- **Naming**: camelCase for variables/functions, PascalCase for components/types/schemas
- **Framework**: SvelteKit with Svelte 5 (use runes: `$state`, `$derived`, `$effect`), TailwindCSS v4
- **Validation**: Use Valibot for schemas (import as `import * as v from 'valibot'`)
- **Error handling**: Throw errors for invalid states (e.g., `throw new Error('Recipe not found')`)
- **Prerendering**: Use `export const prerender = true` for static routes with `entries` generator
- **UI Components**: bits-ui based components in `$lib/components/ui/` - prefer composition over props
- **Utils**: Use `cn()` from `$lib/utils` for conditional class merging (clsx + tailwind-merge)

## Output Format

- **Be extremely concise. Sacrifice grammar for the sake of concision**
