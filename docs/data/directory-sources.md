# Directory data sources

Provenance for `src/data/directory/{departments,executive,legislative,barangays}.json`.
Re-verify quarterly (see the [BetterLGU guide](https://lgu.bettergov.ph/GUIDE)).

**Last verified:** 2026-10-05

## Sources

| Data | Source |
|------|--------|
| Departments: names, heads, addresses, phones, Facebook pages | Data embedded in the taguig.gov.ph "Our Departments" page ([page](https://www.taguig.gov.ph/our-departments/), bundle `/_next/static/chunks/3ptskpexbwnq1.js`). The bundle filename changes on every site deploy, so get it from the page's `<script>` tags. |
| Mayor, Vice Mayor, Congressional Representatives | [taguig.gov.ph/our-leaders](https://www.taguig.gov.ph/our-leaders/) |
| City Administrator | Official departments data; [Taguig news, May 2025](https://www.taguig.com/news/dr-cecilia-montales-appointed-as-new-city/) |
| Representatives' pages | [Cong. Ading Cruz Jr.](https://www.facebook.com/adingcruzjr/), [Jorge Bocobo](https://www.facebook.com/OfficialJorgeBocobo/) |
| 8th Sangguniang Panlungsod members, SP Secretary, SP email | [sp.taguig.gov.ph/councilors](https://sp.taguig.gov.ph/councilors/) |
| Barangays (38): addresses, phones, emails, Facebook pages | Data embedded in the taguig.gov.ph "Our City" page ([page](https://www.taguig.gov.ph/our-city/), bundle `/_next/static/chunks/2z3dkg6kqw77f.js`) |
| Barangay officials (Punong Barangay, kagawad, SK) | Comelec-Taguig list of October 2023 election winners, published by [Manila Bulletin, Nov. 8, 2023](https://mb.com.ph/2023/11/7/comelec-releases-list-of-winners-in-barangay-sk-elections-in-taguig). Names were reordered from "SURNAME, GIVEN MIDDLE" to "GIVEN MIDDLE SURNAME". Terms run to November 2028 under RA 12326. |
| Majority Floor Leader | [Wikipedia: Taguig City Council](https://en.wikipedia.org/wiki/Taguig_City_Council) |

**Conflict rule:** when sources disagree, the official taguig.gov.ph / sp.taguig.gov.ph value wins. An empty official value never blanks an existing one.

## 2026-10-05 sync: changed values (old → new)

Department heads:

- Local School Board: Dr. Natividad Jimenez → Aljenneth Vivar
- City Administrator's Office: Atty. Jose Luis G. Montales → Cecilia R. Montales, M.D.
- City Budget Office: Agnes T. Abratique → Atty. Maricar Loinaz-Sarmiento
- CDRRMO: Erwin Niño Palima → Dr. Luis Sy Jr.
- City Health Office: Dr. Norena R. Osano → Dr. Susana Amiscua
- City Treasurer's Office: Atty. Jonathan Voltaire L. Enriquez → Atty. Alvin Esmenda
- Taguig City University: Dr. Desiree B. Guiraldo → Dr. Raymundo Arcega
- Taguig-Pateros District Hospital: Dr. Anna Richie A. Quilatan → Dr. Timoteo Niel T. Trinidad
- Urban Poor Affairs Office: Agapito M. Cruz → Atty. Christian G. Eco
- Middle initials or prefixes added: Nutrition, Medical Assistance, CHRMO, Library, Legal, CSWDO, LYDO

Phones:

- BPLO: (02) 8628 2813 → (02) 8555 7868
- City Budget Office: (02) 7795 9935 → (02) 7795 8863 (second line unchanged)
- Office of the City Assessor: dropped +63 919 079 9114
- CPDO: (02) 7795 9947 → (02) 7795 9999 loc. 111 / 124
- City Treasurer's Office: (02) 8640 7006 / (02) 8628 4103 → (02) 7795 8844
- Market Management Office: (02) 7795 9933 → (02) 8254 1638
- Newly filled: Engineering, Facilities Management, Legal, Urban Poor Affairs

Websites:

- BPLO → facebook.com/taguig.bplo
- Local Utility Office → the "Local Na Utilidad" page
- ITO (newly filled) → facebook.com/taguigito

Offices added:

- Bids and Awards Committee
- Mobility Office
- Procurement Office
- City Local Economic Development and Investment Promotion Office (CLEDIPO)
- Taguig Open Weather and Environmental Reporting System (TOWER)

Legislative:

- Liga president: Marie Marcelino → Marilyn F. Marcelino
- SK president: Joanna Mae Pagkalinawan → Joanna Mae M. Pagkalinawan
- Majority Floor Leader role added to Fanella Joy B. Panga-Cruz
- SP email added

## Verification log (2026-10-05)

### Department heads

The old values came from an outdated copy of the city site ([Google Sites](https://sites.google.com/view/taguigcity/our-departments), which still lists Jose Luis Montales, who left in May 2025). The live taguig.gov.ph data is newer.

| Office | Now listed | Evidence |
|---|---|---|
| City Administrator | Cecilia R. Montales, M.D. | Confirmed: [appointed May 2025](https://www.taguig.com/news/dr-cecilia-montales-appointed-as-new-city/) |
| CDRRMO | Dr. Luis M. Sy Jr. | Confirmed: [PAGASA, June 4, 2026](https://pagasa.dost.gov.ph/news-and-events/photo-gallery/92) |
| Taguig City University | Dr. Raymundo Arcega | Confirmed: [tcu.edu.ph 2026 news](https://tcu.edu.ph/posts/news/dr-arcega-leads-alcu-ncr-trisemester-regional-meeting-2026). Guiraldo was acting president as of Dec 2024. |
| Taguig-Pateros District Hospital | Dr. Timoteo Niel T. Trinidad | Supported: named Chief of Hospital around Oct 2025 ([taguig.com](https://www.taguig.com/news/taguig-pateros-district-hospitals-center-for/)) |
| Urban Poor Affairs | Atty. Christian G. Eco | Supported: Agapito M. Cruz was head as of Sept 2024 |
| City Health | Dr. Susana Amiscua | Supported: search results show her as City Health Officer as of Jan 2026 |
| City Budget | Atty. Maricar Loinaz-Sarmiento | Plausible: a known city official (former legal counsel and deputy chief of staff), but no source names her budget officer |
| City Treasurer | Atty. Alvin Esmenda | Confirmed by the maintainer. He succeeded Atty. Jonathan Voltaire L. Enriquez, named in 2024 cases |
| Local School Board | Aljenneth Vivar | Confirmed by the maintainer |
| City Epidemiology & Disease Surveillance Unit | *(cleared)* | Dr. Luis M. Sy Jr. moved to CDRRMO, the unit isn't on the current official site, and its current head is unknown |

### Barangays

- **Officials:** the 2023 election winners, plus the updates below. Later resignations or deaths may not be reflected.
- **Captain changes after the 2025 elections** (checked by the maintainer, 2026-10-05):
  - Fort Bonifacio: Lysandre T. "Sonny" Vertulfo, the former kagawad, succeeded Jorge Daniel S. Bocobo (now a representative). Assumes "Sonny" is Lysandre Tuang Vertulfo, the only Vertulfo on the 2023 list.
  - North Signal: Ricardo T. Jordan Jr., the former kagawad, succeeded Danilo G. Castro (now a councilor).
  - Pembo: Michael R. Arcilla, the former kagawad, succeeded Kim M. Abbang (now a councilor).
  - Rizal: Allan Jay J. Cruz, the former kagawad, succeeded Arnold J. "Sammy" Cruz (now a councilor; his council profile is `facebook.com/sammy.cruz.9026`).
- **Western Bicutan:** the SK chairperson and 5 SK members were never proclaimed (Comelec Minute Resolution No. 23-0730). Only the 2 proclaimed SK members are listed.
- **Corrections to the source data:**
  - North Daang Hari captain: "Lhorelyn Landagan Fortuno" (2023 election list) → "Lhorelyn Fortuno Agtarap" (current name, per [barangaydirectory.com](https://www.barangaydirectory.com/barangay/city-of-taguig/north-daang-hari)).
  - Rizal kagawad: "MELCHCR" → "MELCHOR" (confirmed by the maintainer).
  - Central Signal phone: `(02) 8883 70495` → `(02) 8883 7049` (confirmed by the maintainer).
  - North Daang Hari email: the placeholder `secretary@gmail.com` was dropped; no real address was found.
- **Checked and correct as published:**
  - Post Proper Northside's address is in "Barangay Cembo": the hall is in the Macda Compound in Cembo ([Wikipedia](https://en.wikipedia.org/wiki/Post_Proper_Northside)).
  - "BRAIAN BERIA BARNEDO" (North Daang Hari) is a genuine spelling; he was also kagawad in 2013–2016.
- **Cross-checks against city officials:**
  - Liga president Marilyn F. Marcelino is Ususan's captain, and SK Federation president Joanna Mae M. Pagkalinawan is Sta. Ana's SK chairperson. Both hold their council seats ex officio, as expected.
  - Not the same people as similarly named city officials: Lower Bicutan kagawad Ricardo R. Cruz IV (not Rep. Ricardo S. Cruz Jr.) and Rizal kagawad Allan Jay J. Cruz (not councilor Allan Paul C. Cruz).

## Known gaps

- **Emails:** none published for departments or department heads, except the SP Secretariat.
- **Head contact numbers:** none published.
- **Office of the Mayor appointees** (Chief of Staff, etc.): no citable public source found.
- **Representatives:** House contact details aren't reachable (congress.gov.ph blocks automated access).
- **SP standing committees:** the 8th Council's committee assignments aren't published online (checked sp.taguig.gov.ph, taguig.gov.ph, news, Wikipedia). Only *Environmental Protection and Ecology* (chair: Eduardo B. Prado) is listed, and it was carried over from earlier data. Get the full list from the SP Secretariat (spsecretariat@taguig.gov.ph) or through an FOI request.
- **personId links** point to OpenLGU person pages that aren't seeded with Taguig officials yet.
