# PRD — Anime Streaming Web App

> **Status:** Draft  
> **Version:** 1.0.0  
> **Platform:** Web  
> **Frontend:** Next.js + React  
> **Data Provider:** Sanka Anime REST API  
> **Primary Language:** Bahasa Indonesia  
> **Target:** Desktop + Mobile Responsive

---

# 1. Product Overview

## 1.1 Product Name

**Anime Streaming Web App**

Nama brand final belum ditentukan dan dapat diganti pada tahap branding.

## 1.2 Product Summary

Web application untuk mencari, menjelajahi, dan menonton anime secara online menggunakan **Sanka Anime REST API** sebagai sumber data.

Aplikasi tidak menyimpan file video anime secara langsung. Aplikasi mengambil metadata anime, daftar episode, serta informasi/link streaming dari Sanka API dan menyajikannya melalui UI yang modern, cepat, responsive, dan mudah digunakan.

Sanka API menyediakan data dari berbagai sumber anime seperti Otakudesu, Samehadaku, Donghua, Kusonime, Anoboy, Oploverz, Animekuindo, dan sumber lainnya.

---

# 2. Problem Statement

Pengguna membutuhkan platform streaming anime yang:

- Mudah digunakan.
- Cepat mencari anime.
- Menampilkan update anime terbaru.
- Memiliki informasi detail anime.
- Memiliki daftar episode yang mudah dinavigasi.
- Memiliki halaman watch yang nyaman.
- Dapat berpindah episode dengan cepat.
- Responsive di mobile maupun desktop.
- Tidak bergantung langsung pada struktur raw API di sisi frontend.

Masalah teknis utama:

1. Sanka API memiliki rate limit.
2. Response antar sumber dapat memiliki struktur berbeda.
3. Endpoint dapat berubah karena API masih dalam pengembangan.
4. Link streaming dapat berasal dari server eksternal.
5. API dapat mengalami timeout/error.
6. Beberapa endpoint pada dokumentasi ditandai sebagai `Working` atau `error`, sehingga tidak semua sumber cocok dijadikan dependency utama.

Sanka sendiri menyatakan API masih dalam tahap pengembangan dan beberapa fitur mungkin belum tersedia atau belum berfungsi dengan baik.

---

# 3. Product Goals

## Primary Goals

- Menyediakan pengalaman streaming anime yang simpel.
- Menyediakan pencarian anime dengan cepat.
- Menampilkan anime terbaru dan populer.
- Menampilkan detail anime lengkap.
- Menyediakan navigasi episode.
- Menyediakan watch page yang nyaman.
- Mengurangi request langsung ke Sanka API.
- Menggunakan caching untuk menghindari rate limit.
- Memiliki arsitektur yang mudah dikembangkan.

## Secondary Goals

- Watch history.
- Continue watching.
- Favorite anime.
- User account.
- Notification anime terbaru.
- PWA/mobile-like experience.
- Multiple streaming server.

---

# 4. Non-Goals

Pada versi awal aplikasi **tidak** akan:

- Meng-host file video sendiri.
- Mengupload anime.
- Melakukan transcoding video.
- Menyediakan sistem pembayaran.
- Menyediakan forum/community.
- Menyediakan fitur komentar.
- Menyediakan social network.
- Menyalin seluruh database Sanka secara realtime.

---

# 5. Target Users

## 5.1 Casual Viewer

Pengguna yang hanya ingin:

> Cari anime → pilih episode → nonton.

## 5.2 Anime Enthusiast

Pengguna yang:

- Sering mengikuti anime ongoing.
- Membutuhkan jadwal rilis.
- Menyimpan anime favorit.
- Melanjutkan episode terakhir.

## 5.3 Mobile Viewer

Pengguna yang mayoritas mengakses website melalui smartphone.

Prioritas:

- Load cepat.
- UI sederhana.
- Video player nyaman.
- Navigasi episode mudah.
- Search mudah diakses.

---

# 6. Core User Journey

```text
Homepage
   ↓
Search / Browse
   ↓
Anime List
   ↓
Anime Detail
   ↓
Episode List
   ↓
Watch Page
   ↓
Select Server
   ↓
Streaming
   ↓
Next / Previous Episode
```

Alternative:

```text
Homepage
   ↓
Latest Anime
   ↓
Anime Detail
   ↓
Watch
```

---

# 7. Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Data Fetching

Recommended:

- Native `fetch`
- Server Components
- Route Handlers
- React cache
- Next.js caching
- Optional SWR/TanStack Query untuk client-side interaction

## State Management

Untuk MVP:

- React state
- URL search params
- Server state

Tidak perlu Redux pada tahap awal.

Jika aplikasi berkembang:

- Zustand

## Backend Layer

Next.js Route Handlers digunakan sebagai BFF/API proxy.

Contoh:

```text
Browser
   ↓
Next.js
   ↓
Sanka API
```

Bukan:

```text
Browser
   ↓
Sanka API
```

Tujuannya:

- Mengontrol request.
- Menambahkan caching.
- Menormalisasi response.
- Menangani error.
- Menyembunyikan implementasi provider.
- Mengurangi request berulang.

---

# 8. External API

## Base URL

```text
https://www.sankavollerei.web.id
```

Dokumentasi API menyediakan banyak endpoint anime dan streaming.

---

# 9. API Rate Limit

Sanka API memiliki:

```text
60 request / menit
```

Pelanggaran rate limit dapat menyebabkan peringatan dan pada pelanggaran berulang dapat menyebabkan permanent ban.

## Requirement

Aplikasi **WAJIB** memiliki caching.

Jangan melakukan:

```text
User A → API
User B → API
User C → API
User D → API
```

