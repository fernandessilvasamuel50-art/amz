# PickPop 4.0 — Catalog expansion

## Current progress — 2026-10-12

- Baseline: seven verified products, seven licensed independent photographs, seven Amazon links using `pickpop03-20`.
- Existing products: CHEMEX six-cup CM-6A, Logitech M185 Swift Grey, Logitech K120 US, Logitech C920, Lodge L10SK3 12-inch skillet, KONG Classic Medium red, OXO large basting brush 1071061.
- Rollback: local Git tag `pickpop-before-catalog-4-20261010`, baseline commit `29bf7cc`. Not yet pushed.
- **Eight products published and verified on the official domain** after importing one complete record (7 existing + 1 new). Eight documented photographs, including one new manufacturer-permitted photograph; eight technically validated affiliate links with `pickpop03-20`. No Pinterest platform changes in this expansion; separate read-only monitoring records remain unstaged.

## Batch 01 research

- **Accepted/imported:** RIO Mini 4QT Black: manufacturer SKU 140-8006-01, Amazon B0F9B923NC title and Part Number 140-8006-01B match. The generic Amazon Model Number field also lists an inconsistent AU code; it is not used for US electrical specifications. This discrepancy is recorded in identity evidence. Manufacturer Black 4QT folder and complete photograph inspected; official file 2063031522432 downloaded. Image proportionally resized without crop or appearance changes, 960×960 WebP, 151,328 bytes; source and original/optimized SHA-256 recorded in `data/image-permissions.json`. Linked to the existing small-apartment kitchen essentials guide and automatically included in the small-kitchen collection/finder/quiz.
- MagicFroth 9-in-1 Stainless Steel: manufacturer SKU 140-3457-01, Amazon B0C63SQ8GH title matches 17 oz stainless steel model. Photo selection pending.
- **Pending photo, not imported:** Vortex Mini 4QT Black: official SKU 140-3221-01; Amazon B0F9B4YCZF title identifies the black 4-quart version. Source: https://instantpot.com/products/instant-pot-4qt-vortex-mini-air-fryer-black and https://www.amazon.com/dp/B0F9B4YCZF .
- **Pending photo, not imported:** InstantHeat Mini 4-Slice: official SKU 140-4030-01; Amazon B0F9BCY4CD title identifies the 4-slice appliance. Sources: https://instantpot.com/products/instant-pot-4-slice-instantheat-mini-air-fryer-toaster-oven and https://www.amazon.com/dp/B0F9BCY4CD .
- **Pending identity and photo:** 12-Cup Grain and Rice Multi-Cooker 140-2012-02. Candidate B0B2WKRGYK is not verified for the US model; do not assume it matches (other references describe a UK rice cooker/steamer). Consider another distinct product if verification remains unavailable.
- Permission source: https://instantpot.com/pages/media-press allows approved multimedia-library assets for attributed editorial coverage and prohibits alteration/distortion. This is limited manufacturer permission, not a Creative Commons or unrestricted advertising license. Only specific library assets reviewed and bound to file hashes may be accepted. No use in Pinterest assets.
- Official multimedia library: https://instantbrands.app.box.com/s/0c8m0pf484gz3ujd19xeysztqu55ih86 . Public access verified in browser; no login or new credentials used.
- Rejected image paths: OXO website photos (prior written permission required); vintage Pyrex cup (not exact current variant); Peet's branded Bodum mug (variant/branding mismatch); Duni library (noncommercial restriction). None imported.
- Dreamfarm website photos also require prior written permission: https://dreamfarm.com/help/privacy-policy/ . No asset downloaded/imported. These are rejected image-source paths, not five fabricated product records.
- On 12/10 the second Box download timed out. Browser then explicitly reported that the owner had denied access to `instantbrands.app.box.com`. Owner replied that they would release access, but a subsequent check still reported a saved deny setting. No alternate host, raw download or indirect workaround attempted. Existing RIO download is preserved; all other Box assets remain pending. The owner must allow this domain in browser permissions before more library work can resume.

## Importer

