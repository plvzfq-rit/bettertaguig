# BetterTaguig data

Most of what BetterTaguig shows comes from the JSON files in this folder. To fix or add information, edit a file here and open a pull request. No database or login is needed.

## Rules for editing

1. **Every fact needs an official source.** Add the link under `sources` (a list of `{ "name", "url" }`). Accepted sources:
   - `taguig.gov.ph` and its subdomains, such as the Citizen's Charter kiosk (`kiosk-info.taguig.gov.ph`);
   - other government sites (`*.gov.ph`), such as COA, DBM, PSA and DILG;
   - a Taguig city office's **own** Facebook page. Link the post itself, and name the office in `name`.

   Wikipedia, directories, aggregators (for example PhilAtlas), blogs and resident tips are not sources. `npm run check:sources` and CI reject a source link to any other site. To allow a new site, change `scripts/check-sources.mjs` in a reviewed pull request.
2. **Never guess.** If a fee, requirement, phone number or date isn't in the source, leave it out.
3. **Flag what isn't confirmed.** Set `"needsVerification": true` when a detail comes from an older or unclear source, or conflicts with another source. The site shows a "needs verification" notice on that service. Remove the flag only after you've checked it against an official source.
4. **Keep `slug` values stable.** Slugs are part of page URLs. Change the title, not the slug.
5. **Date your edits.** Set `updatedAt` (YYYY-MM-DD) on a service when you change it.
6. **Someone else reviews facts.** A pull request that changes a name, figure, fee or requirement is reviewed by a maintainer who didn't write it.

## Files

| File or folder | What it holds | Shows up on |
|---|---|---|
| `services/categories/*.json` | City services, one file per category. **Edit these.** | `/services` |
| `services/services.json` | Generated from the category files. Don't edit by hand. | Homepage search; feeds `merged-services.json` |
| `citizens-charter/` | Services imported from the official Citizen's Charter kiosk, plus the review queue. `merged-services.json` (generated) is what `/services` reads. | `/services` |
| `service_categories.json` | Category names and descriptions | `/services` |
| `directory/executive.json`, `legislative.json` | Mayor, vice mayor, councilors | `/government/elected-officials` |
| `directory/departments.json` | City offices: heads, addresses, contact numbers | `/government/departments` |
| `directory/barangays.json` | Barangays and their officials | `/government/barangays` |
| `about/history.json`, `about/highlights.json` | City history and quick facts | Homepage history timeline |
| `statistics/*.json` | Population, competitiveness (CMCI), income (ARI) | `/statistics` |
| `transparency/` | Budget and income figures | `/transparency` |
| `philippines_hotlines.json` | Emergency and national hotlines | Homepage hotlines widget |
| `websites.json` | National government agencies directory (from the template; not shown on any page yet) | — |
| `schema/`, `directory/schema/` | Shape checks. CI runs them on the directory files, service categories and SEO metadata. | — |

## After editing services

Run from the project root:

```bash
python scripts/merge_services.py && python scripts/merge_citizens_charter.py
npx prettier --write src/data/services src/data/citizens-charter
npm run check:sources
```

Then check the service page in the dev server (`npx vite --port 5173`).