Untuk data yang sama.

Idealnya:

```text
User A ─┐
User B ─┤
User C ─┼→ Next.js Cache → Sanka API
User D ─┘
```

---

# 10. API Abstraction Layer

Frontend tidak boleh mengetahui endpoint Sanka secara langsung.

Contoh:

```ts
getAnimeHome()
getLatestAnime()
searchAnime(query)
getAnimeDetail(slug)
getEpisode(slug)
getStream(serverId)
getGenres()
getSchedule()
```

Bukan:

```ts
fetch("https://www.sankavollerei.web.id/anime/...")
```

di setiap component.

---

# 11. API Service Structure

Recommended structure:

```text
src/
├── app/
│   ├── page.tsx
│   ├── anime/
│   │   └── [slug]/
│   ├── watch/
│   │   └── [episode]/
│   ├── search/
│   ├── genre/
│   ├── schedule/
│   └── api/
│       └── ...
│
├── components/
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── anime.ts
│   │   ├── episode.ts
│   │   ├── search.ts
│   │   └── schedule.ts
│   │
│   ├── cache/
│   ├── utils/
│   └── constants/
│
├── types/
│   ├── anime.ts
│   ├── episode.ts
│   └── api.ts
│
└── config/
    └── api.ts
```

---

# 12. API Endpoints yang Diprioritaskan

Tidak semua endpoint dari Sanka API akan digunakan pada MVP.

## Priority P0

Endpoint yang wajib untuk MVP.

### Home

```http
GET /anime/home
```

Digunakan untuk homepage Otakudesu.

### Search

```http
GET /anime/search/:keyword
```

Digunakan untuk pencarian anime.

### Anime Detail

```http
GET /anime/anime/:slug
```

Digunakan untuk detail anime dan metadata.

### Episode

```http
GET /anime/episode/:slug
```

Digunakan untuk mendapatkan detail episode dan link streaming.

### Stream Server

```http
GET /anime/server/:serverId
```

Digunakan untuk mengambil URL embed berdasarkan server ID.

---

# 13. Priority P1

### Ongoing

```http
GET /anime/ongoing-anime?page=1
```



### Completed

```http
GET /anime/complete-anime?page=1
```



### Genre

```http
GET /anime/genre
```

dan:

```http
GET /anime/genre/:slug
```



### Schedule

```http
GET /anime/schedule
```



---

# 14. Priority P2

Fitur tambahan:

- Batch anime.
- Movie.
- All Anime.
- Donghua.
- Samehadaku.
- Animasu.
- Animekuindo.
- Animekompi.
- Oploverz.
- Anoboy.
- Kusonime.

Dokumentasi Sanka menyediakan endpoint khusus untuk berbagai sumber tersebut.

---

# 15. Homepage

Route:

```text
/
```

## Sections

### Hero

Menampilkan anime featured.

Elements:

- Background poster.
- Anime title.
- Japanese title jika tersedia.
- Description.
- Genre.
- Status.
- CTA `Watch Now`.
- CTA `Detail`.

---

### Continue Watching

Jika local watch history tersedia:

```text
Continue Watching
```

Card:

```text
Anime
Episode
Progress
Continue button
```

---

### Latest Episodes

Menampilkan episode terbaru.

Card:

```text
Poster
Title
Episode
Release info
```

---

### Popular Anime

Menampilkan anime populer.

---

### Ongoing Anime

Menampilkan anime yang sedang tayang.

---

### Schedule

Menampilkan jadwal anime.

---

### Genre

Horizontal scroll:

```text
Action
Adventure
Comedy
Drama
Fantasy
Romance
...
```

---

# 16. Anime Card

Setiap card minimal memiliki:

```text
Poster
Title
Episode
Status
Type
```

Optional:

```text
Rating
Year
Quality
```

## Interaction

Hover desktop:

- Show play button.
- Show quick metadata.
- Show detail button.

Mobile:

- Tap → Anime Detail.

---

# 17. Search

Route:

```text
/search?q=naruto
```

Search input harus:

- Debounce.
- URL synchronized.
- Menampilkan loading state.
- Menampilkan empty state.
- Menampilkan error state.

Sanka menyediakan endpoint search berdasarkan keyword.

---

# 18. Search UX

Contoh:

```text
┌────────────────────────────────────────────┐
│ 🔍 Search anime...                         │
└────────────────────────────────────────────┘
```

Setelah submit:

```text
Search results for "One Piece"

[Card] [Card] [Card] [Card]
[Card] [Card] [Card] [Card]
```

---

# 19. Anime Detail Page

Route:

```text
/anime/[slug]
```

## Layout

Desktop:

```text
┌───────────────────────────────────────────┐
│                 HERO                      │
│                                           │
│ Poster │ Title                            │
│        │ Description                      │
│        │ Genre                            │
│        │ Status                           │
│        │ Watch Now                        │
└───────────────────────────────────────────┘

Episodes
─────────────────────────────────────────────
Episode 1
Episode 2
Episode 3
Episode 4
...
```

---

# 20. Anime Detail Data

Jika tersedia dari API:

- Title.
- Alternative title.
- Japanese title.
- Poster.
- Cover.
- Synopsis.
- Genre.
- Status.
- Type.
- Duration.
- Release date/year.
- Studio.
- Rating.
- Total episode.
- Episode list.

Karena struktur response provider dapat berbeda, field yang tidak tersedia harus di-handle sebagai optional.

---

# 21. Episode List

Episode list harus mendukung:

- Search episode.
- Pagination jika diperlukan.
- Sort ascending.
- Sort descending.
- Current episode indicator.

Contoh:

```text
Episodes

[ Search episode... ]

01   Episode 1
02   Episode 2
03   Episode 3
...
```

