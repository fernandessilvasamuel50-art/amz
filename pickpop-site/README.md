# pickpop. — Budget-first discovery site (prototype 1)

A responsive, English-language shopping inspiration site with a fun original CSS design, a budget-first idea finder, saved ideas, four categories, and three original editorial articles.

## Try locally

On Windows, double-click `start-local.cmd` in this folder. The launcher finds a working Python 3 installation, or uses the Python runtime already bundled with the Codex desktop app. It does not install anything.
Or run from a terminal, with no build dependencies:

```bash
cd pickpop-site
python serve.py
```

Visit `http://127.0.0.1:8080` in your browser. Press Ctrl+C in the terminal to stop.
The preview binds only to this computer, disables caching while you edit, and serves the existing `404.html` for missing pages. It does not publish anything.
If port 8080 is busy, use `python serve.py --port 8081` and open `http://127.0.0.1:8081`.
On Windows you can also use `py -3 serve.py`. Do **not** double-click `index.html`: a server is needed for absolute paths like `/assets/...`.

## Technical review and local testing

This revision continues the existing HTML/CSS/JavaScript prototype. The original ZIP is preserved in the parent folder. No live products, current prices, API integration, or affiliate tracking were added.

- Search combines keywords, category, and an inclusive planning budget. Hyphenated queries work; the slider uses $5 steps, including for incoming URL budgets.
- Quick budget controls use "Up to" to match the inclusive cap. Sorting refers to illustrative budgets rather than verified product prices.
- "Reset filters" restores the default $50 view. "See all ideas" clears filters and raises the cap to $300 to show all 20 examples. "Show all saved ideas" keeps the saved view while clearing its search/category/budget restrictions.
- Saved IDs are validated and deduplicated; blocked browser storage keeps favorites for the current visit and explains the limitation. Changes synchronize between tabs on the same origin. Heart buttons keep keyboard focus after updates.
- Shared navigation works on the homepage, all guides, informational pages, and the 404 page. Escape closes the mobile menu and returns focus; labels track open/closed state.
- Mobile controls have larger touch targets, the search field avoids iOS focus zoom, and small screens use a single card column. Original colors, illustrations, editorial content, and brand styling remain.
- Amazon buttons still open ordinary, untagged retail searches. PickPop's planning budget is not sent to Amazon.

Manual checks: search for `coffee mug`, try budgets of $5/$25/$100, combine Pets with `cat`, switch sorting, save/remove a heart, reload, use the Saved view, and follow each guide back to the finder. Check mobile menu open/close and keyboard navigation.

An optional browser regression check is in `tests/smoke.cjs`. With the local preview running, Node.js, Playwright, and Chrome available:

```bash
npm install --no-save --package-lock=false playwright
node tests/smoke.cjs
```

The default test browser is installed Chrome. Set `PICKPOP_BROWSER=msedge` to use installed Edge, or `PICKPOP_TEST_URL` for another local port. These are development-only dependencies; visitors and the static site require no npm setup. The check covers search, budgets, sorting, favorites/storage, empty states, keyboard focus, article links, menus, 404 handling, and seven pages at 320, 375, 390, 768, 1024, and 1440 pixels. It saves screenshots and results to `tests/artifacts/`. Browser emulation does not replace testing on physical phones.

## Publish on Netlify for free

Publishing is a separate, future step and requires the project owner's authorization. Nothing in the local preview or tests publishes the site.

1. Create/log into a Netlify account.
2. In Netlify, choose to deploy a site manually (drag-and-drop deployment).
3. Drag the **entire `pickpop-site` folder** (or upload the unzipped folder) to the deploy area.
4. Netlify issues a `*.netlify.app` address; you can later attach a custom domain. Hosting is subject to your provider's current plan limits and policies.
5. Check the pages, mobile layout, policy text, and external links before sharing publicly.

No npm, build step, database, or payment method is needed for the code itself. The project is compatible with any ordinary static-file host serving paths rooted at `/`.

## What really works now

- Free-text keyword search over **20 hand-authored example product ideas**.
- Budget slider, quick budget pills, category filters, price sort.
- Saved ideas using browser local storage, accessible button states.
- Mobile-friendly layout, working navigation, three original articles, privacy/about pages.
- Amazon search links that go to Amazon retail search **without any referral tag**.

## What is intentionally not live

**This is not a live Amazon product search engine.** The data is manually curated *illustrative ideas*, not verified specific Amazon products. All indicated dollar amounts are example *planning budgets*, not actual current Amazon prices. Do not market those amounts as verified Amazon prices. The current links go to ordinary retail searches and **do not generate commissions**. No affiliate status is claimed.

Before real affiliate monetization:

1. Prepare original content that meets Amazon Associates review requirements.
2. Apply to the Amazon.com Associates program using the actual public site.
3. Once permitted, generate compliant **specific tracking links** via Amazon's tools and replace generic search URLs where appropriate.
4. Add disclosures per local applicable requirements and Amazon's Program policies. The Amazon-required statement is: `As an Amazon Associate I earn from qualifying purchases.` **Only use after becoming an Amazon Associate.**
5. For live images, pricing, availability and automatic catalog integration, use only officially authorized Amazon content/tools and comply with their license, caching and display restrictions. Never scrape Amazon product pages.
6. Review the business name, privacy page, contact details, legal requirements, analytics/cookie practices, site URL and terms before launch.

## Customize

- Brand, colors, layout and responsiveness: `assets/css/styles.css` and `index.html`.
- Shared menu behavior: `assets/js/navigation.js`.
- Example catalog, budget, product-search links and filters: `assets/js/app.js` near `const products = [...]`.
- Articles: `guides/*.html`.
- Terms, disclosures and privacy: `about.html`, `privacy.html`.
- Favicon: `assets/favicon.svg`.
- Hosting configuration: `netlify.toml`.

For later iterations, replace the prototype product cards with vetted content and integrate an official API when eligible, while retaining the usable finder, content pages and styling.
