# YourApp — React + TypeScript Admin Starter

A production-quality, mobile-first SPA built with Vite + React + TypeScript + TailwindCSS + Ant Design.
It ships with auth (mock OIDC), feature flags, i18n (EN/PT), API key management, usage analytics with charts, a docs/quickstart, and Playwright E2E tests.

<p align="center"> <em>Routes:</em> Dashboard · API Keys · Usage · Docs · Settings · Sign in/out </p>

## Table of Contents

- [Features](#features)
- [Tech Stack & Decisions](#tech-stack--decisions)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [App Details](#app-details)
  - [Auth (mock OIDC)](#auth-mock-oidc)
  - [Feature Flags & Theming](#feature-flags--theming)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [API Keys (client-only)](#api-keys-client-only)
  - [Usage & Analytics](#usage--analytics)
  - [Docs & Quickstart](#docs--quickstart)
  - [Testing (Playwright E2E)](#testing-playwright-e2e)
  - [Performance](#accessibility--performance)

## Features

- React + TypeScript SPA with routes: Dashboard, API Keys, Usage, Docs, Settings, Sign in/out, and 404
- Mobile-first layout (flex/grid + Tailwind), responsive cards and tables
- Auth (emulated OIDC): mock token stored in localStorage, expiry & auto-logout, protected routes
- Feature toggles (real, visible): compact density and brand color (Emerald/Indigo)
- i18n (EN/PT/FR): react-i18next + language detector + Ant Design/Day.js locale sync
- API key management (client-only): create → reveal once, copy, regenerate → reveal once, revoke, delete
- Usage & analytics: loads synthetic JSON, filter by date & key, Recharts area chart + AntD table
- Docs & quickstart: copy-ready snippets (cURL/Node/Python) with inline tips
- Playwright E2E: sign in, create key, regenerate/revoke, usage chart visible

## Tech Stack & Decisions

- **Vite + React + TS** — fast, modern DX and ESM-friendly
- **Ant Design** — mature admin components with tokens & density algorithm
- **TailwindCSS** — lightweight utility tokens; complements AntD
- **Recharts** — simple, declarative charts for dashboards
- **react-i18next** — proven i18n with lazy loading
- **Playwright** — reliable, cross-browser E2E testing

**Trade-offs:** Chart.js and ECharts are great alternatives; Recharts chosen for simplicity and React integration. Ant Design is a deliberate "batteries-included" choice for admin apps.

## Quick Start

Requirements: Node 18+ (or 20+ recommended), npm/pnpm/yarn.

```bash
# 1) Install deps
npm install

# 2) Start dev
npm run dev
# open http://localhost:5173

# 3) Run E2E (starts dev server automatically)
npm run test:e2e
```

Default credentials: any email + any password (mock auth accepts everything).

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

## Project Structure

```
src/
  auth/
    auth.ts                 # token helpers (mock)
    AuthProvider.tsx        # context + auto-logout
    RequireAuth.tsx        # route guard
  components/
    PageHeader.tsx
    LanguageSwitcher.tsx
    CodeSnippet.tsx
    InlineTip.tsx
  features/
    keys/                   # API keys
      types.ts
      storage.ts
      useApiKeys.ts
    usage/                  # Usage & analytics
      types.ts
      useUsageData.ts
      UsageFilters.tsx
      UsageChart.tsx
      UsageTable.tsx
    dashboard/
      useDashboard.ts
      KpiTile.tsx
      MiniArea.tsx
      StatusBars.tsx
  flags/
    FeatureFlagsProvider.tsx
  layouts/
    AppLayout.tsx
  pages/
    Dashboard.tsx
    ApiKeys.tsx
    Usage.tsx
    Docs.tsx
    Settings.tsx
    SignIn.tsx
    SignOut.tsx
    NotFound.tsx
  i18n.ts
  locale/antd.ts
  main.tsx
  App.tsx
public/
  locales/
    en/{common,dashboard,usage,docs,settings}.json
    pt/{common,dashboard,usage,docs,settings}.json
  data/usage.{json|csv}     # synthetic dataset
tests/
  e2e.spec.ts               # Playwright tests

````

## Configuration

- **i18n languages**: Add/edit JSON files under `public/locales/{lng}` and register in `src/i18n.ts`
- **Brand tokens**: Set via Settings (feature flags). Updates `colorPrimary`, `borderRadius`, and density
- **Usage data**: Switch JSON/CSV in `src/pages/Usage.tsx` - `useUsageData('json')` → or 'csv'

## Available Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

## App Details

### Auth (mock OIDC)

- `auth/auth.ts` stores fake token `{ accessToken, exp, user }` in localStorage (1h)
- `AuthProvider` syncs token across tabs and auto-signs out on expiry
- `RequireAuth` protects routes; redirects to /signin with return path

### Feature Flags & Theming

`flags/FeatureFlagsProvider.tsx` persists:
- `compact`: boolean → AntD compactAlgorithm
- `brand`: 'emerald'|'indigo' → colorPrimary

### Internationalization (i18n)

- react-i18next + browser detector + http backend
- AntD locale and Day.js follow current language
- Language switcher in header and Settings

### API Keys (client-only)

- Create → reveal once (modal), store masked
- Regenerate → reveal once
- Revoke → mark as revoked
- Delete → hard remove
- Persisted in localStorage

### Usage & Analytics

- Loads from `/public/data/usage.json` (or .csv)
- Filters: date range and key
- Components:
  - UsageChart (Recharts area)
  - UsageTable (AntD) with status tags
  - Empty/error states via AntD Result

### Docs & Quickstart

- cURL / Node / Python snippets with copy
- 401/CORS inline tips
- Configurable `BASE_URL` and `ENDPOINT`

### Testing (Playwright E2E)

Install:
```bash
npm i -D @playwright/test
npx playwright install
```

Run:
```bash
npm run test:e2e   # headless
npm run test:e2e:ui
```

Coverage:
- Sign in → Dashboard layout
- Create API key → reveal → table
- Regenerate/revoke → success
- Usage chart + table visible

Data-testid hooks:
- `signin-email`, `signin-password`, `signin-submit`
- `keys-label-input`, `keys-create-btn`, `keys-table`
- `keys-reveal-modal`, `keys-reveal-full`
- `keys-regenerate-btn-*`, `keys-revoke-btn-*`
- `usage-chart`, `usage-table`

### Accessibility & Performance

- **Responsive**: Mobile-first, stacking → grid
- **Performance**: Vite HMR, code-split routes, optimized charts
