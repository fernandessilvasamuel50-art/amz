"""Publication guard tests using an existing researched record as a local fixture."""
import copy
import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from tools.import_catalog import plan
from catalog_validation import item_errors, validate_catalog
from tools import import_catalog


class ImportChecks(unittest.TestCase):
    def setUp(self):
        self.catalog = json.loads((ROOT / 'data/catalog.json').read_text(encoding='utf-8'))
        self.permissions = json.loads((ROOT / 'data/image-permissions.json').read_text(encoding='utf-8'))
        self.item = copy.deepcopy(self.catalog['items'][0])
        self.item['verification']['identityEvidence'] = {
            'amazonTitle': self.item['retailerName'], 'manufacturerModel': self.item['model'],
            'variantMatch': 'Existing fixture variant reviewed.', 'photoMatch': 'Existing fixture photo reviewed.'}
        self.empty = {'schemaVersion': 1, 'items': []}

    def test_accept_complete_record_and_preserve_input(self):
        before = copy.deepcopy(self.catalog)
        accepted, rejected = plan(self.empty, {'schemaVersion': 1, 'items': [self.item]}, ROOT, 'pickpop03-20', {})
        self.assertEqual(accepted, [self.item]); self.assertFalse(rejected)
        self.assertEqual(before, self.catalog)

    def test_existing_asin_rejected_despite_new_id(self):
        self.item['id'] = 'fixture-other-id'
        accepted, rejected = plan(self.catalog, {'schemaVersion': 1, 'items': [self.item]}, ROOT, 'pickpop03-20', self.permissions)
        self.assertFalse(accepted); self.assertIn('Duplicate ASIN', str(rejected))

    def test_both_batch_duplicates_rejected(self):
        other = copy.deepcopy(self.item); other['id'] = 'fixture-other-id'
        accepted, rejected = plan(self.empty, {'schemaVersion': 1, 'items': [self.item, other]}, ROOT, 'pickpop03-20', {})
        self.assertFalse(accepted); self.assertEqual(len(rejected), 2)

    def test_invalid_inputs_rejected_individually(self):
        mutations = [
            ('affiliateUrl', self.item['productUrl'] + '?tag=pickpop-20'),
            ('productUrl', 'https://www.amazon.com.evil.example/dp/' + self.item['asin']),
            ('asin', []), ('features', []), ('verification', 'invalid'), ('image', 'invalid'),
            ('price', {'amount': 5}), ('model', ''),
        ]
        for field, value in mutations:
            with self.subTest(field=field):
                changed = copy.deepcopy(self.item); changed[field] = value
                accepted, rejected = plan(self.empty, {'schemaVersion': 1, 'items': [changed]}, ROOT, 'pickpop03-20', {})
                self.assertFalse(accepted); self.assertEqual(len(rejected), 1)

    def test_missing_evidence_and_unlicensed_images_rejected(self):
        for field, value in [('src', '/assets/products/../../data/catalog.json'), ('licenseUrl', 'https://creativecommons.org/licenses/by-nc/4.0'), ('authorized', False), ('variantReviewed', False)]:
            changed = copy.deepcopy(self.item); changed['image'][field] = value
            self.assertTrue(item_errors(changed, ROOT, 'pickpop03-20', {}, True))
        self.item['verification'].pop('identityEvidence')
        self.assertTrue(item_errors(self.item, ROOT, 'pickpop03-20', {}, True))

    def test_unknown_manufacturer_permission_rejected(self):
        self.item['image']['permissionId'] = 'unreviewed'
        self.assertTrue(item_errors(self.item, ROOT, 'pickpop03-20', {}, True))

    def test_manufacturer_permission_requires_exact_hash(self):
        product = copy.deepcopy(self.item); product['image']['permissionId'] = 'test-only'
        image = product['image']
        grant = {'status': 'reviewed', 'scope': 'editorial-coverage', 'reviewedAt': product['verification']['reviewedAt'], 'source': image['licenseUrl'], 'attribution': image['author'], 'assets': {image['src']: {'source': image['source'], 'variantEvidence': 'TEST ONLY', 'sha256': hashlib.sha256((ROOT / image['src'].lstrip('/')).read_bytes()).hexdigest()}}}
        permissions = {'permissions': {'test-only': grant}}
        self.assertTrue(item_errors(product, ROOT, 'pickpop03-20', permissions, True), 'Editorial-only permission must not authorize monetized publication')
        grant.update(affiliateUseAuthorized=True, affiliateUseEvidence='SYNTHETIC TEST ONLY: explicit permission for monetized use')
        self.assertFalse(item_errors(product, ROOT, 'pickpop03-20', permissions, True))
        grant['assets'][image['src']]['sha256'] = '0' * 64
        self.assertTrue(item_errors(product, ROOT, 'pickpop03-20', permissions, True))

    def test_cli_dry_run_apply_backup_and_repeat(self):
        artifacts = ROOT / 'tests/artifacts'; artifacts.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=artifacts) as temporary:
            work = Path(temporary); site = work / 'site'; (site / 'data').mkdir(parents=True)
            photo = site / self.item['image']['src'].lstrip('/'); photo.parent.mkdir(parents=True)
            photo.write_bytes((ROOT / self.item['image']['src'].lstrip('/')).read_bytes())
            catalog_file = site / 'data/catalog.json'
            original = json.dumps(self.empty).encode(); catalog_file.write_bytes(original)
            (site / 'data/site.json').write_text(json.dumps({'affiliate': {'associateTag': 'pickpop03-20'}}))
            batch = work / 'batch.json'; batch.write_text(json.dumps({'schemaVersion': 1, 'items': [self.item]}))
            report = work / 'report.json'
            with patch.object(import_catalog, 'ROOT', site), patch.object(sys, 'argv', ['import', str(batch), '--report', str(report)]):
                self.assertEqual(import_catalog.main(), 0)
                self.assertEqual(catalog_file.read_bytes(), original)
            args = ['import', str(batch), '--apply', '--report', str(report)]
            with patch.object(import_catalog, 'ROOT', site), patch.object(sys, 'argv', args):
                self.assertEqual(import_catalog.main(), 0)
                after = catalog_file.read_bytes()
                self.assertEqual(json.loads(after)['items'], [self.item])
                self.assertEqual(import_catalog.main(), 2)
                self.assertEqual(catalog_file.read_bytes(), after)
            backups = list((work / 'operations/private/catalog-backups').glob('*.json'))
            self.assertEqual(len(backups), 1); self.assertEqual(backups[0].read_bytes(), original)

    def test_build_rejects_duplicate_asin(self):
        duplicate = copy.deepcopy(self.catalog['items'][0]); duplicate['id'] = 'fixture-other-id'
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            validate_catalog({**self.catalog, 'items': self.catalog['items'] + [duplicate]}, ROOT, 'pickpop03-20', self.permissions)


if __name__ == '__main__':
    unittest.main()