---

# 22. Watch Page

Route:

```text
/watch/[episodeSlug]
```

## Main Layout

```text
┌─────────────────────────────────────────────┐
│                                             │
│              VIDEO PLAYER                   │
│                                             │
└─────────────────────────────────────────────┘

Anime Name
Episode 12

[ Previous ] [ Episode List ] [ Next ]

Servers:
[ Server 1 ] [ Server 2 ] [ Server 3 ]

─────────────────────────────────────────────

Episodes
01  02  03  04  05  06 ...
```

---

# 23. Streaming Flow

Flow:

```text
Watch Page
    ↓
Episode API
    ↓
Get server list
    ↓
User selects server
    ↓
Server API
    ↓
Receive embed URL
    ↓
Render player/embed
```

Sanka menyediakan endpoint server yang mengambil URL embed berdasarkan server ID dari detail episode.

---

# 24. Player

Player harus:

- Responsive.
- 16:9.
- Fullscreen.
- Mobile-friendly.
- Loading state.
- Error state.
- Server switching.
- Next episode.
- Previous episode.

Jika provider memberikan URL embed:

```html
<iframe />
```

dapat digunakan sesuai kebutuhan provider.

Iframe harus:

```css
border: 0;
width: 100%;
aspect-ratio: 16 / 9;
```

---

# 25. Server Selection

Jika episode memiliki beberapa server:

```text
Streaming Server

[ Server 1 ]
[ Server 2 ]
[ Server 3 ]
```

Server aktif diberi visual indicator.

Jika server gagal:

```text
Server unavailable.

Try another server.
```

---

# 26. Episode Navigation

Watch page harus memiliki:

```text
← Previous Episode

Episode List

Next Episode →
```

Jika episode pertama:

```text
Previous disabled
```

Jika episode terakhir:

```text
Next disabled
```

---

# 27. Continue Watching

MVP dapat menggunakan:

```text
localStorage
```

Data:

```ts
{
  animeSlug: string
  animeTitle: string
  episodeSlug: string
  episodeNumber: number
  progress?: number
  updatedAt: number
}
```

Maximum:

```text
20 anime
```

Data lama dihapus berdasarkan LRU.

---

# 28. Watch History

User dapat melihat:

```text
History
```

Isi:

- Anime.
- Episode terakhir.
- Waktu terakhir ditonton.
- Continue button.
- Remove button.
- Clear history.

---

# 29. Favorites

MVP:

```text
localStorage
```

User dapat:

```text
♡ Add Favorite
♥ Remove Favorite
```

Page:

```text
/favorites
```

---

# 30. Schedule Page

Route:

```text
/schedule
```

Data berasal dari:

```http
GET /anime/schedule
```

Endpoint tersebut digunakan untuk mendapatkan jadwal rilis anime per hari.

UI:

```text
Monday
├── Anime A
├── Anime B

Tuesday
├── Anime C
├── Anime D

Wednesday
...
```

---

# 31. Genre Page

Route:

```text
/genre
```

Menampilkan semua genre.

Detail:

```text
/genre/[slug]
```

API:

```http
GET /anime/genre
GET /anime/genre/:slug
```



---

# 32. Ongoing Page

Route:

```text
/ongoing
```

API:

```http
GET /anime/ongoing-anime?page=1
```

Pagination:

```text
Previous
1
2
3
4
5
Next
```

---

# 33. Completed Page

Route:

```text
/completed
```

API:

```http
GET /anime/complete-anime?page=1
```

---

# 34. Movie Page

Route:

```text
/movies
```

Movie support dapat menggunakan endpoint provider yang tersedia.

Contoh Stream API:

```http
GET /anime/stream/movie/:page?
```

yang menyediakan daftar anime tipe Movie.

---

# 35. Multi-Provider Architecture

Aplikasi harus dirancang supaya Sanka bukan hard dependency di seluruh application layer.

Gunakan interface:

```ts
interface AnimeProvider {
  getHome(): Promise<AnimeHome>
  search(query: string): Promise<Anime[]>
  getDetail(slug: string): Promise<AnimeDetail>
  getEpisode(slug: string): Promise<EpisodeDetail>
  getGenres(): Promise<Genre[]>
  getSchedule(): Promise<Schedule>
}
```

Implementasi:

```text
providers/
├── sanka/
│   ├── client.ts
│   ├── anime.ts
│   ├── episode.ts
│   └── mapper.ts
│
└── index.ts
```

Tujuannya agar provider dapat diganti tanpa rewrite seluruh UI.

---

# 36. Response Normalization

Jangan biarkan frontend bergantung pada response mentah provider.

Contoh internal model:

```ts
type Anime = {
  id?: string
  slug: string
  title: string
  alternativeTitles?: string[]
  poster?: string
  cover?: string
  synopsis?: string
  type?: string
  status?: string
  year?: number
  rating?: number
  genres?: Genre[]
}
```

---

# 37. Error Handling

Semua API request harus menangani:

### 400

```text
Invalid request
```

### 404

```text
Anime not found
```

### 429

```text
Too many requests

Please try again later.
```

### 500

```text
Anime service is temporarily unavailable.
```

### Timeout

```text
The anime service took too long to respond.
```

---

# 38. Rate Limit Protection

Implement:

## Cache

Contoh TTL:

| Data | TTL |
|---|---:|
| Genre | 24 jam |
| Schedule | 30 menit |
| Home | 5 menit |
| Popular | 10 menit |
| Ongoing | 5 menit |
| Completed | 30 menit |
| Search | 2 menit |
| Detail | 30 menit |
| Episode | 5 menit |
| Server | 1-5 menit |

