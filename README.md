# Gotia-VII — The Rust & Ruin Registry

Perched at the very edges of union space, Gotia VII isn't a planet; it's a furnace. Its ochre skies are perpetually choked with smog, a bilious yellow that bleeds into the twin suns' harsh glare.

This is the omni-net repository for The Rust & Ruin Registry: an encrypted platform facilitating high-risk, high-reward operations for vetted Lancers. Discretion is paramount. The network prioritises deniability and anonymity.

Deployed at **[iot-gardener.github.io/Gotia-VII/](https://iot-gardener.github.io/Gotia-VII/)** via GitHub Pages.

---

## Running Locally

Requires **Node.js 22+**. If you use `nvm`:

```sh
nvm use 22   # or: nvm install 22
```

Then:

```sh
npm install
npm run dev       # http://localhost:4321/Gotia-VII/
```

### Other commands

```sh
npm run build     # static build → ./dist/
npm run preview   # serve the built site locally
```

Deployment happens automatically on push to `main` via `.github/workflows/deploy.yml`.

---

## Project Structure

```
Gotia-VII/
├── astro.config.mjs          # Astro + integrations + base path
├── src/
│   ├── styles/global.css     # Theme (amber phosphor), CRT scanlines, notices
│   ├── layouts/Layout.astro  # Header, nav with active-page marker, footer
│   ├── components/
│   │   └── CallsignGate.tsx  # React island: operator callsign entry
│   ├── content.config.ts     # Collection schemas (zod)
│   ├── content/              # MDX source of truth — one file per entry
│   │   ├── missions/         # Registry contracts
│   │   ├── factions/         # Corps, inhabitants, the Registry itself
│   │   ├── regions/          # Geography
│   │   ├── cities/           # Settlements (FK to region)
│   │   ├── history/          # Era summaries, chronological via `order`
│   │   └── dossier/          # Persons of interest (priority one/two/asset/archived)
│   └── pages/                # Astro routes
│       ├── index.astro       # Terminal landing — gate + widgets
│       ├── missions/         # [...slug].astro + index
│       ├── data-bank/        # Hub + factions/, regions/, cities/, history/
│       └── dossier/          # Hub + [...slug]
├── public/                   # Static assets
├── legacy/                   # Retired Streamlit app (reference only)
└── .github/workflows/        # GitHub Pages deploy
```

### Editing Content

All world content lives in `src/content/**/*.mdx` as source of truth, sliced from `../Gotia-VII.md`. Each file has frontmatter (validated by `content.config.ts`) and a markdown body. To add an entry, drop a new MDX file in the right collection folder — Astro picks it up on next build.

Notice callouts (info / warning / error / success) use plain HTML:

```html
<div class="notice notice-warning">Advisory text here.</div>
```

### Stack

- **[Astro](https://astro.build)** — static-first framework
- **[Tailwind CSS v4](https://tailwindcss.com)** — CSS-first via `@theme`
- **MDX** — content with embedded components
- **React island** — callsign gate only; everything else is static

### Legacy

The original Streamlit prototype lives in `legacy/` (`Registry_Base.py`, `pages/`, `Images/`, `requirements.txt`). It is no longer maintained and is retained for reference only.
