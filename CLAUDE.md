# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build` (runs `tsc -b && vite build`)
- **Lint:** `pnpm lint` (ESLint with TypeScript + React hooks rules)
- **Format:** `pnpm format` (Prettier — write) / `pnpm format:check` (check only)
- **Preview production build:** `pnpm preview`

## Tech Stack

- React 19 + TypeScript, built with Vite 8
- Tailwind CSS v4 (integrated via `@tailwindcss/vite` plugin, not PostCSS)
- pnpm as the package manager
- ESLint flat config with typescript-eslint, react-hooks, and react-refresh plugins
- Prettier for formatting, with `eslint-config-prettier` to disable conflicting ESLint rules

## Pre-commit Hooks

Husky + lint-staged run on every commit in this order:

1. **Format** staged files with Prettier
2. **Lint** staged `.ts`/`.tsx` files with ESLint (with `--fix`)
3. **Build** the full project (`tsc -b && vite build`)

If any step fails, the commit is aborted.

## Architecture

Single-page React app. Entry point is `src/main.tsx` which renders `<App />` into `#root`. Styling uses Tailwind CSS plus component-level CSS files (`App.css`, `index.css`). Static assets live in `public/` and `src/assets/`.