TTL dapat diubah berdasarkan perilaku API.

---

# 39. Request Deduplication

Jika 100 user membuka anime yang sama secara bersamaan:

```text
100 users
   ↓
Next.js
   ↓
1 API request
   ↓
Sanka
```

Bukan:

```text
100 users
   ↓
100 Sanka requests
```

---

# 40. Search Rate Limiting

Search harus menggunakan debounce:

```text
300-500ms
```

Jangan melakukan request:

```text
o
on
one
one p
one pi
one pie
```

untuk setiap karakter.

Lebih baik:

```text
User typing
    ↓
Debounce
    ↓
User pauses
    ↓
API request
```

---

# 41. Caching Strategy

Recommended Next.js pattern:

```ts
fetch(url, {
  next: {
    revalidate: 300
  }
})
```

Untuk data yang sangat stabil:

```ts
revalidate: 86400
```

Untuk data episode terbaru:

```ts
revalidate: 60
```

Nilai final harus disesuaikan setelah testing API.

---

# 42. SEO

Karena anime page bersifat public, SEO menjadi prioritas.

Setiap anime:

```text
/anime/one-piece
```

harus memiliki:

```html
<title>One Piece - Watch Anime</title>
<meta name="description" />
<meta property="og:title" />
<meta property="og:image" />
```

Gunakan Next.js Metadata API.

---

# 43. Dynamic Metadata

Anime detail:

```text
One Piece
Watch One Piece Sub Indo
```

Episode:

```text
One Piece Episode 1148
```

Search:

```text
Search anime: One Piece
```

---

# 44. Sitemap

Generate:

```text
/sitemap.xml
```

Untuk:

- Home.
- Anime.
- Genre.
- Schedule.
- Search index jika relevan.

Jangan generate sitemap dengan melakukan request besar ke API setiap request sitemap.

Gunakan cache atau static generation.

---

# 45. Robots

```text
/robots.txt
```

Allow:

```text
/
```

Block:

```text
/api/
```

jika endpoint internal tidak ingin di-index.

---

# 46. UI/UX Direction

## Visual Style

Target visual:

**Dark Anime Streaming UI**

Characteristics:

- Dark background.
- Large cinematic hero.
- Poster cards.
- Rounded corners.
- Subtle gradients.
- Minimal border.
- Smooth hover animation.
- Strong typography.
- High contrast.

---

# 47. Color System

Suggested:

```text
Background:
#080808

Surface:
#111111

Surface Elevated:
#181818

Text Primary:
#FFFFFF

Text Secondary:
#A1A1AA

Accent:
#7C3AED
```

Accent dapat diganti sesuai branding.

---

# 48. Navbar

Desktop:

```text
LOGO

Home
Anime
Ongoing
Completed
Schedule
Genre

        🔍 Search
        ♡ Favorites
```

Mobile:

```text
Logo       Search
```

Bottom navigation dapat digunakan:

```text
Home
Search
Anime
Schedule
Favorites
```

---

# 49. Loading State

Gunakan skeleton.

Anime card:

```text
┌──────────────┐
│              │
│   Skeleton   │
│              │
├──────────────┤
│ █████████    │
│ ██████       │
└──────────────┘
```

Hindari spinner full-page untuk semua request.

---

# 50. Empty State

Contoh:

```text
No anime found

Try another keyword.
```

---

# 51. Mobile UX

Mobile adalah first-class platform.

Requirement:

- Minimum width: 320px.
- Touch target minimum sekitar 44px.
- Horizontal card carousel.
- Sticky watch controls.
- Fullscreen video.
- Bottom navigation.
- Search mudah diakses.

---

# 52. Accessibility

Requirement:

- Semantic HTML.
- Keyboard navigation.
- Focus state.
- Accessible buttons.
- Alt text poster.
- Contrast ratio yang baik.
- `aria-label` untuk icon-only buttons.

---

# 53. Performance

Target:

### Initial Load

```text
LCP < 2.5s
```

### Interaction

```text
INP < 200ms
```

### Layout Shift

```text
CLS < 0.1
```

Target ini harus diuji menggunakan Lighthouse dan real-world monitoring.

---

# 54. Image Optimization

Gunakan:

```text
next/image
```

Namun karena image URL berasal dari provider eksternal, domain harus dikonfigurasi pada:

```text
next.config.ts
```

Contoh:

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "..."
    }
  ]
}
```

Jangan mengizinkan wildcard domain secara sembarangan.

---

# 55. Security

## API Proxy

Jangan expose internal implementation.

Frontend:

```text
/api/anime/...
```

Backend:

```text
Sanka API
```

---

## SSRF Protection

Jika API memberikan URL streaming/server dari sumber eksternal, aplikasi **tidak boleh sembarang melakukan server-side fetch terhadap URL tersebut**.

Validasi URL terlebih dahulu.

---

# 56. iframe Security

Jika menggunakan iframe:

- Hanya izinkan provider/domain yang diperlukan.
- Jangan menerima arbitrary iframe URL dari user.
- Sanitasi URL.
- Gunakan allowlist domain.

---

# 57. Environment Variables

Contoh:

```env
SANKA_API_URL=https://www.sankavollerei.web.id

