# Recetalias

## About

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/) (using runes)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn-svelte](https://www.shadcn-svelte.com/)
- **Validation**: [Valibot](https://valibot.dev/)
- **Content Management**: [Decap CMS](https://decapcms.org/)
- **Type Checking**: TypeScript (strict mode)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/)

## Getting Started

### Installation

Install dependencies:

```sh
pnpm install
```

### Development

Start the development server:

```sh
pnpm dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Decap CMS Local Development

To run Decap CMS with a local backend for content management:

```sh
pnpm decap:local
```

This starts a local server that allows you to test CMS functionality without deploying.
