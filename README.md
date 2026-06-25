# HailFiles — Material You 3 Expressive

Web interface for distributing files and apps, restyled with **Material You 3 Expressive** following the [`material-3-skill`](https://github.com/hamen/material-3-skill) guidelines.

## What's new vs. the original HailFiles

This fork keeps the original data structure (`data/apps.json` + `assets/icons/` + `assets/apks/`) but completely rebuilds `index.html` to use the Material 3 Expressive design system.

### Tokens
- Full `--md-sys-color-*` token system (light + dark schemes)
- Tonal surface hierarchy: `surface-container-lowest` → `surface-container-highest`, plus `surface-dim` / `surface-bright`
- Shape scale including expressive corners: `large-increased` (20px), `extra-large` (28px), `extra-large-increased` (32px), `extra-extra-large` (48px)
- Motion tokens: emphasized / standard easing + 4 short / 4 medium / 2 long durations
- 8dp spacing system: `--md-sys-spacing-xxs` (4) → `--md-sys-spacing-xxl` (64)

### Typography
- Variable font **Roboto Flex** (brand + plain typefaces)
- Full MD3 typescale (Display / Headline / Title / Body / Label, 3 sizes each)
- Emphasized variants (weight 500-600) for active states, headlines and primary actions

### Components
- **Top App Bar** with brand badge (shape-morphs large → extra-large on hover)
- **Search Bar** with extra-large corners that constrict to large on focus + 4px primary halo
- **Filter Chips** with shape morph (small → full) on active
- **Cards** with extra-large corners, icon that morphs large → extra-large on hover, gentle lift + elevation 1 on hover, staggered entry animation
- **Buttons** with state layers (currentColor overlay at 8/12/16% opacity) and shape morph on press
- **Snackbar / Toast** on inverse-surface with extra-small corners (per MD3 spec)
- **Material Symbols Outlined** with variable font axes (FILL/wght/GRAD/opsz)

### Layout
- 8dp grid applied to all margins, padding and gaps
- Mobile-first responsive (390px → 1200px)
- Content capped at 1200px max-width for readability on wide screens
- Entry animations respect `prefers-reduced-motion`

## Run locally

The UI fetches `data/apps.json` over HTTP, so you need a local server (opening `index.html` via `file://` won't load the apps list):

```bash
cd HailFiles-M3-Expressive
python3 -m http.server 8000
# then open http://localhost:8000
```

## Add a new app

1. Drop the icon PNG into `assets/icons/`.
2. Drop the APK into `assets/apks/` (see `assets/apks/README.md`).
3. Append a new entry to `data/apps.json`:

```json
{
  "id": "my-app",
  "name": "My App",
  "version": "1.0.0",
  "description": "Short description.",
  "icon": "assets/icons/my-app.png",
  "file": "assets/apks/my-app.apk",
  "size": "5.4 MB",
  "category": "apps",
  "updated": "2025-06-25",
  "author": "Author",
  "downloads": 0
}
```

The web UI will pick it up automatically on the next page load.

## Categories

The chips filter supports `apps`, `music`, `gallery`, and `all` by default. Add new categories by extending the chip markup in `index.html` and using the matching `category` value in `apps.json`.

## License

Same as the upstream HailFiles project.