NEXT_PUBLIC_APP_URL=https://example.com
```

Jangan:

```env
NEXT_PUBLIC_SANKA_SECRET=...
```

untuk credential server-side.

---

# 58. Logging

Log minimal:

```text
timestamp
endpoint
response status
latency
error
cache hit/miss
```

Contoh:

```text
[SANKA]
GET /anime/anime/one-piece
200
142ms
cache=MISS
```

---

# 59. Monitoring

Monitor:

- API latency.
- API errors.
- HTTP 429.
- 5xx.
- Cache hit rate.
- Watch page failures.
- Server failure.
- Search failures.

Metric penting:

```text
Sanka API success rate
Sanka API 429 count
Average response time
```

---

# 60. Analytics

MVP dapat menggunakan privacy-friendly analytics.

Event:

```text
page_view
search
anime_open
episode_open
watch_start
server_select
next_episode
favorite_add
```

Jangan menyimpan data personal yang tidak diperlukan.

---

# 61. Pages

## MVP Pages

```text
/
├── /search
├── /anime/[slug]
├── /watch/[episodeSlug]
├── /ongoing
├── /completed
├── /schedule
├── /genre
├── /genre/[slug]
├── /favorites
└── /history
```

---

# 62. API Routes Internal

Recommended:

```text
/api/anime/home
/api/anime/search
/api/anime/[slug]
/api/anime/episode/[slug]
/api/anime/server/[serverId]
/api/anime/ongoing
/api/anime/completed
/api/anime/genres
/api/anime/genre/[slug]
/api/anime/schedule
```

Frontend hanya berbicara dengan internal API layer.

---

# 63. Internal API Example

Request:

```http
GET /api/anime/search?q=one-piece
```

Response normalized:

```json
{
  "success": true,
  "data": [
    {
      "slug": "one-piece",
      "title": "One Piece",
      "poster": "https://..."
    }
  ],
  "pagination": {
    "page": 1,
    "hasNext": true
  }
}
```

---

# 64. API Error Format

Semua internal API menggunakan format konsisten:

```json
{
  "success": false,
  "error": {
    "code": "ANIME_NOT_FOUND",
    "message": "Anime tidak ditemukan"
  }
}
```

Success:

```json
{
  "success": true,
  "data": {}
}
```

---

# 65. Data Model

## Anime

```ts
interface Anime {
  slug: string
  title: string
  alternativeTitles?: string[]
  poster?: string
  cover?: string
  synopsis?: string
  type?: string
  status?: string
  year?: number
  rating?: number
  genres?: Genre[]
  episodes?: number
}
```

## Genre

```ts
interface Genre {
  name: string
  slug: string
}
```

## Episode

```ts
interface Episode {
  slug: string
  number?: number
  title?: string
  releaseDate?: string
}
```

## Stream Server

```ts
interface StreamServer {
  id: string
  name: string
  url?: string
}
```

---

# 66. Local Storage Schema

```text
anime_history
anime_favorites
anime_settings
```

Example:

```json
{
  "anime_history": [
    {
      "slug": "one-piece",
      "episodeSlug": "one-piece-episode-1148",
      "episode": 1148,
      "progress": 45,
      "updatedAt": 1750000000000
    }
  ]
}
```

---

# 67. Watch Progress

Jika memungkinkan player/provider memberikan current time:

```text
currentTime
duration
```

simpan:

```text
progress = currentTime / duration
```

Update setiap:

```text
10-15 seconds
```

Jangan update localStorage setiap frame.

---

# 68. Continue Watching Logic

Ketika membuka anime:

```text
if history exists:
    show "Continue Episode X"
else:
    show "Watch Episode 1"
```

---

# 69. Error Recovery

Jika Sanka API gagal:

```text
Request
   ↓
Sanka
   ↓
Error
   ↓
Retry once
   ↓
Still error
   ↓
Cached response?
   ├── YES → serve stale cache
   └── NO → error UI
```

---

# 70. Stale Cache

Untuk halaman seperti:

- Home.
- Popular.
- Genre.
- Completed.

Jika API sedang down dan cache tersedia, aplikasi dapat menampilkan cache terakhir.

UI:

```text
Data may be slightly outdated.
```

---

# 71. Retry Strategy

Jangan melakukan infinite retry.

Maximum:

```text
1-2 retries
```

gunakan exponential backoff:

```text
500ms
1s
```

Jangan retry error:

```text
404
```

---

# 72. API Timeout

Set timeout:

```text
5-10 seconds
```

Jika timeout:

```text
Abort request
```

Kemudian tampilkan fallback.

---

# 73. Provider Failure

Jika satu source/provider gagal:

```text
Source unavailable
```

Jangan membuat seluruh homepage crash.

Gunakan partial rendering.

Contoh:

```text
Latest Anime       ✓
Popular Anime      ✓
Schedule           ✕
```

Homepage tetap ditampilkan.

---

# 74. Component Architecture

```text
components/
├── layout/
│   ├── Navbar
│   ├── Footer
│   └── MobileNav
│
├── anime/
│   ├── AnimeCard
│   ├── AnimeGrid
│   ├── AnimeHero
│   ├── AnimeMeta
│   └── EpisodeList
│
├── watch/
│   ├── VideoPlayer
│   ├── ServerSelector
│   ├── EpisodeNavigation
│   └── WatchControls
│
├── search/
│   ├── SearchInput
│   └── SearchResults
│
└── ui/
    ├── Skeleton
    ├── EmptyState
    ├── ErrorState
    └── Button
