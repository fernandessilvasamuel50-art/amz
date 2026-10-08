import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateCatalog, parseBudget, matchCatalog, authorizedPrice, retailerDestination, safeAmazonURL } from '../assets/js/catalog.js';
import { CuratedCatalogProvider, AmazonCreatorsApiProvider } from '../assets/js/providers.js';
const catalog = JSON.parse(fs.readFileSync(new URL('../data/catalog.json', import.meta.url)));
const config = JSON.parse(fs.readFileSync(new URL('../data/site.json', import.meta.url)));
const items = validateCatalog(catalog);
const provider = new CuratedCatalogProvider(catalog, config);
const filters = changes => ({ category: 'all', budget: 50, preferences: [], query: '', sort: 'featured', ...changes });
test('published catalog contains verified identities, real licensed photos, and no invented prices', () => {
  assert(items.length >= 6);
  for (const item of items) {
    assert.equal(item.verification.status, 'verified'); assert.equal(item.price, null);
    assert.equal(item.productUrl, 'https://www.amazon.com/dp/' + item.asin);
    assert(item.image.authorized && item.image.variantReviewed && item.image.author && item.image.licenseUrl);
    assert(fs.existsSync(new URL('..' + item.image.src, import.meta.url)));
  }
  const invalid = structuredClone(catalog); invalid.items[0].image.authorized = false;
  assert.throws(() => validateCatalog(invalid));
  const duplicate = structuredClone(catalog); duplicate.items.push(duplicate.items[0]); assert.throws(() => validateCatalog(duplicate));
});
test('exact numeric budgets reject invalid values without rounding', () => {
  assert.equal(parseBudget('24.99'), 24.99); assert.equal(parseBudget('56'), 56);
  for (const value of ['', null, 'banana', '-1', '10001', '1.001', 'Infinity']) assert.equal(parseBudget(value), 50);
});
test('local provider searches names, brands, models, related words, and categories', () => {
  assert.deepEqual(provider.search(filters({ query: 'chemex' })).map(m => m.item.id), ['chemex-six-cup']);
  assert.deepEqual(provider.search(filters({ query: 'computer mouse' })).map(m => m.item.id), ['logitech-m185']);
  assert.deepEqual(provider.search(filters({ query: 'L10SK3' })).map(m => m.item.id), ['lodge-twelve-inch']);
  assert.equal(provider.search(filters({ query: 'Logitech' })).length, 3);
  assert.equal(provider.search(filters({ query: 'unlisted coffee mug' })).length, 0);
});
test('category, every style, and priority combine without unrelated substitutes', () => {
  assert.deepEqual(provider.search(filters({ category: 'tech', preferences: ['minimalist', 'space-saving'], priority: 'small-spaces' })).map(m => m.item.id), ['logitech-m185']);
  assert.equal(provider.search(filters({ category: 'pets', query: 'Logitech' })).length, 0);
  assert(provider.search(filters({ category: 'gifts' })).every(m => m.item.styles.includes('gift-ideas')));
});
test('unknown current prices stay visible at any valid budget with an explicit reason', () => {
  const results = provider.search(filters({ budget: 5 })); assert.equal(results.length, items.length);
  assert(results.every(m => m.reference === null && m.reasons.some(r => r.includes('unverified'))));
});
test('name sorting and saved-only filtering preserve the declared catalog', () => {
  const names = provider.search(filters({ sort: 'name' })).map(m => m.item.name);
  assert.deepEqual(names, [...names].sort((a,b) => a.localeCompare(b, 'en-US')));
  assert.deepEqual(provider.search(filters({ savedOnly: true, saved: ['logitech-m185'] })).map(m => m.item.id), ['logitech-m185']);
});
test('authorized prices fail closed for disabled, stale, future, or unauthorized data', () => {
  const now = Date.now();
  const fixture = { ...items[0], price: { amount: 12, currency: 'USD', authorized: true, source: 'creators-api', fetchedAt: new Date(now-1000).toISOString(), expiresAt: new Date(now+1000).toISOString() } };
  const enabled = { amazonContent: { enabled: true } };
  assert.equal(authorizedPrice(fixture, config, now), null); assert.equal(authorizedPrice(fixture, enabled, now), 12);
  assert.equal(authorizedPrice(fixture, enabled, now+2000), null);
  assert.equal(authorizedPrice({ ...fixture, price: { ...fixture.price, authorized: false } }, enabled, now), null);
  assert.equal(authorizedPrice({ ...fixture, price: { ...fixture.price, fetchedAt: new Date(now+500).toISOString() } }, enabled, now), null);
  assert.equal(matchCatalog([fixture], filters({ budget: 11.99 }), enabled).length, 0);
  assert.equal(matchCatalog([fixture], filters({ budget: 12 }), enabled).length, 1);
});
test('owner tag activates verified direct product links; disabled mode falls back to public URLs', () => {
  for (const item of items) {
    const link = retailerDestination(item, config); assert.equal(link.sponsored, true);
    const url = new URL(link.url); assert.equal(url.hostname, 'www.amazon.com'); assert.equal(url.pathname, '/dp/' + item.asin); assert.equal(url.searchParams.get('tag'), 'pickpop03-20');
    const ordinary = retailerDestination(item, { ...config, affiliate: { enabled: false } }); assert.equal(ordinary.sponsored, false); assert.equal(ordinary.url, item.productUrl);
  }
  for (const value of ['javascript:alert(1)', 'https://amazon.com.evil.test/item', 'https://user:pass@amazon.com/item', 'http://amazon.com/item']) assert.equal(safeAmazonURL(value), null);
  const bad = { ...items[0], affiliateUrl: items[0].productUrl + '?tag=someone-else-20' }; assert.equal(retailerDestination(bad, config).sponsored, false);
});
test('Amazon provider is disabled and never calls a transport by default', async () => {
  let calls = 0; const api = new AmazonCreatorsApiProvider({ transport: async () => { calls++; } });
  const result = await api.search(filters({ query: 'coffee' })); assert.equal(result.status, 'disabled'); assert.equal(calls, 0);
});
test('future API boundary validates synthetic responses and handles simulated failures', async () => {
  // Injected local fixtures only; these tests do not contact Amazon or claim an integration.
  let operation;
  const api = new AmazonCreatorsApiProvider({ authorized: true, transport: async request => { operation = request.operation; return structuredClone(catalog); } });
  assert.equal((await api.search(filters({}))).status, 'ready'); assert.equal(operation, 'SearchItems');
  const invalid = new AmazonCreatorsApiProvider({ authorized: true, transport: async () => ({ items: [] }) }); assert.equal((await invalid.search({})).status, 'error');
  const failed = new AmazonCreatorsApiProvider({ authorized: true, transport: async () => { throw Error('Simulated unavailable server'); } }); assert.equal((await failed.search({})).status, 'error');
});
