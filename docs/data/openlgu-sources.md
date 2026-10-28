# OpenLGU (legislation) data

**Last verified:** 2026-10-28

## Where the data lives

| File | Contents |
|------|----------|
| `pipeline/data/terms.csv` | Council terms (currently the 8th Sangguniang Panlungsod, 2025–2028) |
| `pipeline/data/term_members.csv` | Mayor, Vice Mayor, 24 councilors and 2 ex officio members, with name parts and `chamber` |
| `pipeline/data/documents.csv` | Ordinances; `subjects` is `|`-separated |
| `db/migrations/004_taguig_seed.sql` | **Generated** from the CSVs by `python3 scripts/openlgu/build-taguig-seed.py`. Never edit it by hand. |

To update: edit the CSVs, rerun the script, and apply the migration. Once a migration has been applied to production, add a new numbered migration instead of regenerating `004`.

## Sources

- **Ordinances:** the 46 codified ordinances published on [sp.taguig.gov.ph/or](https://sp.taguig.gov.ph/or/) (47 listings; Ord. 54-1999 appears under two categories). Titles, PDF links and categories come from the site's data. Numbers and years come from each PDF's filename.
- **Members:** `src/data/directory/legislative.json` and `executive.json` (see `directory-sources.md`).

## Known gaps

- **Enactment dates:** the site only gives the year, so `date_enacted` is empty and documents aren't tied to a term. Ordering uses the `YEAR-NUMBER` document number.
- **Authors, resolutions, executive orders and sessions:** none are published online by the city.
- **PDF links** (click-tested by the maintainer, 2026-10-28):
  - The links on the site work when the file name matches the listing (e.g. Ord. 14-2005).
  - Ord. 62-2006: the site's path is malformed (`/or/2006/codified/…`); fixed to `/pdf/codified/zon/Ord.62-2006.pdf`, which opens.
  - Ord. 42-2023: listed as "Ord.42-2003" on the site; the linked 2023 file opens and is used.
  - Ord. 28-2025: no working PDF (neither the linked file nor the listed long filename), so it has no link.

## Database setup

`wrangler.jsonc` still points at the BetterLB database (`betterlb-openlgu`). BetterTaguig needs its own Cloudflare D1 database. Then:

1. `npx wrangler d1 create bettertaguig-openlgu`
2. Put the new `database_name` and `database_id` in `wrangler.jsonc`, and update `DB_NAME` in `scripts/migrate.sh`.
3. `npm run db:migrate:remote`

Local development: `npm run db:migrate` creates and seeds a local database in `.wrangler/`.
