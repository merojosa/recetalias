# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev               # Start dev server (http://localhost:5173)
pnpm decap:local       # Run Decap CMS with local backend
pnpm build             # Production build → ./build
pnpm preview           # Preview built site (http://localhost:4173)
pnpm lint              # Run svelte-check + Prettier + ESLint
pnpm format            # Auto-format with Prettier
pnpm test              # Run E2E tests (Playwright)
pnpm test:e2e          # Same as above
pnpm playwright test e2e/homepage.test.ts  # Run a single test file
```

Deployment (requires `.env` with `AWS_PROFILE` and `PULUMI_CONFIG_PASSPHRASE`):
```bash
pnpm sso               # Refresh AWS SSO credentials
pnpm deploy:local      # Login to Pulumi + deploy to AWS
```

## Architecture

**Recetalias** is a fully static SvelteKit site. All content lives in JSON files under `src/lib/data/` — there is no database. Git acts as the backend; Decap CMS commits changes to those JSON files.

### Data flow

1. **Content**: `recipes.json` and `ingredients.json` in `src/lib/data/` are the source of truth.
2. **Validation**: Valibot schemas in `src/lib/schemas/recipe.ts` validate the JSON at route load time.
3. **Build**: SvelteKit pre-renders all routes to static HTML via `@sveltejs/adapter-static`. A custom Vite plugin generates `sitemap.xml`.
4. **Deploy**: Pulumi (`infra/index.ts`) syncs `./build` to S3 and invalidates CloudFront cache.
5. **Runtime**: The homepage loads the JSON, then filters recipes client-side using Svelte 5 runes. Ingredient checklist state is persisted to `sessionStorage`.

### Key paths

- `src/routes/+page.svelte` — Homepage with recipe search/filter UI
- `src/routes/recetas/[id]/+page.svelte` — Recipe detail page
- `src/routes/recetas/[id]/+page.ts` — Route loader with Valibot validation and `entries()` for prerendering
- `src/lib/data/` — `recipes.json`, `ingredients.json`
- `src/lib/schemas/recipe.ts` — Valibot schemas (`RecipeSchema`, `RecipesFileSchema`)
- `src/lib/components/ui/` — shadcn-svelte base components
- `infra/index.ts` — Pulumi AWS infrastructure (S3, CloudFront, ACM)
- `e2e/` — Playwright E2E tests

## Code Style

- **Indentation**: Tabs; single quotes; no trailing commas; 100-char line width
- **Imports**: Use `$lib/` alias for `src/lib/` (e.g., `import recipes from '$lib/data/recipes.json'`)
- **TypeScript**: Strict mode. Explicit types, no `any`. Export types with `type` keyword.
- **Svelte**: Use Svelte 5 runes (`$state`, `$derived`, `$effect`). No legacy Options API.
- **Validation**: Valibot — import as `import * as v from 'valibot'`
- **Styling**: TailwindCSS v4. Use `cn()` from `$lib/utils` for conditional class merging.
- **UI Components**: Prefer bits-ui/shadcn composition over custom prop-heavy components.
- **Prerendering**: Static routes use `export const prerender = true` + `entries()` generator.
