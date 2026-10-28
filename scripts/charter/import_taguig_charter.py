#!/usr/bin/env python3
"""Import Taguig's Citizen's Charter from the city's kiosk server.

Fetches the charter PDFs that taguig.gov.ph lists under "Citizen's Charter"
(kiosk-info.taguig.gov.ph, category "Services"), parses their ARTA tables,
and writes src/data/citizens-charter/citizens-charter.json.

Usage:
  python3 scripts/charter/import_taguig_charter.py [--cache DIR]

Then run `npm run merge:services` to rebuild merged-services.json.
Requires: pdfplumber
"""

import argparse
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'src' / 'data' / 'citizens-charter' / 'citizens-charter.json'
API = 'https://kiosk-info.taguig.gov.ph/api/documents'
UA = {'User-Agent': 'Mozilla/5.0 (BetterTaguig charter import)'}

# Kiosk sub-category -> (canonical office name used in the charter data)
OFFICES = {
    'Business Permit and Licensing Office': 'BUSINESS PERMITS AND LICENSING OFFICE',
    'City Assessors Office': 'OFFICE OF THE CITY ASSESSOR',
    'City Environment and Natural Resources Office': 'CITY ENVIRONMENT AND NATURAL RESOURCES OFFICE',
    'City Health Office': 'CITY HEALTH OFFICE',
    'City Treasurers Office': "CITY TREASURER'S OFFICE",
    'Local Building Office': 'LOCAL BUILDING OFFICE',
}

# Kiosk document titles that are blank application forms, not charter entries.
FORM_TITLES = ('Application Form',)

# Titles for documents that bundle several services without a "Service Provided" row,
# taken from each document's own section headings.
SECTION_TITLES = {
    'City Assessors Office ARTA': [
        'Transfer of Ownership of Real Property',
        'New Declaration: Lot',
        'New Assessment/Discovery: Improvements/Machineries',
        'Segregation/Consolidation of Lot (Titled and Untitled Property)',
        'Reclassification/Reassessment (Land)',
        'Reassessment (Building)',
        'Correction/Updating of Entry/Annotation (Adverse Claims and Other Annotations)',
        'Cancellation of Assessment (Demolished Property/Retirement of Machinery Operation)',
        'Vicinity Map',
        'Issuance of Certified True Copies of Tax Declaration/Certification',
    ],
    'ARTA - Local Building Office': [
        'Issuance of Building Permit',
        'Issuance of Occupancy Permit',
        'Issuance of Electrical Permit or Certificate of Final Electrical Inspection',
        'Issuance of Mechanical Permit or Certificate of Operation',
        'Issuance of Annual Building Inspection Certificates',
        'Issuance of Excavation Permit',
        'Issuance of Fencing Permit',
        'Issuance of Sign Permit',
        'Issuance of Demolition Permit',
    ],
}


def clean(s):
    return re.sub(r'\s+', ' ', (s or '').replace('’', "'")).strip()


def cells(row):
    return [clean(c) for c in row if clean(c)]


def key_of(text):
    t = text.upper()
    if t.startswith('OFFICE') and 'DIVISION' in t:
        return 'office'
    if t.startswith('SERVICE PROVIDED') or t == 'SERVICE NAME':
        return 'name'
    if t.startswith('CLASSIFICATION') or t.startswith('SIMPLE, COMPLEX'):
        return 'classification'
    if t.startswith('TYPE OF TRANSACTION') or t.startswith('INTERNAL OR EXTERNAL'):
        return 'type'
    if t.startswith('WHO MAY AVAIL'):
        return 'who'
    if t.startswith('CHECKLIST OF') or 'CHECKLIST OF REQUIREMENTS' in t:
        return 'req_header'
    if t.startswith('CLIENT STEPS'):
        return 'steps_header'
    if t.startswith('TOTAL'):
        return 'total'
    return None


