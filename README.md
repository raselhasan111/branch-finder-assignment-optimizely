# Brightstream Branch Finder

A location-aware branch finder for Brightstream Bank, powered by Optimizely Graph and Google Maps.

**[Live Demo](https://branch-finder-optimizely-rasel-hasan.vercel.app/)** — `https://branch-finder-optimizely-rasel-hasan.vercel.app`

![App Screenshot](public/App_Screenshot.png)

---

## Setup Instructions

**Prerequisites:** Node.js 18+, [pnpm](https://pnpm.io/)

```bash
git clone https://github.com/raselhasan111/branch-finder-assignment-optimizely.git
cd branch-finder-assignment-optimizely
pnpm install
cp .env.example .env      # fill in your API keys (see below)
pnpm dev                   # http://localhost:5173
```

### Environment Variables

| Variable                   | Description                            |
| -------------------------- | -------------------------------------- |
| `VITE_GRAPH_ENDPOINT`      | Optimizely Graph API endpoint          |
| `VITE_GRAPH_AUTH_KEY`      | Optimizely Graph single-key auth token |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key         |

### Available Scripts

| Command        | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `pnpm dev`     | Start Vite dev server                                        |
| `pnpm build`   | TypeScript check + production build (`tsc -b && vite build`) |
| `pnpm lint`    | ESLint with TypeScript + React hooks rules                   |
| `pnpm format`  | Prettier format all files                                    |
| `pnpm preview` | Preview production build locally                             |

---

## Approach

### 1. API-First Research

Before writing any code, I explored the Optimizely Graph schema using GraphQL introspection and manual `curl`-based query testing via the terminal (using Claude Code with bash commands). I systematically tested every filter operator, field-level query, and ranking mode documented in the schema to map out what actually works at runtime vs. what only exists in introspection. Key discoveries that shaped the architecture:

- **Only the `Name` field is full-text indexed** — city search works only because city names are embedded in branch names (e.g., "Charlotte Downtown"). Street, country, zip code, and phone fields return 0 results in `_fulltext` queries.
- **Field-level filters appear in the schema but fail at runtime** — `City: { eq: "London" }` returns "Field not defined" errors. This meant country/city filtering _must_ be client-side.
- **Max 100 results per request** — to populate filters and enable the map, all 1,000 branches need to be batch-fetched.
- **Fuzzy and semantic ranking are available** — `fuzzy: true` handles typos, and `_ranking: SEMANTIC` enables natural language queries.

These constraints directly led me to the hybrid search architecture described below.

### 2. Hybrid Search Architecture

The core architectural decision: **text queries go server-side** for fuzzy/semantic relevance ranking, while **browse and filter operations run client-side** against a cached full dataset.

```
         User types a query              User browses / filters
                │                                 │
                ▼                                 ▼
   ┌────────────────────────┐      ┌───────────────────────────┐
   │   Optimizely Graph     │      │   Pre-fetched dataset     │
   │   GraphQL API          │      │   1,000 branches cached   │
   │                        │      │   via TanStack Query      │
   │   _fulltext search     │      │                           │
   │   fuzzy · semantic     │      │   10 parallel batches     │
   │   relevance-ranked     │      │   of 100 via Promise.all  │
   └───────────┬────────────┘      └─────────────┬─────────────┘
               │                                 │
               └──────────┬──────────────────────┘
                          ▼
            ┌───────────────────────────┐
            │  Client-side pipeline     │
            │                           │
            │  1. Country filter        │
            │  2. Distance radius (km)  │
            │  3. Sort (relevance ·     │
            │     distance · name)      │
            │  4. Paginate (12/page)    │
            └─────────────┬─────────────┘
                          ▼
               Branch cards + Map view
```

**Why this split?** The API's `_fulltext` with `fuzzy: true` and relevance ranking produces far better search results than any client-side string matching could. But since field-level filters don't work at runtime, client-side filtering against the cached dataset is the only option for country, distance, and sorting operations — and it's instant.

### 3. Design System Extraction

Rather than eyeballing colors and fonts from the mockups, I fed the provided HTML files (`home.html`, `articles.html`) into Claude to extract every design token — colors, typography, spacing, radii, shadows, hover effects, and component patterns — into a structured design system document. I then cross-referenced and refined the output with my own review of the markup and CSS. This gave me a precise, codified style guide to build:

| Token      | Value                      | Usage                                                  |
| ---------- | -------------------------- | ------------------------------------------------------ |
| Gold       | `#d4af37`                  | Primary accent — CTAs, badges, active states, map pins |
| Midnight   | `#0a1628`                  | Dark backgrounds, headings, nav, footer                |
| Warm White | `#fefdfb`                  | Page background, light text on dark                    |
| Cream      | `#f8f6f1`                  | Card backgrounds, secondary light surfaces             |
| Deep Teal  | `#0d4d56`                  | Gradient endpoints, card header gradients              |
| Headings   | Playfair Display           | Premium serif for all headings                         |
| Body/UI    | Jost                       | Clean sans-serif for all body text, buttons, labels    |
| Radius     | 25px cards, 50px buttons   | Consistent rounded component patterns                  |
| Hover      | translateY(-10px) + shadow | Card lift effect matching mockup behavior              |

Every component — from the floating search bar to map cluster icons to branch popups — uses these tokens consistently. The shadcn/ui primitives are re-themed via CSS custom properties to match the Brightstream palette.

### 4. Performance-Aware Map

Rendering ~1,000 markers as React components would cause significant reconciliation overhead on every filter change. Instead:

- Markers are created **imperatively** via the Google Maps JS API (`new google.maps.Marker()`) inside a `useEffect`
- Marker lifecycle is managed through refs (`markersRef`, `branchLookupRef`)
- **MarkerClusterer** groups nearby markers with custom-rendered SVG clusters using Brightstream brand colors
- Map auto-fits bounds when the visible branch set changes (tracked via sorted ID string comparison)
- Custom map styles match the Brightstream warm aesthetic

### 5. Search UX Optimization

- **Two-layer debounce:** React 19's `useDeferredValue` keeps the UI thread responsive, while a 300ms custom `useDebounce` hook prevents API calls during rapid typing. The visual "Showing results for…" text updates immediately via deferred value, but the actual API call waits for the debounced value.
- **Minimum query length:** Queries shorter than 2 characters are ignored — prevents wasteful API calls on single keystrokes.
- **Smart Search toggle:** Exposes Optimizely Graph's `SEMANTIC` ranking mode for natural language queries like "branches near shopping areas" or "financial district locations."

---

## Features

### Core

- ✅ **Optimizely Graph integration** — branch data fetched via GraphQL with `graphql-request`
- ✅ **Fuzzy search** — typo-tolerant (`_fulltext` with `fuzzy: true`, `_ranking: RELEVANCE`)
- ✅ **Semantic search** — AI-powered natural language queries (`_ranking: SEMANTIC`) via toggle
- ✅ **Responsive design** — mobile, tablet, and desktop layouts
- ✅ **Brand-matched design** — extracted and applied Brightstream design system from HTML mockups
- ✅ **Deployed** — live on Vercel at public URL

### Enhanced

- ⭐ **Interactive Google Maps** — full-width map with custom brand-styled pins and cluster rendering
- ⭐ **Browser geolocation** — auto-detects user location on load, sorts branches by proximity
- ⭐ **Haversine distance** — distance from user displayed on each branch card (meters/km adaptive formatting)
- ⭐ **Directions integration** — one-click "Get Directions" links open Google Maps with branch as destination
- ⭐ **Branch detail popups** — map marker click shows popup with address, phone, email, and directions CTA
- ⭐ **Country filter** — horizontal scrollable pills with flag emojis, toggle selection, branch counts
- ⭐ **Distance radius filter** — 25 / 50 / 100 / 250 km radius options (requires geolocation)
- ⭐ **Sort options** — relevance, nearest first, name A–Z (context-aware availability)
- ⭐ **Fullscreen map** — expand map to fill viewport with custom zoom/location controls, Escape to exit
- ⭐ **Active filter pills** — visual indicators with individual dismiss and "Clear all"
- ⭐ **Loading skeletons** — animated placeholders for branch cards and country filter pills
- ⭐ **Error handling** — error states with retry, truncation warnings, empty state with clear filters CTA

### Additional UX Details

- **Click-to-call / click-to-email** — phone numbers and emails are `tel:` / `mailto:` links
- **"Closest to you" badge** — gold star badge on the nearest branch when sorted by distance
- **Cooperative gesture handling on mobile** — two-finger scroll for map, single finger for page scroll
- **Map auto-fit** — viewport adjusts to fit visible branch markers when filters change
- **URL state persistence** — search query, page, country, sort, radius, and smart search toggle are all synced to URL search params via TanStack Router with Zod validation
- **Scroll-to-results** — smooth scroll to results section on pagination
- **Truncation warning** — when combining search + filters caps results at 100, an amber banner warns the user

---

## Tech Stack

| Category      | Technology                                           | Why                                                                |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------------ |
| Framework     | React 19 + TypeScript 5.9                            | Latest React with type safety                                      |
| Build         | Vite 8                                               | Fast HMR, ESM-native bundling                                      |
| Styling       | Tailwind CSS v4 + shadcn/ui                          | Utility-first CSS with pre-built accessible primitives             |
| Data Fetching | TanStack React Query + graphql-request               | Cache management, deduplication, retry, stale-while-revalidate     |
| Routing       | TanStack Router + Zod                                | Type-safe URL search params with schema validation                 |
| Maps          | @react-google-maps/api + @googlemaps/markerclusterer | Map container lifecycle + efficient marker clustering              |
| Icons         | Lucide React                                         | Stroke-based SVG icons matching Brightstream's outlined icon style |
| Code Quality  | ESLint 9, Prettier, Husky + lint-staged              | Pre-commit: format → lint → build (rejects broken commits)         |

---

## Key Technical Decisions

### 1. No State Management Library

`useState` + React Context (for geolocation) + TanStack Query (for server state) covers all state needs. The geolocation context is the only shared client state — everything else is either URL-driven (search params) or server-derived (query cache). Adding Redux or Zustand would be over-engineering.

### 2. Imperative Map Markers (Not React Components)

Rendering ~1,000 markers as `<Marker>` React components means React must diff and reconcile all of them on every filter change. Creating markers directly via the Google Maps JS API in a `useEffect` with refs avoids this entirely. The `useBranchMarkers` hook manages the full marker lifecycle: creation, clustering, click handlers, and cleanup.

### 3. Parallel Batch Fetching for Full Dataset

Optimizely Graph caps responses at 100 items. To get all 1,000 branches for client-side filtering, map display, and country option derivation, the first request fetches 100 + the `total` count. Then `Math.ceil((total - 100) / 100)` remaining batches fire in parallel via `Promise.all`. This loads the full dataset in ~1 round-trip time instead of 10 sequential requests.

### 4. Two Data Paths with Automatic Switching

The `useBranchData` hook orchestrates two data sources:

- **Server search path:** fires when the user has a text query — leverages API's fuzzy/semantic ranking
- **All-branches path:** fires when the user is browsing or filtering without a text query — instant client-side filtering on the cached dataset

The switch is automatic and transparent to the user. When search + filters are combined, the server path fetches up to 100 results, then client-side filters are applied on top.

### 5. URL-Driven State via TanStack Router

All filter/search/pagination state lives in URL search params, validated by a Zod schema:

```ts
z.object({
  q: z.string().default(''),
  page: z.number().int().min(1).default(1),
  country: z.string().optional(),
  sort: z.enum(['relevance', 'distance', 'name']).default('relevance'),
  radius: z.number().positive().optional(),
  smart: z.boolean().default(false),
});
```

This makes every view shareable, bookmarkable, and back-button friendly. Default values are stripped from the URL via `stripSearchParams` middleware to keep URLs clean.

### 6. Pre-Commit Quality Gates

Husky + lint-staged runs on every commit:

1. **Prettier** formats staged files
2. **ESLint** lints and auto-fixes `.ts`/`.tsx` files
3. **Full build** (`tsc -b && vite build`) — catches type errors and build failures

No broken code reaches the repository.

### 7. Semantic Search as Opt-In Toggle

Optimizely Graph's `SEMANTIC` ranking is powerful for natural language queries but can be less precise for exact city/branch names. Keeping it as a user-controlled toggle (with tooltip explanation) gives customers the choice rather than making assumptions about intent.

---

## Project Structure

```
src/
├── main.tsx                     # App entry — router, query client, providers
├── index.css                    # Tailwind imports + Brightstream design tokens
├── pages/
│   ├── BranchFinder.tsx         # Main page — composes all branch components
│   ├── ErrorPage.tsx            # Route-level error boundary
│   └── NotFound.tsx             # 404 page
├── components/
│   ├── branches/
│   │   ├── SearchBar.tsx        # Floating pill search with smart search toggle
│   │   ├── BranchMap.tsx        # Google Maps container with custom controls
│   │   ├── BranchCard.tsx       # Branch result card with distance, contact, directions
│   │   ├── BranchGrid.tsx       # Responsive card grid layout
│   │   ├── BranchPopup.tsx      # Map marker popup overlay
│   │   ├── CountryFilter.tsx    # Horizontally scrollable country pills with flags
│   │   ├── ActiveFilters.tsx    # Dismissible filter pill bar
│   │   ├── BranchControls.tsx   # Sort select + distance radius controls
│   │   ├── BranchResultsHeader.tsx  # "Showing X branches" header
│   │   ├── Pagination.tsx       # Page navigation with scroll-to-top
│   │   ├── MapControls.tsx      # Custom zoom, fullscreen, my-location buttons
│   │   ├── ClusterTooltip.tsx   # Cluster hover tooltip
│   │   ├── EmptyState.tsx       # No results state with clear filters CTA
│   │   ├── BranchError.tsx      # Error state with retry
│   │   ├── BranchListSkeleton.tsx   # Loading skeleton cards
│   │   ├── SmartSearchToggle.tsx    # Semantic search on/off switch
│   │   ├── SortSelect.tsx       # Sort dropdown
│   │   ├── DistanceRadius.tsx   # Radius filter dropdown
│   │   └── MapError.tsx         # Map load failure fallback
│   ├── layout/
│   │   ├── Navbar.tsx           # Fixed nav with mobile hamburger menu
│   │   └── Footer.tsx           # Multi-column footer
│   └── ui/                      # shadcn/ui primitives (button, card, badge, etc.)
├── hooks/
│   ├── use-branches.ts          # GraphQL search query hook (fuzzy + semantic)
│   ├── use-all-branches.ts      # Full dataset batch fetch + country derivation
│   ├── use-debounce.ts          # Generic debounce hook
│   ├── use-is-mobile.ts         # Viewport width detection
│   └── branches/
│       ├── use-branch-finder.ts # Top-level orchestrator — composes all hooks
│       ├── use-branch-data.ts   # Data source switching + filter pipeline
│       ├── use-branch-navigation.ts  # URL search param handlers
│       ├── use-branch-markers.ts     # Imperative marker + cluster lifecycle
│       ├── use-fit-bounds.ts    # Map auto-fit on branch set change
│       ├── use-map-fullscreen.ts     # Fullscreen toggle with Escape support
│       ├── use-selected-marker.ts    # Selected marker icon swap
│       └── use-user-location-markers.ts  # User location dot + accuracy ring
├── contexts/
│   └── LocationContext.tsx       # Browser geolocation provider
├── lib/
│   ├── graphql/
│   │   ├── client.ts            # graphql-request client with auth
│   │   └── queries.ts           # GraphQL query documents (search, semantic, list)
│   ├── filter-branches.ts       # Client-side filter/sort/paginate pipeline
│   ├── map-utils.ts             # SVG pin creation, directions URL builder
│   └── utils.ts                 # Haversine distance, coordinate parsing, cn()
├── constants/
│   ├── config.ts                # Page size (12), batch size (100), radius options
│   ├── map.ts                   # Map styles, default center/zoom, pin SVG path
│   └── ui.ts                    # Sort labels, sort options, skeleton widths
└── types/
    ├── branch.ts                # Branch, CountryOption, FilterOptions, SortOption
    └── hooks.ts                 # Hook parameter types
```

---

## Known Limitations

| Limitation                              | Context                                                                                                                                                        |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No unit/integration tests**           | Would add Vitest + React Testing Library given more time — the hook composition and filter pipeline are highly testable                                        |
| **Google Maps API key required**        | The map won't render without a valid key; a branded placeholder is shown instead                                                                               |
| **Search + filter cap at 100**          | When combining a text search with client-side filters, results are limited to the top 100 server matches. A truncation warning is displayed when this occurs.  |
| **Country counts reflect full dataset** | Country pill counts show totals from all 1,000 branches, not the current search results. Clicking a non-matching country after searching shows an empty state. |
| **Client-side only**                    | No SSR — not needed for this use case but noted for completeness                                                                                               |
| **"Read More" button is a placeholder** | No branch detail route exists yet — the button is non-functional                                                                                               |

---

## What I'd Improve With More Time

1. **Tests** — unit tests for `filterAndSortBranches`, `calculateDistance`, `parseCoordinates`; integration tests for the `useBranchData` hook; component tests for `SearchBar` and `CountryFilter`
2. **Context-aware country counts** — derive country pill counts from current search results instead of the full dataset, or disable pills that would produce 0 results
3. **Typeahead autocomplete** — use Optimizely Graph's `startsWith` operator for real-time suggestions as the user types
4. **Pre-parsed coordinates** — parse `"lat, lng"` strings once at fetch time and extend the `Branch` type, avoiding repeated string parsing on every filter/sort/render
5. **City filter** — add a searchable city dropdown derived from the pre-fetched dataset, filtered by selected country
6. **Branch detail modal** — full detail view with embedded map, operating hours, and services
7. **Accessibility audit** — verify WCAG AA contrast ratios (Gold on white may need darkening for small text), add `aria-live` regions for dynamic result counts
8. **Cursor-based pagination** — replace offset-based (`skip`) with cursor-based pagination for the batch fetch, which is more stable if data changes between requests

---

## Edge Cases Handled

- **Geolocation denied/failed** — distance sort and radius filter are hidden; app degrades gracefully to relevance/alphabetical sorting
- **No search results** — branded empty state with "Clear all filters" CTA
- **API errors** — error component with retry button; TanStack Query auto-retries twice with exponential backoff
- **Missing coordinates** — branches without valid coordinates are excluded from map and distance calculations
- **Rapid typing** — two-layer debounce prevents API spam; only the final stable query triggers a server call
- **Single result** — map pans and zooms to the single branch instead of attempting to fit bounds
- **Deep linking** — all state is URL-driven; sharing a URL preserves search, page, filters, and sort
- **Mobile map scrolling** — cooperative gesture handling prevents accidental map zoom when scrolling the page