Implemented and tested: `pickpop-site/tools/import_catalog.py` uses local JSON only, defaults to dry-run, preserves existing records, rejects duplicate IDs/ASINs, incorrect tags/destinations, incomplete factual lists/evidence, missing or unapproved photos and incorrect WebP dimensions. Accepted manufacturer assets must match a reviewed permission manifest and SHA-256. Backups are private; reports must live outside public site data. A changed catalog aborts the atomic write. Report paths cannot overwrite the input batch. Repeating an import rejects duplicates rather than replacing existing records. Build uses shared guards and browser validation also rejects duplicate ASINs.

Example from repository root:

```text
python pickpop-site/tools/import_catalog.py docs/catalog-batches/batch-01.json --report docs/catalog-batches/batch-01-report.json
python pickpop-site/tools/import_catalog.py docs/catalog-batches/batch-01.json --apply --report docs/catalog-batches/batch-01-report.json
```

The importer does not prove factual accuracy, legal permission or commission attribution from URL syntax; the editorial research and exact photo evidence are mandatory inputs. Future Creators API remains disabled.

## Tests, publication and next action

- Importer: 9 tests passed, including dry-run/apply, backup, unchanged inputs, repeat import, duplicate ASINs, bad URLs/tags, missing evidence and exact manufacturer hash. Dry-run accepted 1/rejected 0; apply appended 1 to 7 (total 8). Original seven objects confirmed unchanged against private backup.
- Node unit tests: 14 passed, including combined search/budget, duplicate ASINs, providers, affiliate destinations and opt-in metrics guards.
- Production build: 31 pages / 28 sitemap URLs. Static validation passed 1,004 local references, unique metadata/canonicals, factual schema and clean artifact.
- Browser MVP: passed 93 layouts (360/768/1440), search/filter/budget/sort, favorite persistence/privacy/storage failures, comparison cap, quiz, keyboard, navigation, loaded photographs, errors/retry and absence of external service requests.
- Growth browser tests: five guides and all eight direct CTAs passed; Amazon navigation intercepted locally so no commercial test clicks were sent.
- Quality: 38 WCAG A/AA automated audits passed, no critical console/CSP errors. Automated checks do not certify WCAG compliance or replace physical devices.
- Focused new-product test: passed search, honest budget, favorite persistence/removal, comparison, matching kitchen/Modern/small-spaces quiz, direct tagged CTA/credits and three additional WCAG audits (360/768/1440). No external requests. Initial run used a nonexistent Space-saving quiz style; test corrected to the offered Modern style. No quiz implementation change. Desktop and mobile captures inspected: exact complete photograph, legible heading, visible affiliate disclosure/CTA and no clipping. Evidence: `pickpop-site/tests/artifacts/expansion.json` and `expansion-detail-360.png`, `expansion-detail-768.png`, `expansion-detail-1440.png` (private/ignored).
- First browser attempts were blocked by sandbox networking; an isolated preview server was unreachable by the test browser. Tests were rerun against the authorized localhost preview, which responded HTTP 200. Only the successful runs above are counted.
- Common private-key/cloud/GitHub token patterns were scanned in publishable sources and this batch: no matches. This is a focused check, not a security certification.
- **Source commit:** `6b5c910` on `main`, pushed to the existing repository. Rollback tag `pickpop-before-catalog-4-20261010` also pushed, pointing to `29bf7cc`. No force push, DNS change, paid service or new credentials.
- **Production:** Git/Netlify update confirmed on https://pickpop.netlify.app/ at 2026-10-12 21:29:40 UTC (17:29:40 Manaus). Public catalog matches the local eight-record catalog exactly; image bytes/SHA-256 match the licensed local file. Home, finder, new detail, related guide, collection, credits, robots and sitemap all returned HTTP 200 with expected metadata/content. Evidence: `operations/private/catalog-deploy-20261012.json`, outside Git. No deploy ID/dashboard state is claimed; verification is against the public content.
- **Public browser checks:** focused expansion test also passed against the official domain: keyword search, honest budget, favorite persistence/removal, comparison, quiz, real photo/credit, tagged CTA and three responsive accessibility audits. No Amazon or other external requests sent. These are QA visits and must not be counted as commercial acquisition; no commissions/attribution have been confirmed.
- **Batch report:** accepted 1, rejected 0 incomplete import records, catalog total 8. Four research candidates remain unpublished. The rejected image-source paths above are recorded separately; no artificial products were entered merely to pad rejection counts or the catalog.
- **Next executable action:** resume the remaining four researched candidates only when manufacturer library browser access is actually released, or find another independently permitted manufacturer's assets. MagicFroth official folder: `/folder/351944106856`; candidate file `/file/2051137840497` was identified but not visually inspected/downloaded, so do not mark it approved. Complete a further 5–7 item batch with exact photos/variants and then dry-run/apply, build and tests. Goal 20 needs 12 more products after this increment; goal 50 needs 42. No pending candidate is counted as a real published product.
- Target 20 is not yet reached. To reach 50, continue small batches with separate verified identity and image-permission evidence; prioritize storage, drinkware and coffee accessories over near-identical appliance variants.

