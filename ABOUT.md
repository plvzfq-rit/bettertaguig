## About BetterTaguig

BetterTaguig is a community-built, open-source portal for the **City of Taguig**. It is not an official government website. It gathers public information from official sources into one place that is easy to search and use on any device.

<!-- TODO(James): add the story of why you started BetterTaguig here. -->

## What it does

- **Government directory:** city departments and their heads, the Mayor and Vice Mayor, the 8th Sangguniang Panlungsod, and all 38 barangays with their officials
- **Services:** services from Taguig's official Citizen's Charter, with requirements, steps, fees and links to the source documents
- **OpenLGU:** the city's published codified ordinances and council member profiles
- **Statistics and transparency:** census population, DTI competitiveness scores, and BLGF income and expenditure data
- English and Filipino interface, with a mobile-friendly design

## How it's built

BetterTaguig is a fork of [BetterLB](https://github.com/BetterLosBanos/betterlb), the Los Baños portal, which builds on [BetterGov.ph](https://bettergov.ph). It uses React 19, TypeScript, Tailwind CSS, Vite, and Cloudflare Pages with a D1 database. See [README.md](./README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).

## Data

Every dataset cites its sources and known gaps in [`docs/data/`](./docs/data/). The data is reviewed quarterly, following the [BetterLGU guide](https://lgu.bettergov.ph/GUIDE).
