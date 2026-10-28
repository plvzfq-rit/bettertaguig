# Services (Citizen's Charter) data

**Last verified:** 2026-10-28

## Source

Taguig's official Citizen's Charter as listed on [taguig.gov.ph](https://www.taguig.gov.ph) ("Citizen's Charter: requirements and procedures to avail of city services"). The documents are served by the city's kiosk API, `https://kiosk-info.taguig.gov.ph/api/documents?category=Services&sub_category=<office>`, as ARTA-format PDFs (uploaded 2026).

Offices covered: Business Permits and Licensing Office, Office of the City Assessor, CENRO, City Health Office (including the Taguig Anti-Drug Abuse Office's services), City Treasurer's Office and Local Building Office. **65 services** in total.

## Updating

```bash
python3 scripts/charter/import_taguig_charter.py   # fetch PDFs, parse, write citizens-charter.json
npm run merge:services                              # rebuild merged-services.json and services.json
```

PDFs are cached in `.local/charter-pdfs/` (git-ignored). The import script:

- skips blank application forms
- drops exact duplicates (the kiosk lists some documents twice)
- names multi-service bundles (Assessor, Building Office) from their section headings
- links every service to its source PDF ("View Official Charter (PDF)")

## Known gaps and caveats

- Parsed automatically from PDF tables; spot-check any service against its PDF before relying on it.
- Some services have no steps in their PDF (e.g. Addressing Environmental Complaints) or steps the parser can't read (e.g. Pre-Marriage Counselling, whose steps aren't numbered). The charter PDF link covers these.
- A few BPLO documents don't state an ARTA classification, so it's left empty.
- Names keep the document's wording, including typos such as "Animal Bite Treament".
- Other offices (Civil Registry, CSWDO, etc.) aren't in the city's published charter yet.
- The Los Baños community-contributed services were removed. `src/data/services/categories/*.json` is empty, ready for Taguig community contributions.

## Future ideas

- **Places / tourism page** (tourism is switched off in `config/lgu.config.json`): a guide to Taguig's malls (BGC, Market! Market!, SM Aura, Uptown, Venice Grand Canal) listing the restaurants and stores inside with price ranges.
