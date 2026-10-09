/* Optional local axe audit; install axe-core for development or pass PICKPOP_AXE_PATH. */
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const base = process.env.PICKPOP_TEST_URL || 'http://127.0.0.1:8082';
(async () => {
  const source = await fs.readFile(process.env.PICKPOP_AXE_PATH || require.resolve('axe-core/axe.min.js'), 'utf8');
  const browser = await chromium.launch({ headless: true, channel: process.env.PICKPOP_BROWSER || 'chrome' });
  const reports = [], consoleErrors = [];
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await context.addInitScript(() => {
    window.pickpopPerformance = { lcp: null, cls: 0 };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.pickpopPerformance.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.pickpopPerformance.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  const page = await context.newPage();
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));
  try {
    const routes = ['/', '/find/', '/guides/', '/guides/coffee-maker-small-apartment.html', '/guides/coffee-station.html', '/guides/small-kitchen.html', '/guides/small-apartment-kitchen-essentials.html', '/guides/smart-gifts.html', '/ideas/oxo-basting-brush/', '/collections/', '/collections/small-kitchen/', '/ideas/chemex-six-cup/', '/ideas/kong-classic-medium/', '/image-credits/', '/guides/food-storage-containers.html', '/privacy.html', '/about.html', '/disclosure/', '/contact/'];
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        const response = await page.goto(base + route);
        assert.equal(response.status(), 200); assert(response.headers()['content-security-policy'], 'Production CSP is present');
        if (route === '/' || route === '/find/') await page.waitForFunction(() => !document.querySelector('#product-search').disabled);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(source);
        const result = await page.evaluate(async () => axe.run(document, { preload: false, runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }));
        const performance = await page.evaluate(() => ({ ...window.pickpopPerformance, resources: performance.getEntriesByType('resource').filter(entry => entry.name.startsWith(location.origin)).reduce((sum, entry) => sum + entry.transferSize, 0), domReadyMs: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd }));
        const violations = result.violations.map(item => ({ id: item.id, impact: item.impact, help: item.help, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
        const incomplete = result.incomplete.map(item => ({ id: item.id, targets: item.nodes.map(node => node.target) }));
        reports.push({ route, width, violations, incomplete, performance });
        if (violations.length) console.log(JSON.stringify({ route, width, violations }, null, 2));
      }
    }
    await fs.writeFile(path.join(__dirname, 'artifacts/quality.json'), JSON.stringify({ axeVersion: await page.evaluate(() => axe.version), reports, consoleErrors, notes: 'Local unthrottled browser measurements, not Lighthouse scores or field Core Web Vitals. Incomplete axe checks need human review.' }, null, 2));
    assert.deepEqual(consoleErrors, [], 'No critical console or CSP errors in production artifact');
    assert.equal(reports.reduce((count, report) => count + report.violations.length, 0), 0, 'No automated WCAG A/AA violations');
    console.log(`PASS: ${reports.length} accessibility audits with production headers; no console/CSP errors. Local timing measurements saved without claiming Lighthouse scores.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
