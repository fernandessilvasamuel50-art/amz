# PickPop 4.0 — Catalog expansion

## Current progress — 2026-10-12

- Baseline: seven verified products, seven licensed independent photographs, seven Amazon links using `pickpop03-20`.
- Existing products: CHEMEX six-cup CM-6A, Logitech M185 Swift Grey, Logitech K120 US, Logitech C920, Lodge L10SK3 12-inch skillet, KONG Classic Medium red, OXO large basting brush 1071061.
- Rollback: local Git tag `pickpop-before-catalog-4-20261010`, baseline commit `29bf7cc`. Not yet pushed.
- Eight products in the local catalog after importing one complete record. Publication verification pending. No Pinterest platform changes in this expansion; separate read-only monitoring records remain unstaged.

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
- Commit/deploy: final source ready; publication verification pending.
- Next executable action: commit the approved one-product increment/importer, push and verify Netlify public catalog and detail page. Then resume the remaining four researched candidates only when manufacturer library browser access is actually released, or find another independently permitted manufacturer's assets. Goal 20 needs 12 more products after this increment; goal 50 needs 42. No pending candidate is counted as a real published product.
- Target 20 is not yet reached. To reach 50, continue small batches with separate verified identity and image-permission evidence; prioritize storage, drinkware and coffee accessories over near-identical appliance variants.