```

---

# 75. Homepage Component Tree

```text
HomePage
├── Navbar
├── Hero
├── ContinueWatching
├── LatestSection
│   └── AnimeCard[]
├── PopularSection
│   └── AnimeCard[]
├── OngoingSection
│   └── AnimeCard[]
├── ScheduleSection
├── GenreSection
└── Footer
```

---

# 76. Anime Detail Component Tree

```text
AnimeDetailPage
├── Navbar
├── AnimeHero
│   ├── Poster
│   ├── Metadata
│   └── ActionButtons
├── Synopsis
├── GenreList
├── EpisodeSection
│   ├── EpisodeSearch
│   └── EpisodeList
├── RelatedAnime
└── Footer
```

---

# 77. Watch Component Tree

```text
WatchPage
├── Navbar
├── VideoPlayer
├── AnimeTitle
├── EpisodeNavigation
├── ServerSelector
├── EpisodeList
├── RelatedAnime
└── Footer
```

---

# 78. Routing Strategy

Next.js App Router:

```text
app/
├── page.tsx
├── search/
│   └── page.tsx
├── anime/
│   └── [slug]/
│       └── page.tsx
├── watch/
│   └── [episodeSlug]/
│       └── page.tsx
├── genre/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── ongoing/
│   └── page.tsx
├── completed/
│   └── page.tsx
└── schedule/
    └── page.tsx
```

---

# 79. Rendering Strategy

## Server Components

Gunakan untuk:

- Homepage.
- Anime detail.
- Search result initial load.
- Genre page.
- Ongoing.
- Completed.
- Schedule.

## Client Components

Gunakan untuk:

- Search input.
- Favorite button.
- Watch history.
- Video player.
- Server selector.
- Episode navigation interaction.

---

# 80. Caching Architecture

```text
             ┌──────────────┐
             │    Browser   │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │   Next.js    │
             └──────┬───────┘
                    │
             ┌──────▼───────┐
             │ Cache Layer  │
             └──────┬───────┘
                    │
             Cache Hit?
               /       \
             YES        NO
              │          │
              ▼          ▼
           Response   Sanka API
                         │
                         ▼
                       Cache
```

---

# 81. Recommended Cache Storage

MVP:

```text
Next.js Data Cache
```

Production scale:

```text
Redis / Upstash Redis
```

Redis berguna jika aplikasi berjalan pada banyak instance.

---

# 82. Pagination

Gunakan pagination dari provider jika tersedia.

URL:

```text
/ongoing?page=2
```

Jangan load seluruh database anime ke browser.

---

# 83. Infinite Scroll

MVP menggunakan pagination biasa terlebih dahulu.

Infinite scroll dapat menjadi enhancement.

Reason:

- SEO lebih mudah.
- URL dapat dibagikan.
- Browser history lebih jelas.
- Request lebih terkontrol.

---

# 84. Search Suggestion

Enhancement P2:

```text
User types:
one pi
   ↓
Suggestions:
One Piece
One Piece Film Red
One Piece Movie
```

Request harus di-debounce.

---

# 85. Keyboard Shortcut

Watch page:

```text
← Previous
→ Next
Space Play/Pause
F Fullscreen
```

Jangan override shortcut jika sedang fokus pada input.

---

# 86. Dark Mode

MVP:

```text
Dark only
```

Future:

```text
Dark
Light
System
```

---

# 87. Responsive Breakpoints

Recommended:

```text
sm
md
lg
xl
2xl
```

Grid:

```text
Mobile: 2 columns
Tablet: 3-4 columns
Desktop: 5-6 columns
Large: 6-8 columns
```

Jumlah final card harus mengikuti ukuran poster dan readability.

---

# 88. Legal / Content Notice

Aplikasi harus memiliki halaman:

```text
/about
/disclaimer
/privacy
/terms
/contact
```

Disclaimer harus menjelaskan bahwa aplikasi menggunakan third-party API/provider dan tidak mengklaim kepemilikan atas konten pihak ketiga.

Pastikan penggunaan data/API dan embed sesuai dengan izin, terms, serta hukum yang berlaku.

---

# 89. Provider Attribution

Karena aplikasi bergantung pada Sanka API, dokumentasi/credits dapat menyediakan attribution:

```text
Powered by Sanka Anime API
```

Sanka API sendiri mencantumkan proyek/API sebagai karya Sanka Vollerei.

---

# 90. API Documentation Page

Optional:

```text
/api-docs
```

Menjelaskan:

- Data source.
- Provider status.
- API limitations.
- Cache policy.
- Credits.

Tidak wajib untuk public MVP.

---

# 91. Admin Dashboard

MVP tidak membutuhkan authentication admin.

P2:

```text
/admin
```

Dashboard:

```text
API Status
Cache Status
Request Count
429 Count
Error Count
Popular Anime
Watch Count
```

---

# 92. Feature Priorities

## P0

| Feature | Priority |
|---|---|
| Homepage | P0 |
| Anime search | P0 |
| Anime detail | P0 |
| Episode list | P0 |
| Watch page | P0 |
| Streaming server | P0 |
| Responsive UI | P0 |
| API caching | P0 |
| Error handling | P0 |
| SEO | P0 |

## P1

| Feature | Priority |
|---|---|
| Ongoing | P1 |
| Completed | P1 |
| Genre | P1 |
| Schedule | P1 |
| Favorites | P1 |
| History | P1 |
| Continue Watching | P1 |

## P2

| Feature | Priority |
|---|---|
| Login | P2 |
| Cloud watch history | P2 |
| Notifications | P2 |
| Multiple providers | P2 |
| PWA | P2 |
| Admin dashboard | P2 |
| Recommendation system | P2 |

---

# 93. MVP Definition

MVP dianggap selesai jika user dapat:

```text
1. Membuka homepage
2. Melihat anime
3. Mencari anime
4. Membuka detail anime
5. Melihat episode
6. Membuka episode
7. Memilih server
8. Menonton melalui player/embed
9. Berpindah episode
10. Mengakses dari mobile
```

Dan:

```text
API request terlindungi oleh cache
```

---

# 94. Acceptance Criteria

## Homepage

- [ ] Homepage dapat dibuka tanpa error.
- [ ] Anime cards tampil.
- [ ] Loading skeleton tersedia.
- [ ] Empty state tersedia.
- [ ] API failure tidak membuat seluruh page crash.

## Search

- [ ] User dapat mencari anime.
- [ ] Search menggunakan debounce.
- [ ] Search result dapat dibuka.
- [ ] Query tersimpan di URL.
- [ ] Empty result ditangani.

## Anime Detail

- [ ] Detail anime tampil.
- [ ] Poster tampil.
- [ ] Synopsis tampil.
- [ ] Genre tampil.
- [ ] Episode tampil.
- [ ] Watch button berfungsi.

## Watch

- [ ] Episode dapat dibuka.
- [ ] Server tersedia.
- [ ] Player dapat dirender.
- [ ] Next episode berfungsi.
- [ ] Previous episode berfungsi.
- [ ] Error server ditangani.

## Performance

- [ ] Cache digunakan.
- [ ] Tidak ada duplicate request berlebihan.
- [ ] Image optimization aktif.
- [ ] Mobile performance diuji.

---

# 95. Development Phases

## Phase 1 — Foundation

```text
- Setup Next.js
- Setup TypeScript
- Setup Tailwind
- Setup shadcn/ui
- Setup API client
- Setup types
- Setup environment
```

---

## Phase 2 — API Layer

```text
- Sanka client
- Response mapper
- Error handler
- Cache
- Timeout
- Retry
```

---

## Phase 3 — Core UI

```text
- Navbar
- Homepage
- Anime card
- Search
- Anime detail
- Episode list
```

---

## Phase 4 — Streaming

```text
- Watch page
- Episode API
- Server selector
- Embed player
- Next/Previous
```

---

## Phase 5 — Discovery

```text
- Ongoing
- Completed
- Genre
- Schedule
- Movies
```

---

## Phase 6 — Personalization

```text
- Favorites
- History
- Continue watching
- Watch progress
```

---

## Phase 7 — Optimization

```text
- SEO
- Sitemap
- Performance
- Cache tuning
- Error monitoring
- Analytics
```

---

# 96. Recommended Project Structure

```text
anime-streaming/
│
├── app/
│   ├── api/
│   │   └── anime/
│   │       ├── home/
│   │       ├── search/
│   │       ├── [slug]/
│   │       ├── episode/
│   │       └── server/
│   │
│   ├── anime/
│   │   └── [slug]/
│   │
│   ├── watch/
│   │   └── [episodeSlug]/
│   │
│   ├── search/
│   ├── ongoing/
│   ├── completed/
│   ├── genre/
│   ├── schedule/
│   ├── favorites/
│   ├── history/
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── anime/
│   ├── watch/
│   ├── search/
│   ├── layout/
│   └── ui/
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── anime.ts
│   │   ├── episode.ts
│   │   └── mapper.ts
│   │
│   ├── cache/
│   └── utils/
│
├── types/
│   ├── anime.ts
│   ├── episode.ts
│   └── api.ts
│
├── public/
│
├── .env.local
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

