# HailFiles — Material You 3 Expressive

Web interface for browsing and downloading apps, restyled with **Material You 3 Expressive** following the [`material-3-skill`](https://github.com/hamen/material-3-skill) guidelines.

> **Architecture (v2)**: this repo contains only the UI (`index.html`). All data (apps list, icons, screenshots) lives in a separate repo: [`kardeiro/HailFiles-Database`](https://github.com/kardeiro/HailFiles-Database). APKs and other large binaries are referenced as **external URLs** (GitHub Releases / CDN) — they are never committed to either repo.

## How data loading works

The UI never downloads the full database. It uses a layered, lazy strategy:

| Step | What is fetched | When | Approx. size |
|---|---|---|---|
| 1 | `index.json` from `HailFiles-Database` | once on home load (cached 1h in `localStorage`) | ~1 KB per app |
| 2 | `icons/<id>.png` | only for cards visible in the viewport (`<img loading="lazy">`) | ~4 KB each |
| 3 | `apps/<id>.json` | **only when the user opens the detail modal** for that app | ~1-2 KB each |
| 4 | `screenshots/<id>-N.png` | lazy-loaded inside the detail modal | 50-500 KB each |
| 5 | APK file (external URL) | only when the user clicks **Baixar APK** | full APK size |

Even with 1,000 apps in the database, a user who only browses the home page downloads ~1 MB total. A user who opens details for 5 apps downloads ~5 KB extra in JSON + ~1-2 MB in screenshots. The full repo is **never** downloaded.

### Pagination

Cards are rendered in pages of 12. An `IntersectionObserver` watches a sentinel element at the bottom of the grid and triggers the next page render when the user scrolls near it. This keeps the DOM light even with thousands of apps.

### Refresh

The top app bar has a refresh button (↻) that forces a re-fetch of `index.json`, bypassing the `localStorage` cache. Useful for picking up newly added apps without waiting for the 1-hour TTL.

## Features

### Material You 3 Expressive

- **Full M3 token system**: color (light/dark), typography, shape (expressive scale with `large-increased`, `extra-large`, `extra-large-increased`, `extra-extra-large`), motion (emphasized easing + duration tokens), 8dp spacing grid
- **Roboto Flex** variable font (brand + plain), emphasized type variants for active states and headlines
- **Shape morphing**: cards (large → extra-large on hover), chips (small → full on active), search bar (extra-large → large on focus), buttons (full → large on press)
- **Tonal surfaces** hierarchy (5 container levels + `surface-dim` / `surface-bright`)
- **Material Symbols Outlined** variable font (FILL/wght/GRAD/opsz axes)
- **State layers** on all interactive elements (8/12/16% `currentColor` overlay)
- **Mobile-first responsive** (390px → 1200px), respects `prefers-reduced-motion`

### Components

- **Top App Bar** with brand badge (shape-morphs on hover) + refresh + theme toggle
- **Hero** with `Display Medium Emphasized` headline
- **Search bar** with extra-large corners that constrict on focus + 4px primary halo
- **Filter chips** with shape morph on active
- **Cards** with extra-large corners, icon morph, gentle lift + elevation 1 on hover, staggered entry animation
- **Skeleton loading** while `index.json` is being fetched (shimmer animation)
- **Infinite scroll** via `IntersectionObserver`
- **Detail modal** (full-screen on mobile, centered dialog on desktop) with:
  - Hero (icon + title + author + badges)
  - Download APK + Share actions
  - Long description
  - Horizontal screenshots carousel (scroll-snap)
  - Info grid (version, size, updated, requires, language, author)
  - Permissions pills
  - Changelog timeline
  - Tags
- **Snackbar / Toast** for feedback (inverse-surface, extra-small corners per M3 spec)
- **Escape / scrim click** to close modal; focus restored to last element

## Run locally

Just open `index.html` in a browser — no server required. The UI fetches data directly from `raw.githubusercontent.com` (CORS-enabled).

```bash
# Option 1: open file directly
open index.html

# Option 2: serve via HTTP (optional)
python3 -m http.server 8000
# then open http://localhost:8000
```

## Configuration

The database URL is configured via the `--db-base` CSS custom property in `:root`:

```css
:root {
  --db-base: https://raw.githubusercontent.com/kardeiro/HailFiles-Database/main;
  --db-cache-ttl-ms: 3600000; /* 1 hour */
  --page-size: 12;
}
```

To point to a fork or a different database repo, change `--db-base`. The UI expects the schema documented in [`HailFiles-Database/README.md`](https://github.com/kardeiro/HailFiles-Database#readme).

## Adding new apps

See [`ADDING-APPS.md`](https://github.com/kardeiro/HailFiles-Database/blob/main/ADDING-APPS.md) in the database repo for a safe step-by-step guide that ensures existing apps are never lost.

## Project structure

```
HailFiles-M3-Expressive/   ← this repo (UI only)
├── index.html             ← single-file UI (HTML + CSS + JS)
├── README.md              ← this file
└── .gitignore

HailFiles-Database/        ← sister repo (data only)
├── index.json             ← lightweight list of all apps
├── apps/<id>.json         ← per-app full details (lazy-loaded)
├── icons/<id>.png         ← app icons (lazy-loaded)
├── screenshots/<id>-*.png ← detail screen images (lazy-loaded)
├── README.md              ← schema + URL conventions
└── ADDING-APPS.md         ← safe step-by-step guide for adding apps
```

## License

Same as the upstream HailFiles project.
