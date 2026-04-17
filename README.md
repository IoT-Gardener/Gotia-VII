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
npm run dev       # http://localhost:4321/Gotia-VII/ — fast iteration, no search
```

To run locally **with the terminal `search:` command working**, generate the Pagefind index first, then start the dev server:

```sh
npm run search:index && npm run dev
```

Re-run `npm run search:index` after content changes to refresh the index.

### Other commands

```sh
npm run build       # static build → ./dist/ (includes pagefind index)
npm run preview     # serve the built site locally
npm run search:index  # build + copy pagefind index into public/ for dev
```

Deployment happens automatically on push to `main` via `.github/workflows/deploy.yml`.

---

## Project Structure

```
Gotia-VII/
├── astro.config.mjs          # Astro + integrations + base path
├── src/
│   ├── styles/global.css     # Theme (amber phosphor), CRT, notices, glitch transitions
│   ├── layouts/Layout.astro  # Header, nav, ClientRouter, access-gate + idle-glitch scripts
│   ├── components/
│   │   ├── CallsignGate.tsx       # Unified terminal: callsign gate, typewriter boot log, post-boot command prompt (query: roster → /roster/)
│   │   ├── ActiveOperators.tsx    # Flickering live operator counter
│   │   ├── FlickerNumber.tsx      # Reusable flickering/drifting counter
│   │   ├── TremorSparkline.tsx    # Live seismic sparkline + event log
│   │   ├── CorpThreatRadar.tsx    # Sweeping corp-threat radar
│   │   ├── StatusTicker.tsx       # Scrolling omni-net wire marquee
│   │   └── Redacted.astro         # Click-to-reveal redacted span
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

Inline redaction (anywhere, including MDX):

```mdx
import Redacted from '../../components/Redacted.astro';

The vault code is <Redacted label="CLASSIFIED">4-7-9-2-epsilon</Redacted>.
```

### Features

- **Callsign gate** — enter any callsign; stored in `localStorage`, shown site-wide.
- **Boot terminal** — 24-line typewriter sequence on first verification, skippable, scrollable.
- **Access gating** — non-terminal routes show a flickering `ACCESS DENIED` overlay until authenticated; landing widgets stay blurred under `[ REDACTED ]` / progress bar until boot completes.
- **Live widgets** — flickering counters (credits, distress queue, lane latency, smog), tremor sparkline with event log, corp-threat radar, omni-net ticker.
- **Glitch transitions** — CRT signal-loss transitions on every navigation plus a toned-down idle glitch that fires randomly while pages sit open.
- **Redacted spans** — reusable `<Redacted>` component for lore spoilers; hover to peek, click to unlock.
- **Terminal search** — `search --<query>` (also `find --<q>` / `grep --<q>`) runs a Pagefind full-text search across missions / dossier / data bank and streams clickable results into the command log. Index built as part of `npm run build` (served from `dist/`); for dev, run `npm run search:index` once to populate `public/pagefind/` so `astro dev` can serve it.

### Stack

- **[Astro](https://astro.build)** — static-first framework, View Transitions via `ClientRouter`
- **[Tailwind CSS v4](https://tailwindcss.com)** — CSS-first via `@theme`
- **MDX** — content with embedded components
- **React islands** — callsign gate, boot terminal, all animated landing widgets

### Legacy

The original Streamlit prototype lives in `legacy/` (`Registry_Base.py`, `pages/`, `Images/`, `requirements.txt`). It is no longer maintained and is retained for reference only.

---

## References

- `wake up, samurai`
- `follow the white rabbit`
- `there is no spoon`
- `open the pod bay doors`
- `tears in rain`
- `hello friend`
- `the sky above the port`
- `shall we play a game`
- `i see dead people`
- `tell me about the war in ba sing se`
- `here's johnny`
- `i found a rat`
