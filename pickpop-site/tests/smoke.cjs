/* Run with Node.js and Playwright available. Does not contact Amazon or deploy. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = process.env.PICKPOP_TEST_URL || 'http://127.0.0.1:8080';
const output = path.join(__dirname, 'artifacts');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PICKPOP_BROWSER || 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const names = () => page.locator('.product-copy h3').allTextContents();
  const count = () => page.locator('.product-card').count();
  const query = text => page.locator('#product-search').fill(text);
  const budget = async value => {
    await page.locator('#budget-range').evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, value);
  };
  try {
    await page.goto(base);
    assert.equal(await count(), 16, 'Default $50 budget');
    assert.equal(await page.locator('[data-category="all"]').getAttribute('aria-pressed'), 'true');
    await query('coffee mug');
    assert.deepEqual(await names(), ['Everyday ceramic mug']);
    await query('slow-feeder');
    assert.deepEqual(await names(), ['Slow-feeder pet bowl']);
    await query('');
    await budget(5);
    assert.equal(await count(), 0);
    await page.locator('#reset-filters').click();
    assert.equal(await count(), 20, 'See all ideas includes the whole example catalog');
    await budget(15);
    assert.deepEqual(await names(), ['Desk cable organizer']);
    await page.locator('[data-budget="25"]').click();
    assert((await names()).includes('Space-saving spice jars'), 'Budget cap is inclusive');
    assert.equal(await page.locator('#budget-value').textContent(), '$25');
    await page.locator('[data-category="pets"]').click();
    assert.equal(await count(), 3);
    await query('cat');
    assert.equal(await count(), 2);
    await page.locator('#clear-filters').click();
    assert.equal(await count(), 16);
    await page.locator('[data-budget="300"]').click();
    for (const order of ['asc', 'desc']) {
      await page.locator('#sort-order').selectOption(order);
      const amounts = (await page.locator('.product-price strong').allTextContents()).map(value => Number(value.slice(1)));
      assert.deepEqual(amounts, [...amounts].sort((a, b) => order === 'asc' ? a-b : b-a));
    }
    await page.locator('#clear-filters').click();
    await page.locator('[data-product-id="mug"]').click();
    assert.equal(await page.locator('#saved-count').textContent(), '1');
    assert.equal(await page.evaluate(() => document.activeElement.dataset.productId), 'mug', 'Saving keeps keyboard focus');
    await page.reload();
    assert.equal(await page.locator('[data-product-id="mug"]').getAttribute('aria-pressed'), 'true');
    await page.locator('#saved-toggle').click();
    assert.equal(await count(), 1);
    await query('blender');
    assert.equal(await count(), 0);
    assert.equal(await page.locator('#empty-title').textContent(), 'Your saved ideas are outside these filters.');
    await page.locator('#reset-filters').click();
    assert.equal(await count(), 1);
    assert.equal(await page.locator('#saved-toggle').getAttribute('aria-pressed'), 'true');
    await page.locator('[data-product-id="mug"]').click();
    assert.equal(await count(), 0);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'saved-toggle');
    assert.equal(await page.locator('#empty-title').textContent(), 'Your next favorite is waiting.');
    await page.locator('#reset-filters').click();
    assert.equal(await count(), 20);
    await query('<script>alert(1)</script>');
    assert.equal(await page.locator('#results-summary script').count(), 0);
    await page.locator('#product-search').press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'results-summary');
    await page.locator('#clear-filters').click();
    const links = await page.locator('.product-cta').evaluateAll(elements => elements.map(link => link.href));
    assert(links.every(href => { const url = new URL(href); return url.hostname === 'www.amazon.com' && url.pathname === '/s' && !url.searchParams.has('tag'); }));
    for (const stored of ['["mug","mug","unknown",null,5]', '{"mug":true}', 'broken JSON']) {
      await page.evaluate(stored => localStorage.setItem('pickpop-saved', stored), stored);
      await page.reload();
      assert.equal(await page.locator('#saved-count').textContent(), stored.startsWith('[') ? '1' : '0');
    }
    const second = await context.newPage();
    await second.goto(base);
    await second.locator('[data-product-id="mug"]').click();
    await page.waitForFunction(() => document.getElementById('saved-count').textContent === '1');
    await second.evaluate(() => localStorage.clear());
    await page.waitForFunction(() => document.getElementById('saved-count').textContent === '0');
    await second.close();
    await page.goto(base + '/?q=desk&budget=56#finder');
    assert.equal(await page.locator('#budget-value').textContent(), '$55', 'URL budgets agree with slider step');
    assert((await names()).includes('Desk monitor riser'));
    for (const invalid of ['banana', '999', '-1', '']) {
      await page.goto(base + '/?budget=' + invalid);
      assert.equal(await page.locator('#budget-value').textContent(), '$50');
    }
    const unavailable = await browser.newContext({ reducedMotion: 'reduce' });
    await unavailable.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
      Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
    });
    const privatePage = await unavailable.newPage();
    await privatePage.goto(base);
    await privatePage.locator('[data-product-id="mug"]').click();
    assert.equal(await privatePage.locator('#saved-count').textContent(), '1');
    assert((await privatePage.locator('#saved-status').textContent()).includes('only for this visit'));
    await unavailable.close();

    const routes = ['/', '/guides/desk-reset.html', '/guides/smart-gifts.html', '/guides/small-kitchen.html', '/about.html', '/privacy.html', '/missing-page'];
    const layouts = [];
    for (const width of [320, 375, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        const response = await page.goto(base + route);
        assert.equal(response.status(), route === '/missing-page' ? 404 : 200);
        assert.equal(await page.locator('html').getAttribute('lang'), 'en-US');
        const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
        layouts.push({ route, ...dimensions });
        if (dimensions.scroll > width + 1) {
          console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].map(element => ({ name: element.className || element.tagName, right: element.getBoundingClientRect().right, left: element.getBoundingClientRect().left })).filter(item => item.right > innerWidth + 1 && item.left >= 0).slice(0, 20)));
          await page.screenshot({ path: path.join(output, 'overflow.png'), fullPage: true });
        }
        assert(dimensions.scroll <= width + 1, `Horizontal overflow: ${route} at ${width}px (${dimensions.scroll}px)`);
        if (width <= 850) {
          const menu = page.locator('#mobile-menu');
          await menu.click();
          assert.equal(await menu.getAttribute('aria-label'), 'Close menu');
          assert.equal(await page.locator('#mobile-nav').isVisible(), true);
          await page.keyboard.press('Escape');
          assert.equal(await menu.getAttribute('aria-label'), 'Open menu');
          assert.equal(await page.evaluate(() => document.activeElement.id), 'mobile-menu');
          await menu.click();
          await page.locator('#mobile-nav a').first().click();
          assert.equal(await page.locator('#mobile-menu').getAttribute('aria-label'), 'Open menu');
        }
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base);
    await page.screenshot({ path: path.join(output, 'mobile.png'), fullPage: true });
    await page.locator('#finder').screenshot({ path: path.join(output, 'mobile-finder.png') });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base);
    await page.screenshot({ path: path.join(output, 'desktop.png'), fullPage: true });
    await page.locator('.hero').screenshot({ path: path.join(output, 'desktop-hero.png') });
    const hrefs = await page.locator('a[href^="/"]').evaluateAll(elements => [...new Set(elements.map(element => element.getAttribute('href').split('#')[0] || '/'))]);
    for (const href of hrefs) assert.equal((await page.request.get(base + href)).status(), 200, `Local link: ${href}`);
    assert.deepEqual(errors, [], 'No uncaught JavaScript errors');
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ status: 'passed', layouts, errors }, null, 2));
    console.log('PASS: search, inclusive budgets, categories, sorting, empty states, keyboard focus, saved ideas, reload, invalid storage, storage unavailable, cross-tab updates, URL budgets, navigation, local links, 404, and 42 responsive page checks.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
