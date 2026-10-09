const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const base = process.env.PICKPOP_TEST_URL || 'http://127.0.0.1:8082';
const output = path.join(__dirname, 'artifacts');
(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PICKPOP_BROWSER || 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage(), errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  context.on('request', request => requests.push(request.url()));
  const ready = async () => { await page.waitForFunction(() => document.querySelector('#product-search') && !document.querySelector('#product-search').disabled); };
  const catalogCount = JSON.parse(await fs.readFile(path.join(root, 'data/catalog.json'), 'utf8')).items.length;
  const count = () => page.locator('#product-grid .product-card').count();
  const names = () => page.locator('#product-grid .product-copy h3').allTextContents();
  const search = value => page.locator('#product-search').fill(value);
  const budget = value => page.locator('#budget-input').fill(String(value));
  const reset = () => page.locator('#clear-filters').click();
  try {
    await page.goto(base); await ready();
    assert.equal(await count(), catalogCount);
    await search('CHEMEX'); assert.deepEqual(await names(), ['CHEMEX Six-Cup Classic Series Coffeemaker']);
    await search('computer mouse'); assert.deepEqual(await names(), ['Logitech M185 Compact Ambidextrous Wireless Mouse — Swift Grey']);
    await search('L10SK3'); assert.deepEqual(await names(), ['Lodge Pre-Seasoned Cast Iron Skillet — 12 Inches']);
    await search('coffee mug'); assert.equal(await count(), 0); assert.equal(await page.locator('#empty-state').isVisible(), true);
    await page.locator('#reset-filters').click(); assert.equal(await count(), catalogCount);
    await budget(5); assert.equal(await count(), catalogCount); assert((await page.locator('#budget-help').textContent()).includes('not excluded'));
    await page.locator('[data-category="pets"]').click(); assert.deepEqual(await names(), ['KONG Classic Stuffable Dog Toy — Medium, Red']);
    await search('Logitech'); assert.equal(await count(), 0); await reset();
    await page.locator('[data-category="organization"]').click(); assert.equal(await count(), 0); await reset();
    await page.locator('.preferences-panel summary').click(); await page.locator('[data-category="tech"]').click();
    await page.locator('[data-preference="space-saving"]').check(); await page.locator('[data-preference="minimalist"]').check();
    assert.deepEqual(await names(), ['Logitech M185 Compact Ambidextrous Wireless Mouse — Swift Grey']);
    await page.locator('#priority-filter').selectOption('small-spaces'); assert.equal(await count(), 1); await reset();
    await budget(''); assert.equal(await page.locator('#budget-error').isVisible(), true); assert.equal(await page.locator('#budget-input').getAttribute('aria-invalid'), 'true');
    await reset(); await budget(300);
    await page.locator('#sort-order').selectOption('name');
    const sortedNames = await names(); assert.deepEqual(sortedNames, [...sortedNames].sort((a,b) => a.localeCompare(b, 'en-US')));
    await reset(); await page.locator('#product-grid [data-product-id="chemex-six-cup"]').click();
    assert.equal(await page.locator('#saved-count').textContent(), '1');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.productId), 'chemex-six-cup');
    await page.reload(); await ready(); assert.equal(await page.locator('#product-grid [data-product-id="chemex-six-cup"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#saved-toggle').click(); assert.equal(await count(), 1);
    await search('blender'); assert.equal(await count(), 0);
    await page.locator('#reset-filters').click(); assert.equal(await count(), 1);
    await page.locator('#product-grid [data-product-id="chemex-six-cup"]').click(); assert.equal(await count(), 0);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'saved-toggle');
    await reset(); await page.locator('#product-grid [data-product-id="chemex-six-cup"]').click(); await page.locator('#remember-saved').uncheck();
    assert.equal(await page.evaluate(() => localStorage.getItem('pickpop-saved')), null);
    await page.reload(); await ready(); assert.equal(await page.locator('#saved-count').textContent(), '0'); assert.equal(await page.locator('#remember-saved').isChecked(), false);
    await page.locator('#remember-saved').check();
    for (const raw of ['["chemex-six-cup","chemex-six-cup","unknown",null,5]', '{}', 'broken']) {
      await page.evaluate(value => localStorage.setItem('pickpop-saved', value), raw); await page.reload(); await ready();
      assert.equal(await page.locator('#saved-count').textContent(), raw.startsWith('[') ? '1' : '0');
    }
    const second = await context.newPage(); await second.goto(base + '/find/'); await second.waitForFunction(() => !document.querySelector('#product-search').disabled);
    await second.locator('#product-grid [data-product-id="chemex-six-cup"]').click(); await page.waitForFunction(() => document.querySelector('#saved-count').textContent === '1');
    await second.evaluate(() => localStorage.clear()); await page.waitForFunction(() => document.querySelector('#saved-count').textContent === '0'); await second.close();
    for (const id of ['chemex-six-cup', 'logitech-m185', 'logitech-k120']) await page.locator(`[data-compare-id="${id}"]`).click();
    assert.equal(await page.locator('#comparison thead th').count(), 4);
    await page.locator('[data-compare-id="logitech-c920"]').click(); assert((await page.locator('#compare-status').textContent()).includes('limit'));
    await page.getByRole('button', { name: 'Remove Logitech M185 Compact Ambidextrous Wireless Mouse — Swift Grey from comparison', exact: true }).click();
    assert.equal(await page.locator('#comparison thead th').count(), 3);
    await search('<script>alert(1)</script>'); assert.equal(await page.locator('#results-summary script').count(), 0);
    await page.locator('#product-search').press('Enter'); assert.equal(await page.evaluate(() => document.activeElement.id), 'results-summary');
    await reset();
    await page.locator('[name="quiz-category"][value="tech"]').check(); await page.locator('#quiz-next').click();
    await page.locator('[name="quiz-budget"][value="50"]').check(); await page.locator('#quiz-next').click();
    await page.locator('[name="quiz-style"][value="minimalist"]').check(); await page.locator('#quiz-next').click();
    await page.locator('[name="quiz-priority"][value="small-spaces"]').check(); await page.locator('#quiz-next').click();
    assert.deepEqual(await page.locator('#quiz-app .product-copy h3').allTextContents(), ['Logitech M185 Compact Ambidextrous Wireless Mouse — Swift Grey']);
    assert((await page.locator('#quiz-app .why-match').first().textContent()).includes('priority'));
    const quizLink = await page.locator('#quiz-app a[href^="/find/"]').getAttribute('href');
    await page.goto(base + quizLink); await ready(); assert.equal(await count(), 1);
    await page.goto(base + '/?q=desk&budget=56#finder'); await ready(); assert.equal(await page.locator('#budget-value').textContent(), '$56');
    for (const value of ['banana', '-1', '10001', '']) { await page.goto(base + '/?budget=' + value); await ready(); assert.equal(await page.locator('#budget-value').textContent(), '$50'); }

    await page.goto(base); await ready();
    await page.locator('#quiz-next').click(); await page.locator('#quiz-next').click();
    await page.locator('[name="quiz-style"][value="cozy"]').check(); await page.locator('#quiz-next').click();
    await page.locator('[name="quiz-priority"][value="small-spaces"]').check(); await page.locator('#quiz-next').click();
    assert.equal(await page.locator('#quiz-app .product-card').count(), 0);
    assert((await page.locator('#quiz-app').textContent()).includes('no product matching these answers'));

    await page.route('**/data/catalog.json', route => route.abort()); await page.reload();
    await page.locator('#catalog-error').waitFor({ state: 'visible' }); assert.equal(await page.locator('#find-button').isDisabled(), true);
    await page.unroute('**/data/catalog.json'); await page.locator('#catalog-retry').click(); await ready(); assert.equal(await count(), catalogCount);
    const privateContext = await browser.newContext();
    await privateContext.addInitScript(() => { Storage.prototype.getItem = () => { throw Error('Blocked'); }; Storage.prototype.setItem = () => { throw Error('Blocked'); }; });
    const privatePage = await privateContext.newPage(); await privatePage.goto(base); await privatePage.waitForFunction(() => !document.querySelector('#product-search').disabled);
    await privatePage.locator('#product-grid [data-product-id="chemex-six-cup"]').click(); assert.equal(await privatePage.locator('#saved-count').textContent(), '1');
    assert((await privatePage.locator('#saved-status').textContent()).includes('only for this visit')); await privateContext.close();

    const catalog = JSON.parse(await fs.readFile(path.join(root, 'data/catalog.json'), 'utf8'));
    const routes = ['/', '/find/', '/guides/', '/collections/', '/collections/small-kitchen/', '/collections/coffee-corner/', '/collections/feel-good-home/', '/about.html', '/privacy.html', '/contact/', '/disclosure/', '/guides/coffee-maker-small-apartment.html', '/guides/small-kitchen.html', '/guides/desk-reset.html', '/guides/smart-gifts.html', '/guides/kitchen-cabinet-organization.html', '/guides/drinkware-buying-guide.html', '/guides/spice-storage.html', '/guides/food-storage-containers.html', '/guides/coffee-station.html', '/guides/small-apartment-kitchen-essentials.html', '/image-credits/', ...catalog.items.map(item => '/ideas/' + item.id + '/'), '/missing-page'];
    const layouts = [];
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        const response = await page.goto(base + route); assert.equal(response.status(), route === '/missing-page' ? 404 : 200, `Page status at ${width}: ${route}`);
        if (route === '/' || route === '/find/') await ready();
        assert.equal(await page.locator('html').getAttribute('lang'), 'en-US'); assert.equal(await page.locator('h1').count(), 1, route);
        assert.equal(await page.locator('link[rel="canonical"]').count(), 1); assert.equal(await page.locator('meta[name="description"]').count(), 1);
        const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth })); layouts.push({ route, ...dimensions });
        if (dimensions.scroll > width + 1) { await page.screenshot({ path: path.join(output, 'overflow.png'), fullPage: true }); console.log(await page.evaluate(() => [...document.querySelectorAll('main *')].map(el => ({ name: el.className || el.tagName, right: el.getBoundingClientRect().right })).filter(item => item.right > innerWidth + 1).slice(0,15))); }
        assert(dimensions.scroll <= width + 1, `Overflow at ${width}: ${route} (${dimensions.scroll})`);
        if (width < 850) {
          await page.locator('#mobile-menu').click(); assert.equal(await page.locator('#mobile-nav').isVisible(), true);
          await page.keyboard.press('Escape'); assert.equal(await page.locator('#mobile-menu').getAttribute('aria-label'), 'Open menu');
          assert.equal(await page.evaluate(() => document.activeElement.id), 'mobile-menu');
        }
        const links = await page.locator('a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(el => el.getAttribute('href').split('#')[0].split('?')[0] || '/'))]);
        if (width === 1440) for (const href of links) assert.equal((await page.request.get(base + href)).status(), 200, `Broken link on ${route}: ${href}`);
        const retailers = await page.locator('a[href^="https://www.amazon.com/"]').evaluateAll(elements => elements.map(el => ({ href: el.href, rel: el.rel })));
        assert(retailers.every(link => link.rel.includes('noopener') && (!new URL(link.href).searchParams.has('tag') || (new URL(link.href).searchParams.get('tag') === 'pickpop03-20' && link.rel.includes('sponsored')))));
        const photos = page.locator('img[src^="/assets/products/"]');
        for (const image of await photos.all()) {
          await image.scrollIntoViewIfNeeded();
          await image.evaluate(img => img.decode());
        }
        const images = await photos.evaluateAll(elements => elements.map(image => ({ alt: image.alt, width: image.naturalWidth, complete: image.complete })));
        assert(images.every(image => image.alt && image.complete && image.width > 0), 'Licensed product photos load with alt text: ' + route);
      }
    }
    await page.goto(base); await ready(); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => location.hash), '#main', 'Skip link works by keyboard');
    await page.locator('#budget-range').focus(); const before = Number(await page.locator('#budget-range').inputValue()); await page.keyboard.press('ArrowRight');
    assert(Number(await page.locator('#budget-range').inputValue()) > before);
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: width === 360 ? 800 : 1000 }); await page.goto(base); await ready();
      await page.screenshot({ path: path.join(output, width === 360 ? 'mobile.png' : 'desktop.png'), fullPage: true });
      for (const selector of ['.hero', '#finder', '#vibe']) { await page.locator(selector).screenshot({ path: path.join(output, `${width}-${selector.replace(/[.#]/g,'')}.png`) }); }
    }
    assert.deepEqual(errors, [], 'No uncaught JavaScript errors');
    const external = [...new Set(requests.filter(url => !url.startsWith(base)))];
    assert.deepEqual(external, [], 'No analytics, Amazon API, or other external services contacted');
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ status: 'passed', pageLayouts: layouts.length, layouts, errors, unexpectedExternalRequests: external }, null, 2));
    console.log(`PASS: combined finder, exact budgets, sorting, favorites/privacy/storage, comparisons, deterministic quiz, errors/retry, keyboard, links, metadata, and ${layouts.length} page layouts at 360/768/1440.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