## Rights clarification and next batch — 2026-10-12

Current status supersedes the historical eight-product release above: **7 active products; RIO Mini held pending explicit affiliate-image permission**. Its source record and complete photograph are preserved privately in `operations/private/catalog-hold`; batch-01 remains the historical input. A return point is preserved at `pickpop-before-rights-review-20261012` (`3994a7d`).

The Instant Pot media page permits editorial coverage with attribution, but does not expressly confirm use on remunerated product recommendations. General Terms of Use also grant only a limited noncommercial site-content license. The earlier interpretation was too broad. Do not infer affiliate rights from editorial permission, public download access or an image credit. Registry status is now pending; build/import guards require explicit `affiliateUseAuthorized` and documented evidence for manufacturer permission.

The owner confirmed there is no written permission and authorized emailing the official `media@instantpot.com` contact. The request is prepared in `docs/IMAGE-PERMISSION-REQUEST.md`; Gmail returned USER_NOT_LOGGED_IN, so it has NOT been sent. Connect the owner's Gmail to execute the already authorized request. No password is needed in chat. No approval/response is claimed.

Four prior candidates: MagicFroth, Vortex Mini and InstantHeat Mini have researched identities but no eligible affiliate-photo permission; hold rather than retry the blocked Box library. The rice cooker also lacks exact US ASIN identity. None is imported. Search is moving to other manufacturers and independent photographs whose licenses explicitly allow commercial reuse.

Other manufacturer libraries reviewed: IKEA US media resources (noncommercial scope); McCormick brand assets (commercial use excluded); Duni (editorial/noncommercial only); Herman Miller image FAQ (written permission required); Fadior (commercial/product listing requires written approval). These do not provide an immediately usable affiliate grant. Do not copy their photos.

Research candidates with independent commercial licenses: the Microplane photograph is NOT the Classic hard-handle zester. Visual inspection shows an older Professional-series steel-handle paddle; exact coarse/fine variant is not confirmed. Zyliss rotary grater photographed in December 2025 has a CC BY 4.0 license, but it depicts Original/Restaurant construction rather than the currently researched Classic. Neither is accepted. No additions counted yet.

Suspension checks: 9 importer tests, 14 Node unit tests, production build (30 pages, 27 sitemap URLs), 968 local references and browser MVP (90 layouts) passed; growth checks passed for five guides and all seven direct retailer buttons. The quality suite passed 38 automated accessibility audits without critical console/CSP errors. No new Lighthouse run or physical-device testing is claimed.

### Additional candidates: decisions and sources

Reviewed on 2026-10-12. These are research candidates, NOT published records, approved images or importer additions. The importer was not fed incomplete records to manufacture an acceptance/rejection count.