HEADER_SCRAPS = {"SERVICE", "CITIZEN'S CHARTER", 'PAID', 'FEES TO BE', 'FEES TO BE PAID', 'MAXIMUM',
                 'TIME', 'PROCESSING', 'PROCESSING TIME', 'GET SERVICE)', 'SERVICE)', 'WHO MAY AVAIL OF',
                 'PERSON RESPONSIBLE', 'AGENCY ACTIONS', 'AGENCY ACTION'}

TIME_RE = re.compile(r'\b(mins?|minutes?|hours?|hrs?|days?|weeks?)\b', re.I)
FEE_RE = re.compile(r'(php|p\s?\d|₱|\bnone\b|\bfree\b|ordinance|\bfee|n/a|^varies)', re.I)


def classify(val):
    if TIME_RE.search(val) and len(val) < 120:
        return 'time'
    if FEE_RE.search(val) and len(val) < 120:
        return 'fees'
    if re.match(r'^\d+(\.\d+)?[.)]?\s', val) or len(val) > 80:
        return 'agency'
    return 'person'


STEP_RE = re.compile(r'^(\d{1,2})[.)]\s*(.*)')
COLS = [('agency', ('AGENCY', 'ACTION TAKEN', "LGU'S ACTION", 'LGUS ACTION', "LGU'S ACTIONS")),
        ('step_requirements', ('REQUIREMENT',)),
        ('legal_basis', ('LEGAL',)),
        ('fees', ('FEE',)),
        ('time', ('PROCESSING', 'TIME', 'MAXIMUM')),
        ('person', ('PERSON', 'RESPONSIBLE'))]


def col_kind(text):
    t = text.upper()
    if t.startswith('CLIENT STEP'):
        return 'action'
    for kind, words in COLS:
        if any(w in t for w in words):
            return kind
    return None


def parse(path):
    services, svc, mode, colmap = [], None, None, None
    hdr, hdr_open = [], False
    office = None

    def new_service():
        nonlocal svc
        svc = {'office_division': office, 'service_name': None, 'classification': None,
               'type_of_transaction': None, 'who_may_avail': None,
               'requirements': [], 'client_steps': [], 'total_time': None}
        services.append(svc)

    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                for row in table:
                    raw = cells(row)
                    full = [clean(c) for c in row]
                    if raw and key_of(raw[0]) == 'steps_header':
                        mode = 'steps'
                        hdr = full[:]
                        hdr_open = True
                        continue
                    if mode == 'steps' and hdr_open and raw and not STEP_RE.match(raw[0]):
                        if len(full) == len(hdr):
                            hdr = [clean(f'{h} {x}') for h, x in zip(hdr, full)]
                        continue
                    if mode == 'steps' and hdr_open:
                        hdr_open = False
                        colmap = [col_kind(h) if h else None for h in hdr]
                    cs = [c for c in raw if c.upper() not in HEADER_SCRAPS]
                    if not cs:
                        continue
                    if cs[0].upper().startswith("CITIZEN'S CHARTER"):
                        mode = None
                        continue
                    k = key_of(cs[0])
                    if k == 'office':
                        office = cs[-1] if len(cs) > 1 else office
                        if svc and (svc['client_steps'] or svc['requirements']):
                            svc = None
                        if svc:
                            svc['office_division'] = office
                        mode = None
                        continue
                    if k == 'name':
                        if svc is None or svc['service_name']:
                            new_service()
                        svc['service_name'] = cs[-1] if len(cs) > 1 else None
                        mode = None
                        continue
                    if svc is None and k in ('classification', 'type', 'who', 'req_header'):
                        new_service()
                    if k in ('classification', 'type', 'who'):
                        field = {'classification': 'classification', 'type': 'type_of_transaction',
                                 'who': 'who_may_avail'}[k]
                        if len(cs) > 1:
                            svc[field] = cs[-1]
                        mode = k
                        continue
                    if k == 'req_header':
                        mode = 'req'
                        continue
                    if k == 'steps_header':
                        mode = 'steps'
                        colmap = [col_kind(c) for c in cs]
                        continue
                    if k == 'total':
                        if svc is not None:
                            svc['total_time'] = ' '.join(c for c in cs[1:] if not c.upper().startswith('TOTAL')) or None
                        mode = None
                        continue
                    if svc is None:
                        continue
                    if mode == 'classification' and svc['classification'] is None:
                        svc['classification'] = cs[-1]
                    elif mode == 'who' and len(cs) == 1 and not svc['requirements']:
                        svc['who_may_avail'] = clean(f"{svc['who_may_avail'] or ''} {cs[0]}")
                    elif mode == 'req':
                        if cs[0].upper().startswith(("CITIZEN'S CHARTER", 'WHERE TO SECURE')):
                            continue
                        where = cs[1] if len(cs) > 1 else None
                        if where is None and svc['requirements']:
                            where = svc['requirements'][-1]['where_to_secure']
                        svc['requirements'].append({'requirement': cs[0], 'where_to_secure': where})
                    elif mode == 'steps':
                        m = STEP_RE.match(cs[0])
                        if m:
                            step = {'step': int(m.group(1)), 'action': m.group(2)}
                            if colmap and len(full) == len(colmap):
                                for kind, val in zip(colmap[1:], full[1:]):
                                    if not val:
                                        continue
                                    if kind is None:
                                        kind = classify(val)
                                    step[kind] = clean(f"{step.get(kind, '')} {val}")
                            else:
                                kinds = [k for k in (colmap or [col_kind(h) for h in hdr if h]) if k and k != 'action']
                                rest = cs[1:]
                                if len(rest) == len(kinds):
                                    step.update(dict(zip(kinds, rest)))
                                else:
                                    for val in rest:
                                        kind = classify(val)
                                        step[kind] = clean(f"{step.get(kind, '')} {val}")
                            svc['client_steps'].append(step)
                        elif svc['client_steps'] and len(cs) == 1 and not any(w in cs[0].upper() for w in ('FEES', 'PROCESSING', 'PERSON', 'TRANSACTIONS', 'SERVICE)')):
                            svc['client_steps'][-1]['action'] += ' ' + cs[0]
    return [s for s in services if s['service_name'] or s['client_steps']]




