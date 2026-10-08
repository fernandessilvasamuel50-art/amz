# PickPop 2.0: audit and implementation plan

## Baseline

Reviewed the existing repository, README, homepage, styles, application/navigation scripts, all three guides, institutional/404 pages, preview launchers/server, hosting configuration, favicon, robots and browser checks before changing application files. The original ZIP remains unchanged. No AGENTS.md was found in the workspace or its inspected parent directories.

The public homepage returned HTTP 200. Its title and application assets match the reviewed prototype: `app.js`, `navigation.js`, and `styles.css` were equal to the local versions. HTML bytes differ; asset equality is not proof that hosting adds no transformations. The public site was read only.

The repository has a static, dependency-free runtime. Python is used only for local preview; Playwright is an optional development dependency. The site has 20 explicitly illustrative product concepts, four categories, combined keyword/budget filters, sorting, browser favorites, three editorial guides, and an original CSS illustration/palette.

## Findings and priority

1. Catalog records and DOM rendering share one compressed script, making provenance, future verification and customization difficult. Separate and validate catalog records before adding features.
2. Illustrated budget figures are not retailer prices. Preserve the existing demo filter with prominent labels; verified entries without authorized fresh price data must remain discoverable without an invented affordability claim.
3. No quiz, preference filters, Gifts collection, comparisons, or static detail pages exist.
4. Metadata is incomplete: no canonical URLs, sitemap, consistent OG images, or editorial directory. Do not index query-filter pages or demo detail pages as product offers.
5. Saved ideas have defensive storage handling but no explicit persistence preference. Add an opt-out that also removes previously saved local data.
6. Repeated header/footer markup can drift. Use shared static fragments at generation time while retaining existing article bodies and homepage illustrations.
7. Google Fonts is an existing external request. Preserve typography, disclose it, and use preconnect/font display swap. No analytics/paid AI/API requests should be activated.
8. No secret was found in reviewed application/configuration files. Current rendering uses DOM text rather than injecting search text. Future URLs, catalog fields, local IDs and static generation still need validation. Existing hosting headers are useful but no CSP is present.
9. The contact channel, accepted Associate status, official links, authorized imagery and API credentials have not been supplied. Preserve these as explicit configuration gaps. Do not invent product records to resolve them.

## Architecture decision

Keep static HTML/CSS with native ES modules and one centrally validated JSON catalog. Add a small standard-library Python generator for shared page fragments, SEO, concept details and a clean `dist/` artifact. Python is a development/build dependency, not a server required by visitors. Existing guides and homepage continue from their current source. Generated public files are retained for local preview; Netlify can generate `dist` on an authorized deployment.

No Next.js/React migration, database, accounts, backend service or paid infrastructure is justified for this MVP. Static editorial pages stay crawlable without JavaScript. Interactive search/quiz use the same pure deterministic matcher. A future authorized API must use a server-side adapter and secret environment variables; it is disabled now.

## Ordered phases

1. Foundation: catalog/config validation, pure matching and safe destinations, storage module, build/preview path and regression checks.
2. Experience: preserve hero/art/palette; improve finder, touch controls, categories, explainable cards and quiz styling.
3. Discovery: exact numeric budget, combined preferences/Gifts, favorites and persistence control, four-step quiz, comparisons and usable loading/retry/empty states.
4. Editorial/SEO: existing guides plus one focused coffee-maker guide, editorial/collection indexes, static detail pages, institutional pages, canonical/OG/sitemap/robots and factual WebSite/Article/Breadcrumb metadata. No review or offer schemas.
5. Commercial preparation: official supplied links only, disabled Associate/API mode, visible disclosure gates, configurable real contact, no-network analytics event boundary.
6. Candidate review: production build, matcher/business-rule tests, browser/keyboard/error tests, static links/metadata validation, screenshots at 360/768/1440 and accessibility/performance checks available locally. Report limitations and launch dependencies honestly.

## Production boundary

All work is local on branch `pickpop-2-mvp`. Do not push or merge into `main`, run Netlify deploy commands, or enable tracking/paid services without explicit approval. The existing GitHub-to-Netlify connection could deploy a push to the production branch.

## Official sources consulted

- https://affiliate-program.amazon.com/help/operating/agreement — disclosure, approved Special Links, relationship representations.
- https://affiliate-program.amazon.com/help/operating/policies — permitted Product Advertising Content and image/price handling.
- https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding/register-for-creators-api — current API access prerequisites.

These sources guide disabled capabilities; they do not establish this account's approval or certify the entire site as compliant. Recheck the current policies before activating real data/links. No Amazon images, product ratings, inventory or prices were obtained.
