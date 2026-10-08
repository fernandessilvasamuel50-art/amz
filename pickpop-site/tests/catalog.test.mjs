import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateCatalog, parseBudget, matchCatalog, authorizedPrice, retailerDestination, safeAmazonURL } from '../assets/js/catalog.js';
const catalog = JSON.parse(fs.readFileSync(new URL('../data/catalog.json', import.meta.url)));
const config = JSON.parse(fs.readFileSync(new URL('../data/site.json', import.meta.url)));
const items = validateCatalog(catalog);
const filters = changes => ({ category: 'all', budget: 50, preferences: [], query: '', sort: 'featured', ...changes });
test('original concepts are centralized and demonstrative, with no real product facts', () => {
  assert.equal(items.length, 20);
  assert(items.every(item => item.verification.status === 'demo' && !item.price && !item.asin && !item.affiliateUrl && !item.benefits.length));
  const invalid = structuredClone(catalog); invalid.items[0].price = { amount: 1 };
  assert.throws(() => validateCatalog(invalid));
  const duplicate = structuredClone(catalog); duplicate.items.push(duplicate.items[0]);
  assert.throws(() => validateCatalog(duplicate));
});
test('exact numeric budgets are validated without rounding the preference', () => {
  assert.equal(parseBudget('56'), 56); assert.equal(parseBudget('24.99'), 24.99);
  for (const value of ['', null, 'banana', '-1', '10001', '1.001', 'Infinity']) assert.equal(parseBudget(value), 50);
});
test('keywords, category, all selected styles, and priority combine deterministically', () => {
  assert.deepEqual(matchCatalog(items, filters({ query: 'coffee mug' }), config).map(match => match.item.id), ['mug']);
  assert.deepEqual(matchCatalog(items, filters({ query: 'slow-feeder' }), config).map(match => match.item.id), ['bowl']);
  const matched = matchCatalog(items, filters({ category: 'kitchen', preferences: ['space-saving', 'minimalist'], priority: 'small-spaces' }), config);
  assert.deepEqual(matched.map(match => match.item.id), ['spice', 'glass', 'rack']);
  assert(matched.every(match => match.reasons.some(reason => reason.includes('space-saving')) && match.reasons.some(reason => reason.includes('priority'))));
  assert.equal(matchCatalog(items, filters({ category: 'pets', preferences: ['modern'] }), config).length, 0);
});
test('planning cap is inclusive, Gifts uses declared editorial tags, unknown query produces no random substitute', () => {
  assert(matchCatalog(items, filters({ budget: 25 }), config).some(match => match.item.id === 'spice'));
  assert(!matchCatalog(items, filters({ budget: 24.99 }), config).some(match => match.item.id === 'spice'));
  assert(matchCatalog(items, filters({ category: 'gifts' }), config).every(match => match.item.styles.includes('gift-ideas')));
  assert.equal(matchCatalog(items, filters({ query: 'unlisted coffee maker machine' }), config).length, 0);
});
test('verified fixture without authorized current price is not falsely removed by budget', () => {
  const fixture = { ...items[0], id: 'unit-test-fixture', verification: { status: 'verified' }, planningBudget: 999, price: null };
  const matches = matchCatalog([fixture], filters({ budget: 5 }), config);
  assert.equal(matches.length, 1); assert.equal(matches[0].reference, null);
  assert(matches[0].reasons.some(reason => reason.includes('unverified')));
});
test('price capability fails closed for disabled, stale, future, or unauthorized data', () => {
  const now = Date.now();
  const fixture = { ...items[0], verification: { status: 'verified' }, price: { amount: 12, currency: 'USD', authorized: true, source: 'creators-api', fetchedAt: new Date(now-1000).toISOString(), expiresAt: new Date(now+1000).toISOString() } };
  assert.equal(authorizedPrice(fixture, config, now), null);
  const enabled = { amazonContent: { enabled: true } };
  assert.equal(authorizedPrice(fixture, enabled, now), 12);
  assert.equal(authorizedPrice(fixture, enabled, now+2000), null);
  assert.equal(authorizedPrice({ ...fixture, price: { ...fixture.price, authorized: false } }, enabled, now), null);
  assert.equal(authorizedPrice({ ...fixture, price: { ...fixture.price, fetchedAt: new Date(now+500).toISOString() } }, enabled, now), null);
});
test('only supplied, approved affiliate links activate; unsafe destinations are rejected', () => {
  for (const value of ['javascript:alert(1)', 'https://amazon.com.evil.test/item', 'https://user:pass@amazon.com/item', 'http://amazon.com/item']) assert.equal(safeAmazonURL(value), null);
  assert.equal(retailerDestination(items[0], config).sponsored, false);
  const fixture = { ...items[0], verification: { status: 'verified' }, affiliateUrl: 'https://www.amazon.com/dp/unit-test-only?tag=fixture-20', affiliateVerification: { status: 'owner-provided' } };
  assert.equal(retailerDestination(fixture, config).sponsored, false);
  const enabled = { affiliate: { enabled: true, approved: true, associateTag: 'fixture-20' } };
  assert.equal(retailerDestination(fixture, enabled).sponsored, true);
  assert.equal(retailerDestination(fixture, { affiliate: { ...enabled.affiliate, associateTag: 'wrong-20' } }).sponsored, false);
});
test('sorting uses reference values consistently; saves combine with all other filters', () => {
  for (const order of ['asc', 'desc']) {
    const values = matchCatalog(items, filters({ budget: 300, sort: order }), config).map(match => match.reference);
    assert.deepEqual(values, [...values].sort((a,b) => order === 'asc' ? a-b : b-a));
  }
  assert.deepEqual(matchCatalog(items, filters({ savedOnly: true, saved: ['mug', 'headset'] }), config).map(match => match.item.id), ['mug']);
});
