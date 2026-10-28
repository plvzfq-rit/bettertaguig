# 🏛️ BetterTaguig

A community-led, open-source portal that makes the government of the **City of Taguig** accessible, transparent, and easy to use.

BetterTaguig is a fork of [BetterLB](https://github.com/BetterLosBanos/betterlb) (Los Baños), itself built on [BetterGov.ph](https://bettergov.ph), and is part of the [BetterLGU](https://lgu.bettergov.ph) network.

> **Not an official government website.** Data comes from public sources and may be out of date. Always verify with the City Government of Taguig.

---

## What's in the portal

- **Government directory:** 61 city departments and offices, the Mayor and Vice Mayor, the 8th Sangguniang Panlungsod, and all 38 barangays with their officials
- **Services:** 65 services from Taguig's official Citizen's Charter, with requirements, steps, fees, processing times and links to the source PDFs
- **OpenLGU (legislation):** the city's published codified ordinances and council member profiles
- **Statistics:** PSA census population (city and barangays) and DTI competitiveness scores
- **Transparency:** BLGF income and expenditure figures, plus procurement and infrastructure search
- **English and Filipino** interface

## Data sources

Every dataset is sourced and logged, with known gaps, in [`docs/data/`](./docs/data/):

| Area | Log |
|------|-----|
| Directory (departments, officials, council, barangays) | [`directory-sources.md`](./docs/data/directory-sources.md) |
| Services / Citizen's Charter | [`services-sources.md`](./docs/data/services-sources.md) |
| Ordinances and council database | [`openlgu-sources.md`](./docs/data/openlgu-sources.md) |
| About, statistics and budget | [`statistics-and-budget-sources.md`](./docs/data/statistics-and-budget-sources.md) |

Main sources: taguig.gov.ph, sp.taguig.gov.ph, the city's Citizen's Charter kiosk, PSA, DTI CMCI, BLGF, and Comelec (via news reports).

---

## Technical stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, `@bettergov/kapwa` design system
- **Backend:** Cloudflare Pages Functions (TypeScript)
- **Database:** Cloudflare D1 (`bettertaguig-openlgu`) for legislative data
- **Search:** Meilisearch with Fuse.js fuzzy search
- **i18n:** i18next (English, Filipino)
- **Maps:** Leaflet
- **Testing:** Vitest (unit), Playwright (end-to-end)
- **Code quality:** ESLint, Prettier, commitlint (Conventional Commits)

## Running locally

```bash
git clone https://github.com/plvzfq-rit/bettertaguig
cd bettertaguig
npm install
npm run db:migrate    # create and seed a local legislative database
npm run dev           # http://localhost:5173
```

To use the legislative API locally, also run `npm run functions:dev` in a second terminal.

Other commands:

```bash
npm test              # unit tests
npm run test:e2e      # end-to-end tests
npm run lint          # lint (max warnings = 0)
npm run build         # merge services, type-check, and build
```

## Updating data

| Data | How |
|------|-----|
| Citizen's Charter | `python3 scripts/charter/import_taguig_charter.py && npm run merge:services` |
| Ordinances and council | Edit `pipeline/data/*.csv`, run `python3 scripts/openlgu/build-taguig-seed.py`, then apply a migration |
| Directory, statistics, budget | Edit the JSON in `src/data/` and update the matching log in `docs/data/` |

Review the data quarterly, as the [BetterLGU guide](https://lgu.bettergov.ph/GUIDE) recommends.

## Deployment

Deployed on **Cloudflare Pages** (project `bettertaguig`) from the `main` branch via `.github/workflows/deploy.yml`:

- **Database:** `npm run db:migrate:remote` applies migrations to the production D1 database
- **Configuration:** `config/lgu.config.json` holds the LGU name, branding, coordinates and transparency settings
- **Allowed API origins:** derived from `portal.baseUrl` in the config (see `functions/utils/allowed-origins.ts`)

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) and [`FORKING.md`](./FORKING.md) for more detail.

---

## Contributing

Contributions are welcome, from fixing an outdated phone number to adding a dataset:

1. **Non-developers:** use the **Contribute** page on the site, or open a GitHub issue.
2. **Developers:** check the [issues](https://github.com/plvzfq-rit/bettertaguig/issues) and follow [Conventional Commits](https://www.conventionalcommits.org/).
3. **Data:** when you change data, cite the source in the matching `docs/data/` log.

## License

Code is released under [CC0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain). Government data belongs to its respective sources; see `docs/data/` for attribution.

## Credits

- [BetterLB](https://github.com/BetterLosBanos/betterlb), the template this portal is forked from
- [BetterGov.ph](https://github.com/bettergovph/bettergov), [BetterSolano](https://github.com/BetterSolano/bettersolano) and [betterlocalgov](https://github.com/iyanski/betterlocalgov) for inspiration
- Made with Claude