def fetch_index():
    docs = []
    for sub in OFFICES:
        url = API + '?' + urllib.parse.urlencode({'category': 'Services', 'sub_category': sub})
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA)) as r:
            docs.extend(json.load(r)['data'])
    return docs


def download(doc, cache):
    path = cache / f"{doc['id']}.pdf"
    if not path.exists():
        with urllib.request.urlopen(urllib.request.Request(doc['file_url'], headers=UA)) as r:
            path.write_bytes(r.read())
    return path


ACRONYMS = {'HIV', 'STI', 'TB', 'DOH', 'FP', 'RP', 'NSD', 'ECO', 'ITR', 'OR', 'BIR', 'CTC', 'ARTA', 'PMC',
            'TADAC', 'RPT', 'HEPA', 'HEPAB'}
SMALL = {'of', 'and', 'or', 'the', 'to', 'for', 'in', 'a', 'an', 'on', 'by', 'with'}


def title_case(name):
    """Title-case ALL-CAPS or mixed names, keeping acronyms and small words."""
    if not name:
        return name
    name = re.sub(r'([a-z])([A-Z][a-z])', r'\1 \2', name)  # "LaboratoryExaminations"
    if not (name.isupper() or re.search(r'\b[A-Z]{4,}\b', name)):
        return name

    def fix(word, first):
        core = re.sub(r'[^A-Za-z]', '', word).upper()
        if core in ACRONYMS:
            return word.upper()
        if not first and word.lower() in SMALL:
            return word.lower()
        return re.sub(r'[A-Za-z]+', lambda m: m.group(0).capitalize(), word.lower(), count=1)

    parts = re.split(r'(\s+|/|-)', name)
    out, first = [], True
    for part in parts:
        if part.strip() and part not in ('/', '-'):
            out.append(fix(part, first))
            first = False
        else:
            out.append(part)
    return ''.join(out)


LEVELS = ('Highly Technical', 'Complex', 'Simple')


