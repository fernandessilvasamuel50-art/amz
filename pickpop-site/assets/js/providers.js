import { matchCatalog, validateCatalog } from './catalog.js';

// All current discovery uses this local, source-reviewed catalog. No external API call.
export class CuratedCatalogProvider {
  constructor(data, config) { this.items = validateCatalog(data); this.config = config; }
  search(filters) { return matchCatalog(this.items, filters, this.config); }
}

// Deliberately disabled. A future approved server implementation must normalize its
// response into the same catalog contract and enforce Amazon's data-use rules.
// This boundary accepts a synthetic transport in tests, never frontend credentials.
export class AmazonCreatorsApiProvider {
  constructor({ authorized = false, transport = null } = {}) {
    this.authorized = authorized;
    this.transport = transport;
  }
  async search(filters) {
    if (!this.authorized || !this.transport) return { status: 'disabled', items: [], message: 'Authorized Amazon data is not connected.' };
    try {
      const response = await this.transport({ operation: 'SearchItems', filters });
      return { status: 'ready', items: validateCatalog(response) };
    } catch {
      return { status: 'error', items: [], message: 'Amazon discovery is unavailable. Try the curated catalog.' };
    }
  }
}