# 97. Environment

Development:

```text
localhost:3000
```

Production:

```text
https://your-domain.com
```

Environment:

```env
SANKA_API_URL=https://www.sankavollerei.web.id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# 98. Recommended Dependencies

Core:

```bash
npm install next react react-dom
```

UI:

```bash
npm install lucide-react
```

Optional:

```bash
npm install zustand
npm install swr
```

Development:

```bash
npm install -D typescript
```

Tailwind dan shadcn mengikuti setup resmi Next.js pada saat project dibuat.

---

# 99. Testing

## Unit Test

Test:

- API mapper.
- Slug handling.
- Episode parser.
- Cache logic.
- Error normalization.

## Integration Test

Test:

```text
Search → Result → Detail → Episode → Watch
```

## E2E

Test dengan:

```text
Playwright
```

Scenario:

```text
Open homepage
→ search One Piece
→ open result
→ open episode
→ select server
→ verify player
```

---

# 100. API Contract Testing

Karena API masih berkembang, response provider harus dites.

Test:

```text
Home
Search
Detail
Episode
Server
Schedule
Genre
```

Jika struktur response berubah:

```text
Provider Mapper
```

yang diperbaiki terlebih dahulu.

Frontend tidak boleh ikut rusak.

---

# 101. Critical Architecture Rule

**Frontend tidak boleh bergantung langsung pada raw Sanka response.**

Architecture:

```text
Sanka API
   ↓
Sanka Client
   ↓
Mapper
   ↓
Normalized Domain Model
   ↓
Next.js API / Server Components
   ↓
React Components
```

Ini adalah bagian paling penting dari architecture aplikasi.

---

# 102. Scalability

Initial:

```text
Next.js
+
Sanka API
+
Next.js Cache
```

Scale-up:

```text
                 ┌──────────────┐
                 │   CDN        │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │   Next.js    │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │    Redis     │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │  Sanka API   │
                 └──────────────┘
```

---

# 103. Important API Constraint

Sanka API memiliki limit:

```text
60 requests/minute
```

Maka architecture harus menganggap Sanka API sebagai **limited upstream resource**, bukan database internal yang dapat di-query sesuka hati.

Contoh buruk:

```text
Homepage
 ├── home request
 ├── popular request
 ├── ongoing request
 ├── schedule request
 ├── genres request
 └── 20 detail request
```

Satu page dapat dengan mudah menghasilkan puluhan request.

Contoh lebih baik:

```text
Homepage
   ↓
Cached aggregate data
   ↓
Minimal upstream requests
```

---

# 104. Source Strategy

Untuk MVP, gunakan satu sumber utama terlebih dahulu.

Recommended:

```text
Primary:
Otakudesu / Stream API
```

Secondary provider dapat ditambahkan kemudian.

Sanka juga menyediakan Stream API khusus anime Indonesia dengan endpoint latest, popular, search, detail, episode, movie, list, dan genre.

---

# 105. Provider Fallback

Future architecture:

```text
Primary Provider
      ↓
   Failure?
    /    \
  No      Yes
  ↓        ↓
