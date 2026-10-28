# Statistics and budget data sources

Provenance for `src/data/statistics/*.json`, `src/data/transparency/sre.json` and `src/data/about/*.json`.
Re-verify quarterly.

**Last verified:** 2026-10-28

| File | Source | Notes |
|------|--------|-------|
| `about/history.json`, `about/highlights.json` | [taguig.gov.ph/our-history](https://www.taguig.gov.ph/our-history/), [Wikipedia: Taguig](https://en.wikipedia.org/wiki/Taguig) | |
| `statistics/population.json` (city) | PSA census counts 1960–2020 via [PhilAtlas](https://www.philatlas.com/luzon/ncr/taguig.html); 2024 POPCEN total (1,308,085) | Growth rates use PSA's compound-rate formula over exact census dates. They reproduce PhilAtlas's published 2010–2015 and 2015–2020 rates. |
| `statistics/population.json` (barangays) | 2015/2020 from PhilAtlas (PSA); 2024 per-barangay POPCEN counts as tabulated in [Wikipedia: Taguig](https://en.wikipedia.org/wiki/Taguig), citing PSA. The 38 values sum to the official 1,308,085. | The 10 EMBO barangays only have 2024 Taguig figures (earlier counts fell under Makati). The 2020–2024 rate covers only the 28 barangays counted in both censuses. PSA's own [PSGC page](https://psa.gov.ph/classification/psgc/barangays/1381500000) blocks automated access. |
| `statistics/cmci.json` | [DTI CMCI, Taguig profile](https://cmci.dti.gov.ph/lgu-profile.php?lgu=Taguig), years 2015–2024 | DTI has no 2014 data for Taguig. The overall score is the sum of the pillar scores (3 pillars in 2015–2016, 4 in 2017–2021, 5 from 2022). Indicators are the 2024 set, matched by name to earlier years and `null` where an indicator didn't exist yet. |
| `statistics/ari.json` | BLGF, *FY 2024 Annual Regular Income and Dependencies by LGU* (preliminary, extracted Mar 17, 2025) | Converted from pesos to ₱ millions. |
| `transparency/sre.json` | BLGF, *FY 2024 Statement of Receipts and Expenditures by LGU* (→ `Q4-2024`) and *FY 2025 Quarterly SRE* (→ `Q1-2025`, `Q2-2025`) | BLGF quarterly figures are cumulative year to date, so the full-year FY2024 report is the Q4-2024 figure. ₱ millions. All periods pass BLGF's own total checks. |

BLGF files are listed on the [BetterGov open data portal (dataset 9)](https://data.bettergov.ph/datasets/9) and hosted at blgf.gov.ph. BLGF blocks scripted downloads, so the files were downloaded in a browser.

## Updating budget data

Download the BLGF `.xlsx` in a browser (BLGF blocks scripts), then:

```bash
python3 scripts/blgf/import_blgf.py sre <file.xlsx>                          # lists the sheets
python3 scripts/blgf/import_blgf.py sre <file.xlsx> --sheet Q32025 --period Q3-2025
python3 scripts/blgf/import_blgf.py ari <file.xlsx> --sheet "ARI 2025" --period FY-2025
```

The script checks the column layout and BLGF's own totals, and replaces or adds the period. A full-year SRE report goes in as `Q4-<year>`.

## Known gaps and caveats

- **SRE coverage:** only Q4-2024 (full year), Q1-2025 and Q2-2025. Earlier 2024 quarters and Q3-2025 onward need BLGF's other quarterly files.
- **Q1-2025 expenditures** (₱717M against ₱10.8B income) are as published. BLGF marks the figures preliminary.
