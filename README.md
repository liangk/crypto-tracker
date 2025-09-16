# Crypto Price Tracker (TypeScript, Vite)

A modern React + TypeScript app for tracking cryptocurrency prices with live updates, search, favorites, and coin details with charts. Data is sourced from the CoinGecko API.

- **Framework**: React 18 + Vite  
- **Language**: TypeScript  
- **Styling**: CSS Modules and SCSS  
- **Charts**: Recharts  
- **HTTP**: Axios

## Demo (Local)
- Dev server: http://localhost:5173

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Data Flow & Architecture](#data-flow--architecture)
- [Key Hooks](#key-hooks)
- [Components Overview](#components-overview)
- [API Layer](#api-layer)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment & Config](#environment--config)
- [Testing & Linting](#testing--linting)
- [Performance Notes](#performance-notes)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [License](#license)

## Features
- **Dashboard** with:
  - Search by name/symbol
  - Client-side sorting by:
    - Price (ascending/descending)
    - 24h Price Change % (ascending/descending)
    - Market Cap (ascending/descending)
  - Favorites toggle (stored in localStorage)
  - Live price updates via polling
- **Coin Details**:
  - Historical price chart
  - Key metrics (price, volume, market cap)
- **Theme**:
  - Dark mode (stored preference)
- Fully typed with TypeScript

## Project Structure
Paths are relative to the repo root.

```
- index.html
- src/
  - components/
    - CoinTable.tsx
    - CoinDetails.tsx
    - Favorites.tsx
    - SearchBar.tsx
    - common/
      - LoadingSpinner.tsx
    - styles: mixed CSS modules and SCSS (e.g. CoinTable.module.css, CoinDetails.scss)
  - hooks/
    - useCoins.ts
    - usePolling.ts
  - utils/
    - api.ts
    - helpers.ts (formatters)
  - types/
    - index.ts
  - styles/ (global styles)
- public/
- vite.config.ts
- vitest.config.ts (if tests added)
- eslint.config.js
- tsconfig*.json
```

## Data Flow & Architecture

High-level:
1. On mount, `useCoins(initialLimit)` fetches the initial set of coins using CoinGecko and constructs the source-of-truth list of `ICoin[]`.
2. `usePolling(coins, setCoins, interval)` merges fresh ticker fields into the source list every interval (default 30s).
   - It uses a ref to avoid resetting the timer each render.
   - It preserves existing values if the API omits fields (nullish coalescing).
3. UI state such as search query and sort option derives a view-only `filteredCoins` array in the Dashboard. Rendering uses this derived list.
4. Favorites are passed to `CoinTable` to indicate starred rows and to `Favorites` to display a sidebar or list.

Why polling does not overwrite fresh data:
- `usePolling` updates the source `coins` via `setCoins`.
- The derived `filteredCoins` is recalculated from `coins + search + sort` using `useEffect` in `Dashboard`, so user actions don't overwrite polled values.

## Key Hooks

### useCoins.ts
- **Provides**: `{ coins, loading, error, setCoins }`
- Fetches initial coins via `fetchTickers(initialLimit, 1)`.
- Shapes API data into `ICoin`.

### usePolling.ts
- **Signature**: `usePolling(coins: ICoin[], setCoins: Dispatch<SetStateAction<ICoin[]>>, interval = 30000)`
- Uses a stable interval and a `coinsRef` to read latest ids without re-creating the interval.
- Merges fields by id using nullish coalescing:
  ```typescript
  price: ticker?.price ?? coin.price
  ```
  Ensures API "missing" fields don't zero-out existing values.
- Adjustable interval via parameter.

## Components Overview

### Dashboard.tsx
- **Source-of-truth**: `allCoins` from `useCoins`
- **Derived list**: `filteredCoins` via `useEffect` from `[allCoins, searchQuery, sortBy]`
- **Sorting**:
  - Price (ascending/descending)
  - 24h Price Change % (ascending/descending)
  - Market Cap (ascending/descending)
- Sorting is performed client-side on the filtered results
- Calls `usePolling(allCoins, setCoins)`
- Passes `filteredCoins` to `CoinTable` and favorites to both `CoinTable` and `Favorites`.

### CoinTable.tsx
- Displays table of `ICoin` rows.
- Indicates favorites with a star toggle.
- Formatting via `utils/helpers` (e.g., `formatPrice`, `formatPercent`).

### Favorites.tsx
- Shows user's favorites list; accepts `favorites` and `toggleFavorite`.

### SearchBar.tsx
- Emits search query changes to the Dashboard.

### CoinDetails.tsx
- Fetches a single coin's detailed info and historical data (chart).
- Uses `Recharts` for visualization.

## API Layer

Located in `src/utils/api.ts`. Uses Axios and CoinGecko endpoints.

### `fetchTickers(per_page = 20, page = 1): Promise<ITicker[]>`
- **Endpoint**: `GET /coins/markets?vs_currency=usd&order=market_cap_desc&per_page=<per_page>&page=<page>`
- **Maps** to `ITicker`:
  - `id`, `name`, `symbol`
  - `price` (current_price), `percent_change_24h`, `total_volume`, `market_cap`, `circulating_supply`, `total_supply`, `max_supply`

### `fetchTicker(coinId): Promise<ITicker | null>`
- **Endpoint**: `GET /coins/{id}`
- Detailed fields for a single coin

### `fetchHistorical(coinId, startDate): Promise<IHistoricalDataPoint[]>`
- **Endpoint**: `GET /coins/{id}/market_chart/range`
- Maps array-of-tuples to `{ time_close, close }`

## Getting Started

### Prerequisites
- Node.js >= 18
- npm >= 9

### Install dependencies
```bash
npm install
```

### Type-check
```bash
npm run type-check
```

### Run development server
```bash
npm run dev
# Open http://localhost:5173
```

### Build production bundle
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Available Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview built app locally
- `npm run lint` — Run ESLint
- `npm run type-check` — Run TypeScript compiler in noEmit mode
- `npm test` — If/when tests added via Vitest

## Environment & Config

- **Vite config**: `vite.config.ts`
- **TypeScript config**: `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **ESLint config**: `eslint.config.js`
- Custom styles using CSS Modules (`.module.css`) and SCSS (`.scss`) under `src/components/` and `src/styles/`

No API key is required for CoinGecko's public endpoints used here. Be mindful of rate limits.

## Testing & Linting

- **TypeScript type check**: `npm run type-check`
- **ESLint**: `npm run lint`
- **Unit tests** (if added):
  - `vitest.config.ts`
  - Run with `npm test`

## Performance Notes

- Polling interval defaults to 30s in `usePolling`. Tune this for your needs.
- `usePolling`:
  - Uses `coinsRef` to avoid resetting intervals on every render.
  - Nullish coalescing ensures missing API fields don't clobber existing values.
- Derive UI lists (search/sort) as a pure function of source-of-truth data to avoid re-render loops or stale overwrites.

## Troubleshooting

- **Prices flicker or revert**:
  - Ensure `Dashboard` uses `usePolling(allCoins, setCoins)` and derives `filteredCoins` from `allCoins` + `searchQuery` + `sortBy`.
  - Confirm `usePolling` uses nullish coalescing (e.g., `ticker?.price ?? coin.price`) not logical OR.
- **Too many re-renders / memory leaks**:
  - Verify intervals are cleared in `usePolling` cleanup.
  - Avoid including `coins` in the polling effect dependency array; a ref is used instead.
- **Fewer/more coins than expected**:
  - `useCoins(initialLimit)` calls `fetchTickers(initialLimit, 1)` and slices to `initialLimit`.

## FAQ

- **Can I change the polling interval?**
  - Yes: `usePolling(allCoins, setCoins, 15000)` for 15s, for example.

- **Can I switch to server push instead of polling?**
  - Yes; you can replace `usePolling` with a WebSocket/SSE-based hook and keep the same merge logic by id.

- **How do I add more columns (e.g., 7d % change)?**
  - Extend `ITicker` and enrich mapping in `fetchTickers`, then surface it in `ICoin` and the `CoinTable` columns.

## License

MIT. See [LICENSE](LICENSE) for details.

Deploy: `npm run build` + Vercel.