Return   Secondary
           ↓
        Failure?
          ↓
       Cached data
```

Jangan melakukan fallback berantai terlalu agresif karena dapat memperbanyak request.

---

# 106. Definition of Done

Feature dianggap selesai apabila:

- [ ] UI selesai.
- [ ] Responsive.
- [ ] API integration selesai.
- [ ] Loading state tersedia.
- [ ] Empty state tersedia.
- [ ] Error state tersedia.
- [ ] Cache diterapkan.
- [ ] Tidak menyebabkan request spam.
- [ ] Mobile tested.
- [ ] Desktop tested.
- [ ] SEO metadata tersedia.
- [ ] TypeScript tidak memiliki error.
- [ ] Lint tidak memiliki error.
- [ ] E2E critical flow berhasil.

---

# 107. Final Product Vision

Produk akhir harus terasa seperti:

```text
Netflix-like UX
+
Anime catalog
+
Fast search
+
Episode-centric navigation
+
Simple streaming experience
```

Bukan:

```text
Raw API viewer
```

Fokus utama:

> **Cari anime secepat mungkin, pilih episode secepat mungkin, lalu langsung nonton.**

---

# 108. MVP Success Metrics

Target awal:

| Metric | Target |
|---|---:|
| Homepage load | < 2.5s |
| Search response | < 2s |
| Anime detail | < 2s |
| Watch page load | < 3s |
| API cache hit | > 60% |
| Failed API requests | < 5% |
| HTTP 429 | Mendekati 0 |
| Mobile usable | 100% |
| Critical flow success | > 95% |

---

# 109. Future Roadmap

## v1.0

```text
Homepage
Search
Anime Detail
Episode
Watch
Ongoing
Completed
Genre
Schedule
```

## v1.1

```text
Favorites
History
Continue Watching
Watch Progress
```

## v1.2

```text
PWA
Notifications
Better recommendations
Multiple streaming providers
```

## v2.0

```text
Authentication
Cloud sync
User profile
Personalized recommendation
Admin dashboard
Analytics dashboard
```

---

# 110. Final Architecture

```text
                         USER
                          │
                          ▼
                  ┌───────────────┐
                  │    Browser    │
                  │ React / Next  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    Next.js    │
                  │ App Router    │
                  └───────┬───────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
              ▼           ▼           ▼
           Search      Anime       Watch
           Service     Service     Service
              │           │           │
              └───────────┼───────────┘
                          ▼
                  ┌───────────────┐
                  │ Cache Layer   │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Sanka Client  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  Sanka API    │
                  └───────┬───────┘
                          │
             ┌────────────┼─────────────┐
             ▼            ▼             ▼
         Anime Data   Episode Data   Server Data
             │            │             │
             └────────────┼─────────────┘
                          ▼
                     Watch UI
```

---

# 111. Key Engineering Principles

1. **Cache aggressively.**
2. **Never spam Sanka API.**
3. **Normalize provider response.**
4. **Keep provider logic separate from UI.**
5. **Use server-side fetching wherever appropriate.**
6. **Treat streaming URL as external/untrusted data.**
7. **Handle provider failure gracefully.**
8. **Mobile-first.**
9. **SEO-friendly.**
10. **Keep MVP small before adding accounts/social features.**

---

# 112. MVP Build Order

Urutan implementasi yang direkomendasikan:

```text
01. Project Setup
        ↓
02. Sanka API Client
        ↓
03. Response Mapper
        ↓
04. Cache Layer
        ↓
05. Anime Types
        ↓
06. Homepage
        ↓
07. Anime Card
        ↓
08. Search
        ↓
09. Anime Detail
        ↓
10. Episode List
        ↓
11. Watch Page
        ↓
12. Server Selector
        ↓
13. Next / Previous Episode
        ↓
14. Ongoing
        ↓
15. Completed
        ↓
16. Genre
        ↓
17. Schedule
        ↓
18. Favorites
        ↓
19. History
        ↓
20. SEO
        ↓
21. Performance
        ↓
22. Production
```

---

# 113. MVP Release Checklist

### Product

- [ ] Homepage
- [ ] Search
- [ ] Detail
- [ ] Episode
- [ ] Watch
- [ ] Streaming server
- [ ] Ongoing
- [ ] Completed
- [ ] Genre
- [ ] Schedule

### Engineering

- [ ] TypeScript
- [ ] API abstraction
- [ ] Cache
- [ ] Timeout
- [ ] Retry
- [ ] Error handling
- [ ] Rate-limit protection
- [ ] Image optimization

### UX

- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] Skeleton
- [ ] Empty state
- [ ] Error state
- [ ] Loading state

### SEO

- [ ] Metadata
- [ ] OG image
- [ ] Sitemap
- [ ] Robots
- [ ] Canonical URL

### Production

- [ ] Environment variables
- [ ] Monitoring
- [ ] Logging
- [ ] Analytics
- [ ] Legal pages
- [ ] Provider attribution

---

# 114. Reference

Primary API documentation:

```text
https://www.sankavollerei.web.id/anime/
```

Dokumentasi yang digunakan sebagai dasar PRD ini menyediakan endpoint untuk anime home, schedule, detail, search, episode, server streaming, ongoing, completed, genre, movie, serta berbagai sumber/provider anime lainnya.

API juga secara eksplisit menyatakan bahwa layanan masih dalam pengembangan dan memiliki rate limit 60 request/menit.

---

# End of PRD