def classification_of(*texts):
    found = []
    for text in texts:
        for level in LEVELS:
            if text and re.search(level.replace(' ', r'\s*'), text, re.I) and level not in found:
                found.append(level)
    order = ['Simple', 'Complex', 'Highly Technical']
    return ' / '.join(sorted(found, key=order.index)) or None


def transaction_type_of(*texts):
    joined = ' '.join(t for t in texts if t)
    m = re.search(r'\bG2[BCG]\b|Government to (Business|Citizens?|Government)', joined, re.I)
    if m:
        return m.group(0)
    if re.search(r'\bExternal\b', joined, re.I):
        return 'External'
    if re.search(r'\bInternal\b', joined, re.I):
        return 'Internal'
    return None


def doc_service_name(title):
    t = re.sub(r'^(ONLINE\s+)?BPLO\s+', lambda m: 'Online ' if m.group(1) else '', title)
    return title_case(t.strip())


def to_charter_service(raw, office, number):
    steps = []
    for st in raw['client_steps']:
        sub = []
        if st.get('agency'):
            sub.append({'letter': 'a', 'action': f"Office action: {st['agency']}"})
        info = [f"{label}: {st[k]}" for k, label in (('fees', 'Fee'), ('time', 'Processing time'),
                                                      ('person', 'Responsible'))
                if st.get(k)]
        if info:
            sub.append({'letter': chr(ord('a') + len(sub)), 'action': ' · '.join(info)})
        step = {'step': st['step'], 'action': st['action']}
        if sub:
            step['sub_steps'] = sub
        steps.append(step)
    fees = [st['fees'] for st in raw['client_steps']
            if st.get('fees') and st['fees'].strip().lower() not in ('none', 'n/a', 'na', '-')]
    return {
        'service_number': number,
        'service_name': title_case(raw['service_name']),
        'office_division': office,
        'classification': classification_of(raw['classification'], raw['type_of_transaction']),
        'type_of_transaction': transaction_type_of(raw['type_of_transaction'], raw['classification']),
        'who_may_avail': raw['who_may_avail'],
        'requirements': raw['requirements'],
        'client_steps': steps,
        'fees': {'amount': '; '.join(dict.fromkeys(fees)) if fees else 'None',
                 'description': 'See each step for the fee charged' if fees else 'No fees listed'},
        'processing_time': raw.get('total_time'),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cache', default=str(ROOT / '.local' / 'charter-pdfs'))
    args = ap.parse_args()
    cache = Path(args.cache)
    cache.mkdir(parents=True, exist_ok=True)

    services, seen, counters = [], set(), {}
    office_order = list(OFFICES.values())
    for doc in sorted(fetch_index(), key=lambda d: (office_order.index(OFFICES[d['sub_category']]), d['title'])):
        if any(t in doc['title'] for t in FORM_TITLES):
            continue
        office = OFFICES[doc['sub_category']]
        raws = parse(download(doc, cache))
        titles = SECTION_TITLES.get(doc['title'])
        for i, raw in enumerate(raws):
            if titles and i < len(titles):
                raw['service_name'] = titles[i]
            elif not raw['service_name']:
                raw['service_name'] = doc_service_name(doc['title'])
            svc_office = office
            if 'ANTI-DRUG' in doc['title'].upper():
                svc_office = 'TAGUIG ANTI-DRUG ABUSE OFFICE'
            key = json.dumps([raw['service_name'].lower(), raw['requirements'], raw['client_steps']], sort_keys=True)
            if key in seen:
                continue
            seen.add(key)
            o = office_order.index(office) + 1
            counters[o] = counters.get(o, 0) + 1
            svc = to_charter_service(raw, svc_office, f'{o}.{counters[o]}')
            svc['source_document'] = doc['file_url']
            services.append(svc)

    OUTPUT.write_text(json.dumps({'services': services}, indent=2, ensure_ascii=False) + '\n',
                      encoding='utf-8')
    print(f'Wrote {len(services)} services to {OUTPUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
