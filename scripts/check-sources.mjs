// Fails when a source link in src/data cites a site that is not an official channel.
// Rule (src/data/README.md): every fact cites taguig.gov.ph, another government site, a city office's own
// Facebook page, or a reliable news outlet. To allow a new site, add it to OFFICIAL or NEWS in a reviewed pull request.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

/** Official channels that are not on a government domain. A Facebook page must be the office's own (checked in review). */
const OFFICIAL = ['facebook.com'];

/**
 * News outlets rated "Generally reliable" on Wikipedia's Philippine sources list
 * (https://en.wikipedia.org/wiki/Wikipedia:Tambayan_Philippines/Sources, checked 2026-11-19).
 * Marginally reliable and no-consensus outlets are left out.
 */
const NEWS = [
  'abante.com.ph',
  'abs-cbnnews.com',
  'news.abs-cbn.com',
  'balita.net.ph',
  'bnc.ph',
  'bomboradyo.com',
  'gmanetwork.com',
  'inquirer.net',
  'interaksyon.com',
  'malaya.com.ph',
  'manilastandard.net',
  'manilatimes.net',
  'mb.com.ph',
  'newsko.com.ph',
  'pcij.org',
  'philstar.com',
  'radar.ph',
  'rappler.com',
  'sunstar.com.ph',
  'tempo.com.ph',
  'thestandard.com.ph',
  'tribune.net.ph',
];

export function isTrustedSource(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (/\.gov(\.[a-z]{2})?$/.test(host)) return true;
  return [...OFFICIAL, ...NEWS].some(
    domain => host === domain || host.endsWith(`.${domain}`)
  );
}

// Fields that hold a citation: source, sources, source_document, sourceDocument, source_url, sourceUrl.
// Contact links such as `website` or `url` outside `sources` are not citations.
const CITATION_KEY = /^sources?(_?(document|url))?$/i;

export function findUntrusted(data, path = '') {
  const bad = [];
  const walk = (node, at, citation) => {
    if (typeof node === 'string') {
      if (citation && /^https?:\/\//i.test(node) && !isTrustedSource(node)) {
        bad.push(`${at}: ${node}`);
      }
    } else if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${at}[${i}]`, citation));
    } else if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) {
        walk(value, `${at}.${key}`, citation || CITATION_KEY.test(key));
      }
    }
  };
  walk(data, path, false);
  return bad;
}

// Self-check
assert.equal(
  isTrustedSource('https://kiosk-info.taguig.gov.ph/uploads/x.pdf'),
  true
);
assert.equal(
  isTrustedSource('https://www.facebook.com/share/p/1FEjUjmNze/'),
  true
);
assert.equal(isTrustedSource('https://www.dbm.gov.ph/'), true);
assert.equal(isTrustedSource('https://newsinfo.inquirer.net/123/x'), true);
assert.equal(isTrustedSource('https://news.abs-cbn.com/news/x'), true);
assert.equal(isTrustedSource('https://ent.abs-cbn.com/x'), false);
assert.equal(isTrustedSource('https://en.wikipedia.org/wiki/Taguig'), false);
assert.equal(isTrustedSource('https://notfacebook.com/x'), false);
assert.equal(isTrustedSource('https://taguig.gov.ph.evil.com/'), false);
assert.equal(isTrustedSource('not a url'), false);
assert.deepEqual(
  findUntrusted(
    {
      website: 'https://blog.example',
      sources: [{ url: 'https://blog.example/a' }],
    },
    'x'
  ),
  ['x.sources[0].url: https://blog.example/a']
);

const root = 'src/data';
const files = [];
const collect = dir => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) collect(p);
    else if (name.endsWith('.json')) files.push(p);
  }
};
collect(root);

const problems = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8').replace(/^﻿/, '');
  if (!text.trim()) continue;
  problems.push(...findUntrusted(JSON.parse(text), relative('.', file)));
}

if (problems.length) {
  console.error(
    `${problems.length} source link(s) cite a site that is not an official channel (see src/data/README.md):`
  );
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(
  `Source check passed: ${files.length} data files, every source link is official.`
);
