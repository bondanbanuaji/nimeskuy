# NimeSkuy

Anime streaming and discovery web app built with Next.js 16. Data is sourced from the [Sanka Anime REST API](https://www.sankavollerei.web.id), which aggregates metadata from Otakudesu and other providers. A Next.js BFF (Route Handlers) layer sits between the frontend and the external API to centralize caching, rate-limit protection, and response normalization.

## Overview

NimeSkuy is a personal project web application for discovering and streaming anime with Indonesian subtitles. It provides a search/discovery interface over anime metadata and an iframe-based streaming player that embeds URLs returned by the provider. No video files are stored or transcoded by this application.

- **Type:** Web application (Next.js App Router, Server-Side Rendering with ISR)
- **Primary language:** Bahasa Indonesia (UI text)
- **Target users:** Casual viewers, anime enthusiasts, and mobile-first users
- **Architecture:** Browser → Next.js BFF/API proxy → Sanka Anime REST API → UI

The frontend communicates exclusively with internal Next.js Route Handlers (`/api/anime/...` and `/api/server/...`) rather than calling the Sanka API directly. This keeps the external provider abstraction isolated and enables request deduplication via Next.js ISR caching.

## Features

### Discovery & Browsing
- Hero carousel with auto-advancing slides, trailer video overlay, and idle-detection
- Ongoing anime list with pagination
- Completed anime list with pagination
- Movie anime (filtered from completed list)
- Genre browser with search/filter
- Genre detail pages with pagination
- Daily release schedule with a weekly calendar UI and day selection

### Search
- Debounced search (400ms) with URL synchronization
- Real-time results rendering with Suspense boundaries
- Empty and error states

### Anime Detail
- Full metadata: title, Japanese title, score, status, type, duration, aired date, studio, synopsis, genres
- Episode list with search, sort (newest/oldest), and current-episode highlight
- Recommendations from the API
- Add/remove favorites (localStorage)

### Streaming
- Episode page with server selection (quality-based server groups)
- Iframe-based video player with SSRF protection via URL validation
- Previous / Next episode navigation
- Watch history saved to localStorage (max 20 entries, LRU eviction)
- Continue watching section on homepage

### Local Storage Features
- Watch history (anime slug, episode slug, title, episode number, timestamp)
- Favorites list
- All data persists client-side; no server-side user accounts

### UI/UX
- Dark-themed, cinematic design with red accent (`#d50032`)
- Responsive layout (mobile-first with bottom navigation, desktop with fixed header)
- Smooth scroll via [Lenis](https://github.com/darkcwii91/lenis) (respects `prefers-reduced-motion`)
- Drag-to-scroll carousels
- Skeleton loading states for anime cards and grids
- Error and empty state components
- Back-to-top and "Hari ini" (today) quick navigation on schedule

### Technical
- Error boundary with retry
- Custom 404 pages per route
- API request timeout (10s) with retry (exponential backoff, no retry on 404)
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- SSRF protection for streaming URLs (private hostname blocking + domain allowlist)

## Tech Stack

| Category      | Technology                        |
| ------------- | --------------------------------- |
| Framework     | Next.js 16.3.4 (App Router)       |
| Runtime        | Node.js 18+ / Vercel Edge        |
| Language      | TypeScript 5                      |
| Styling       | Tailwind CSS 4                    |
| Animation     | Lenis (smooth scroll)             |
| Icons         | Lucide React                      |
| Data Provider | Sanka Anime REST API              |
| Image Sources | Otakudesu, AniList, Jikan, Google Images |
| Testing       | Playwright (E2E)                  |
| Linting       | ESLint 9 + eslint-config-next     |

## Architecture

```text
Browser
   |
   v
Next.js (Server Components + ISR)
   |      |
   |      +---> Internal API Routes (BFF)
   |              |
   |              +---> Sanka Anime REST API (external)
   |                      (caching via next: { revalidate })
   |
Client Components (interactives, localStorage)
   |
   +---> /api/anime/home         -> Sanka /anime/home
   +---> /api/anime/search       -> Sanka /anime/search/:keyword
   +---> /api/anime/[slug]       -> Sanka /anime/anime/:slug
   +---> /api/anime/episode/[slug] -> Sanka /anime/episode/:slug
   +---> /api/server/[serverId]  -> Sanka /anime/server/:serverId
   +---> /api/anime/genre/[slug] -> Sanka /anime/genre/:slug
   +---> /api/anime/[slug]/banner -> Sanka + Jikan + AniList + Google (fallback)
   +---> /api/instagram/avatar   -> Instagram profile scrape
```

### Data flow

1. Pages are Server Components that call functions from `src/lib/api/sanka.ts`.
2. The Sanka client (`src/lib/api/client.ts`) wraps `fetch` with envelope parsing (`{ ok, statusCode, data }`), timeout (10s), and retry with exponential backoff.
3. Caching is handled via Next.js `next: { revalidate }` on each fetch, serving deduplicated, stale-while-revalidate responses to all users.
4. A thin internal API layer (Route Handlers in `src/app/api/`) normalizes responses to the standard `{ success, data, error }` envelope and is also consumed by some client components (hero banner, video player server resolution).
5. The video player receives an embed URL from `/api/server/[serverId]`, which validates the URL is not a private/internal host and is an allowed streaming domain before returning it to the client.

### Caching TTL strategy

| Data               | TTL    |
| ------------------ | ------ |
| Home (ongoing/completed) | 5 min  |
| Trending           | 5 min  |
| Ongoing list       | 5 min  |
| Completed list     | 30 min |
| Search             | 2 min  |
| Anime detail       | 30 min |
| Episode detail     | 5 min  |
| Server/stream URL  | 2 min  |
| Genre list         | 24 hr  |
| Genre detail       | 1 hr   |
| Schedule           | 30 min |

## Project Structure

```text
nimeskuy/
├── public/
│   ├── logo.png
│   ├── favicon-*.png
│   ├── icon-*.png
│   ├── manifest.webmanifest
│   └── ... (static assets)
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout, global metadata, SEO
│   │   ├── globals.css         # Tailwind + design tokens
│   │   ├── page.tsx            # Homepage (SSR, revalidate 300s)
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   ├── robots.ts           # robots.txt
│   │   ├── not-found.tsx       # Global 404
│   │   ├── error.tsx           # Global error boundary
│   │   ├── loading.tsx         # Global loading skeleton
│   │   ├── about/
│   │   ├── privacy/
│   │   ├── terms/
│   │   ├── disclaimer/
│   │   ├── ongoing/
│   │   ├── completed/
│   │   ├── movies/
│   │   ├── schedule/
│   │   ├── genre/
│   │   │   └── [slug]/
│   │   ├── anime/
│   │   │   └── [slug]/         # Anime detail page
│   │   ├── watch/
│   │   │   └── [episodeSlug]/  # Watch page
│   │   ├── search/
│   │   ├── history/
│   │   ├── favorites/
│   │   └── api/                # Internal BFF routes
│   │       ├── anime/
│   │       │   ├── home/
│   │       │   ├── search/
│   │       │   ├── schedule/
│   │       │   ├── ongoing/
│   │       │   ├── completed/
│   │       │   ├── genres/
│   │       │   ├── [slug]/      # anime detail proxy
│   │       │   ├── genre/
│   │       │   │   └── [slug]/
│   │       │   ├── episode/
│   │       │   │   └── [slug]/
│   │       │   ├── server/
│   │       │   │   └── [serverId]/
│   │       │   └── banner/
│   │       │       └── [slug]/
│   │       └── server/
│   │           └── [serverId]/
│   ├── components/
│   │   ├── layout/      # Navbar, BottomNav, Footer
│   │   ├── anime/       # AnimeCard, AnimeCarousel, HeroCarousel, EpisodeList, ContinueWatching
│   │   ├── schedule/    # ScheduleCalendar
│   │   ├── watch/       # VideoPlayer
│   │   ├── seo/         # JsonLd, Breadcrumbs
│   │   └── ui/          # Skeleton, EmptyState, Button, InstagramWatermark
│   ├── hooks/           # use-drag-scroll
│   ├── lib/
│   │   ├── api/         # Sanka client, types, mapper, fallback
│   │   ├── site.ts      # SEO site config
│   │   ├── config.ts    # Constants, URL validation, SSRF protection
│   │   └── utils/       # cn, storage (localStorage)
│   └── types/
│       └── anime.ts     # Shared TypeScript interfaces
├── docs/
│   └── PRD - Anime Streaming Web App.md
├── e2e/
│   ├── flow.spec.ts
│   └── responsive.spec.ts
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config (via postcss)
└── eslint.config.mjs
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm (or a compatible package manager)

### Installation

```bash
git clone https://github.com/bondanbanuaji/nimeskuy.git
cd nimeskuy
npm install
```

### Environment Variables

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute production URL (no trailing slash). Used for canonical URLs, sitemap, OG images. Falls back to `VERCEL_URL` on Vercel, then `http://localhost:3000` in dev. | — |
| `NEXT_PUBLIC_APP_URL` | Legacy alias for `NEXT_PUBLIC_SITE_URL`. Lower priority. | — |
| `SANKA_API_URL` | Sanka Anime REST API base URL. Only change if self-hosting or API moves. | `https://www.sankavollerei.web.id` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification meta tag content. | — |

No API keys or secrets are required. The application does not use authentication.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The development server uses `next dev --webpack`.

### Build

```bash
npm run build
```

This produces an optimized production build in `.next/`.

### Lint

```bash
npm run lint
```

### Tests

End-to-end tests use Playwright. The dev server must be running on port 3000:

```bash
npm run dev
npx playwright test
```

## Deployment

The project is configured for Vercel. Next.js is automatically detected from `package.json`.

| Setting | Value |
| --- | --- |
| Build command | `next build --webpack` |
| Output directory | (Next.js zero-config; no output directory needed) |
| Framework preset | Next.js |

**Environment variables to set in the Vercel dashboard** (Project Settings → Environment Variables):

- `NEXT_PUBLIC_SITE_URL` — your production domain (required for SEO/canonical/sitemap)
- `SANKA_API_URL` — leave as default unless the Sanka API endpoint changes

Vercel automatically injects `VERCEL_URL`, so the site will function in preview deployments even if `NEXT_PUBLIC_SITE_URL` is unset.

## API Integration

### Provider

All data comes from the **Sanka Anime REST API** (`https://www.sankavollerei.web.id`), which aggregates metadata from Otakudesu and other anime sources. No other anime data provider is used for the core catalog.

### Internal BFF Layer

The frontend never calls Sanka directly. Instead, the Next.js app exposes internal Route Handlers under `src/app/api/anime/*` and `src/app/api/server/*`. These handlers:

1. Call the appropriate Sanka API function from `src/lib/api/sanka.ts`.
2. Normalize the response envelope to `{ success, data, error }`.
3. Propagate `ApiError` with structured error codes (`NOT_FOUND`, `RATE_LIMITED`, `BAD_REQUEST`, `SERVER_ERROR`, `TIMEOUT`, `NETWORK_ERROR`).
4. Return appropriate HTTP status codes.

### Endpoints (internal BFF)

| Method | Path | Sanka endpoint | Description |
| --- | --- | --- | --- |
| GET | `/api/anime/home` | `/anime/home` | Ongoing + completed anime for homepage |
| GET | `/api/anime/search?q=` | `/anime/search/:keyword` | Search anime by keyword |
| GET | `/api/anime/[slug]` | `/anime/anime/:slug` | Anime detail (title, synopsis, genres, episodes) |
| GET | `/api/anime/episode/[slug]` | `/anime/episode/:slug` | Episode detail (servers, prev/next) |
| GET | `/api/server/[serverId]` | `/anime/server/:serverId` | Streaming embed URL (SSRF-validated) |
| GET | `/api/anime/ongoing?page=` | `/anime/ongoing-anime?page=` | Paginated ongoing list |
| GET | `/api/anime/completed?page=` | `/anime/complete-anime?page=` | Paginated completed list |
| GET | `/api/anime/genres` | `/anime/genre` | All available genres |
| GET | `/api/anime/genre/[slug]` | `/anime/genre/:slug` | Anime list for a genre |
| GET | `/api/anime/schedule` | `/anime/schedule` | Daily release schedule |
| GET | `/api/anime/banner/[slug]` | Sanka + AniList + Jikan + Google | High-res banner/cover image |
| GET | `/api/instagram/avatar` | Instagram | Developer avatar for watermark |

### Client-side fetching

Some client components fetch directly through internal API routes using `fetch`:

- **Hero carousel** — calls `/api/anime/[slug]` for synopsis and `/api/anime/banner/[slug]` for a high-resolution banner.
- **Watch page server selection** — calls `/api/server/[serverId]?episode=[slug]` to resolve the embed URL when a server is selected.

### Error handling

The API client (`src/lib/api/client.ts`) handles:

- HTTP-level errors (400, 404, 429, 5xx)
- Sanka envelope errors (`ok: false` with `statusCode`)
- Network errors and 10-second timeouts (`AbortController`)
- Automatic retry once with exponential backoff (500ms, 1s) for non-404 errors

### SSRF protection

The `/api/server/[serverId]` route validates the returned streaming URL:

- Blocks requests to private/internal hostnames (localhost, 10.x, 192.168.x, 172.16-31.x, etc.)
- The video player (`src/components/watch/video-player.tsx`) additionally validates the URL before rendering an iframe

## UI and UX

### Design

- **Theme:** Dark (`#000000` surface, `#0c0c0c` cards) with a red accent (`#d50032`)
- **Typography:** Plus Jakarta Sans (sans) and Geist Mono (monospace), loaded via `next/font`
- **Layout:** Max-width container at 1520px with responsive padding
- **Cards:** Aspect 2:3 anime posters with hover scale, score badge, status badge, and play icon overlay
- **Hero:** Full-width cinematic banner with dark gradient overlays, featured badge, and video trailer overlay that activates after 5s of user idle

### Navigation

- **Desktop header:** Fixed, collapses on scroll with backdrop blur, contains logo, desktop nav links (Home, Ongoing, Completed, Schedule, Genre), search, favorites, and history icons
- **Mobile header:** Same with hamburger menu that opens an overlay panel
- **Bottom nav (mobile):** Fixed bottom bar with Home, Search, Schedule, and Favorites icons

### Responsiveness

- Mobile-first design with `sm:`, `md:`, `lg:`, and `xl:` breakpoints
- Bottom navigation on mobile (`sm:hidden`), hidden on desktop
- Desktop grid layouts up to 6 columns for anime cards
- Schedule calendar switches from compact day-strip mobile view to full 7-column grid on desktop
- Carousels support both mouse drag and touch drag

### Loading and states

- Skeleton loading for anime cards, grids, and watch page content
- Global error boundary with retry button
- Route-specific 404 pages
- Empty states for search, favorites, and history

### Animations

- Lenis smooth scrolling (desktop only; respects `prefers-reduced-motion`)
- CSS transitions on hover for cards, badges, and buttons
- Hero carousel auto-advance (15s interval) with progress bar indicator
- Trailer video overlay that activates on idle

## Performance Considerations

- **ISR caching:** All data-fetching functions use `next: { revalidate }` with cache TTLs tuned per data type (5 min for home, 24 hr for genres, etc.)
- **Request deduplication:** Next.js ISR ensures that concurrent requests for the same data within the revalidation window produce a single upstream call to the Sanka API
- **Image lazy loading:** All non-critical images use `loading="lazy"`
- **Code splitting:** Dynamic imports for client components and SEO components (lazy-loaded in pages via `await import()`)
- **Drag-scroll carousels:** Use `data-lenis-prevent` and `scrollbar-hide` to prevent smooth-scroll conflicts
- **Font optimization:** `next/font` with `display: swap` and preloaded font weights
- **Hero image priority:** First hero image uses `fetchPriority="high"` and `loading="eager"`
- **Security headers:** Configured via `next.config.ts` (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- **SSR protection:** `poweredByHeader: false` hides the Next.js version header

## SEO

### Metadata

Each route defines its own `Metadata` (via `generateMetadata` or static export):

- **Title tags** with consistent suffix template (`%s | NimeSkuy`)
- **Meta descriptions** using site description from `src/lib/site.ts`
- **Open Graph** tags (title, description, type, locale `id_ID`, images)
- **Twitter Card** tags (`summary_large_image` for most pages, `summary` for watch pages)
- **Canonical URLs** set on every route

### Indexing policy

- Indexable pages: Home, Ongoing, Completed, Movies, Schedule, Genre, Genre Detail, Anime Detail, About, Privacy, Terms, Disclaimer, Favorites, History
- Noindex pages: Watch pages (to prevent index bloat from server parameter variations), Search results

### Sitemap

Dynamic sitemap (`src/app/sitemap.ts`) generates URLs for:

- Static routes (with appropriate change frequency and priority)
- Genre detail pages (up to 40 genres)
- Anime detail pages (aggregated from home, trending, and schedule data; up to 80 anime)

### robots.txt

- Allows all crawling
- Disallows `/api/`
- References the dynamic sitemap

### Structured data (JSON-LD)

The site includes JSON-LD structured data via `<script type="application/ld+json">`:

- **WebSite** — site name, URL, search action
- **Organization** — publisher with logo
- **Person** — developer (Bondan Banuaji) with sameAs links
- **BreadcrumbList** — on anime detail, watch, and listing pages
- **TVSeries** — on anime detail pages (name, image, description, genre, no fabricated aggregateRating)

Structured data is carefully limited to verifiable data only. Aggregate ratings are omitted because scores come from the provider, not user-generated reviews on this site.

### Performance SEO

- `metadataBase` is set from `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL`
- PWA manifest is configured (`/manifest.webmanifest`) with standalone display mode, theme color `#d50032`, and icons
- Viewport meta includes `colorScheme: "dark"` and `themeColor: "#d50032"`

## Testing

The project includes Playwright E2E tests:

```bash
npm run dev
npx playwright test
```

Test files:

- `e2e/flow.spec.ts` — Core user flows: home loading, search → detail → episode → watch, genre browsing, schedule, ongoing/completed pagination, watch server selection, watch history, favorites add/remove, 404 handling
- `e2e/responsive.spec.ts` — Responsive layout checks across mobile, tablet, and desktop viewports (no horizontal overflow, navbar visibility, video aspect ratio)

## Author

NimeSkuy is developed by **Bondan Banuaji** ([GitHub](https://github.com/bondanbanuaji), [Instagram @bdn_bnj](https://www.instagram.com/bdn_bnj)).

## License

NimeSkuy is released under the [MIT License](LICENSE).

Copyright (c) 2026 Bondan Banuaji.

## Disclaimer

NimeSkuy does not host, store, or transcode any video files. All anime metadata, posters, and streaming links are sourced from third-party providers via the Sanka Anime REST API. Copyright and content ownership remain with the original rights holders. For copyright takedown requests, please contact the original content provider. The streaming embeds are rendered as iframes in accordance with each provider's terms.