| Candidate | Evidence | Decision / next missing evidence |
| --- | --- | --- |
| Microplane Professional coarse 38000, candidate B00009WE3Y | Manufacturer product page and Amazon identify coarse 38000. [Own photograph by Denkhenk](https://commons.wikimedia.org/wiki/File:Microplane.jpg), CC BY-SA 3.0, downloaded privately and visually inspected. | Photo looks like older Professional construction; exact coarse blade match remains unresolved. It does NOT match Classic 40020 or the redesigned Professional 2.0. Browser denied access to microplaneintl.com during visual cross-check; no bypass attempted. Hold. |
| Zyliss Classic, candidate B000FDZJG2 | [Manufacturer Classic E900010U](https://us.zyliss.com/products/zyliss-classic-cheese-grater), [manufacturer customer service](https://us.zyliss.com/pages/customer-service), [own photo by Nielsoncaetanosalmeron](https://commons.wikimedia.org/wiki/File:Zyliss_cheese_grater_at_Olive_Garden.jpg), CC BY 4.0. | Photo shows Original/Restaurant construction, not the researched Classic with different handle. Reject this photo/ASIN pairing; exact photographed model's ASIN still needed. |
| HARIO Buono silver 1.2L VKB-120HSV, B000IGOXLS | [Hario USA](https://www.hario-usa.com/products/v60-buono-drip-kettle) and [Amazon title/model/ASIN](https://www.amazon.com/dp/B000IGOXLS) match the 1.2L SKU. [Own photo by Fumikas Sagisavas](https://commons.wikimedia.org/wiki/File:Hario_Buono_V60_drip_kettle.jpg) is CC0; downloaded and visually inspected. | Photo shows silver Buono, but neither description nor visible labeling proves capacity; similar 1.0L/1.2L variants cannot be distinguished reliably. Hold rather than claim exact match. |
| Denby Azure mug | Commons own photos by Kolforn, CC BY-SA 4.0; generic old mug and backstamp. [Manufacturer small curve mug 123010611](https://www.denbypottery.com/en-us/product/Azure-Small-Curve-Mug-123010611) is discontinued. | Exact photograph/model/US ASIN not established; do not substitute Azure Haze or a different size. Hold. |

Additional permission sources reviewed: [IKEA US](https://www.ikea.com/us/en/newsroom/media-resources/), [McCormick](https://www.mccormickcorporation.com/news-center/brand-assets), [Duni](https://www.dunigroup.com/media/media-library/), [Herman Miller](https://www.hermanmiller.com/resources/images/support-pages/faq/) and [Fadior](https://www.fadiorhome.com/journal/fadior-press-kit). Their published restrictions do not provide a confirmed grant for this affiliate use. No photographs from these libraries were imported. No new external account, paid service or credentials were created.

### Published correction and continuation

- **Correction commit:** `1227a65`, pushed to main; public production catalog verified to equal the seven-item local catalog. RIO page and photograph both return HTTP 404. Evidence is private: `operations/private/catalog-rights-suspension-20261012.json`. Rollback tag `pickpop-before-rights-review-20261012` was pushed. Do not restore RIO publicly before adequate permission.
- Focused expansion regression passed against the local production preview: seven-item finder, held detail/photo HTTP 404, no JavaScript errors or external requests. Its first run exposed a preview-server directory listing at the empty old route; `serve.py` now returns the site's 404 instead. Test rerun passed. Public Netlify already returned 404 correctly.
- **This continuation added zero products and zero photographs.** One previous recommendation was suspended; seven active products, seven documented licensed photographs and seven technically validated `pickpop03-20` links remain. Commission attribution is not asserted.
- Gmail is installed but disconnected (`USER_NOT_LOGGED_IN`). The owner has authorized the Instant Pot request, but it remains **NOT sent**. The owner was asked to connect the existing Gmail plugin; do not ask for passwords or presume a response. Prepared request: `docs/IMAGE-PERMISSION-REQUEST.md`.
- **Next executable action:** after Gmail connection, check Sent for the matching request to avoid duplicates, then send the already authorized request to `media@instantpot.com` and record the actual result privately. Resume the Instant Pot images only after explicit affiliate-use permission and legitimate library access. Independently, resolve the exact licensed Microplane or Hario photograph variant, or select another candidate with both documented commercial image rights and exact US ASIN evidence. Use the existing importer only after all evidence is complete.
- Immediate goal 12 needs **five** more active products; goal 20 needs **13**, or 12 after RIO is legitimately reinstated. Goal 50 needs 43. No Pinterest changes, new articles or site redesign were made.
