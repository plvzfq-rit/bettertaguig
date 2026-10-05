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

## Known gaps

- **Barangay officials:** these are the 2023 election winners. They may not reflect later resignations, deaths, or successions.
  - Vacant captain posts (`vacancies`):
    - Fort Bonifacio: Jorge Daniel S. Bocobo became Representative for the 2nd District.
    - Pembo: Kim M. Abbang became a councilor (1st District).
    - North Signal: Danilo G. Castro became a councilor (2nd District).
    - Rizal: Arnold J. Cruz became a councilor (1st District). *Probable* match to Arnold Jaramiel Cruz; verify.
  - Under the Local Government Code, the highest-ranking kagawad succeeds as captain. Who that is hasn't been sourced yet.
  - Western Bicutan: the SK chairperson and 5 SK members were never proclaimed (Comelec Minute Resolution No. 23-0730). Only the 2 proclaimed SK members are listed.
- **Barangay data quirks** in the official source:
  - North Daang Hari's email is the placeholder `secretary@gmail.com`, so I dropped it.
  - Central Signal's second number, `(02) 8883 70495`, has an extra digit (kept as published).
  - Post Proper Northside's address says "Barangay Cembo" (kept as published).

- **Emails:** none published for departments or department heads, except the SP Secretariat.
- **Head contact numbers:** none published.
- **Office of the Mayor appointees** (Chief of Staff, etc.): no citable public source found.
- **Representatives:** House contact details aren't reachable (congress.gov.ph blocks automated access).
- **SP standing committees:** the 8th Council's committee assignments aren't published online (checked sp.taguig.gov.ph, taguig.gov.ph, news, Wikipedia). Only *Environmental Protection and Ecology* (chair: Eduardo B. Prado) is listed, and it was carried over from earlier data. Get the full list from the SP Secretariat (spsecretariat@taguig.gov.ph) or through an FOI request.
- **personId links** point to OpenLGU person pages that aren't seeded with Taguig officials yet.
