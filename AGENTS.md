# Agent Guidelines for Recetalias

## Build/Lint/Test Commands

- Dev: `pnpm dev` (or `npm run dev`)
- Build: `pnpm build`
- Type check: `pnpm check` (or `pnpm check:watch` for watch mode)
- Lint: `pnpm lint` (runs Prettier and ESLint)
- Format: `pnpm format`
- No test suite configured currently

## Code Style

- **Formatting**: Tabs for indentation, single quotes, no trailing commas, 100 char width
- **Imports**: Use `$lib/` path alias for src/lib imports (e.g., `import foo from '$lib/test-data/recipes.json'`)
- **TypeScript**: Strict mode enabled. Use explicit types, avoid `any`
- **Files**: `.svelte` for components, `.ts` for logic, `.svx` for markdown components
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Framework**: SvelteKit with Svelte 5, TailwindCSS v4, mdsvex for markdown
- **Error handling**: Throw errors for invalid states (e.g., `throw new Error('Recipe not found')`)
- **Prerendering**: Use `export const prerender = true` for static routes
