export const CATEGORIES = ['kitchen', 'home', 'organization', 'tech', 'pets', 'gifts'];
export const PREFERENCES = ['minimalist', 'modern', 'cozy', 'budget-friendly', 'space-saving', 'gift-ideas'];
export const PRIORITIES = ['saving-money', 'small-spaces', 'everyday-convenience', 'aesthetic-design', 'gift-giving'];
export const LABELS = {
  minimalist: 'Minimalist', modern: 'Modern', cozy: 'Cozy', 'budget-friendly': 'Budget-friendly',
  'space-saving': 'Space-saving', 'gift-ideas': 'Gift ideas', 'saving-money': 'Saving money',
  'small-spaces': 'Small spaces', 'everyday-convenience': 'Everyday convenience',
  'aesthetic-design': 'Aesthetic design', 'gift-giving': 'Gift giving'
};
export function normalize(value) {
  return String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
export function parseBudget(value, fallback = 50) {
  if (value === null || String(value).trim() === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) && number >= 1 && number <= 10000 && Math.abs(number * 100 - Math.round(number * 100)) < 0.00001 ? number : fallback;
}
export const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: Number.isInteger(value) ? 0 : 2 }).format(value);

export function validateCatalog(data) {
  if (data?.schemaVersion !== 1 || !Array.isArray(data.items)) throw new Error('Unsupported catalog');
  const ids = new Set();
  for (const item of data.items) {
    if (!/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id)) throw new Error('Invalid or duplicate catalog ID');
    ids.add(item.id);
    if (!CATEGORIES.includes(item.category) || !['demo', 'verified'].includes(item.verification?.status)) throw new Error('Invalid category or verification');
    for (const field of ['name', 'description', 'emoji', 'chip', 'tags', 'search']) {
      if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error('Missing catalog text');
    }
    if (!/^#[0-9a-f]{6}$/i.test(item.color) || !Array.isArray(item.styles) || !item.styles.every(style => PREFERENCES.includes(style))) throw new Error('Invalid catalog styling');
    if (!Array.isArray(item.priorities) || !item.priorities.every(priority => PRIORITIES.includes(priority))) throw new Error('Invalid catalog priorities');
    if (!Array.isArray(item.considerations) || !item.considerations.every(text => typeof text === 'string')) throw new Error('Invalid editorial considerations');
    if (!Array.isArray(item.benefits) || !Array.isArray(item.features)) throw new Error('Invalid editorial facts');
    if (item.verification.status === 'demo' && (item.price || item.asin || item.productUrl || item.affiliateUrl || item.benefits.length || item.features.length)) throw new Error('Demo records cannot claim real product facts');
    if (item.planningBudget !== null && parseBudget(item.planningBudget, null) === null) throw new Error('Invalid planning budget');
    if (item.verification.status === 'verified' && (!item.verification.sources?.length || !item.verification.reviewedAt)) throw new Error('Verified records need sources and review date');
    if (item.verification.status === 'verified' && (!item.brand || !/^[A-Z0-9]{10}$/.test(item.asin) || item.productUrl !== 'https://www.amazon.com/dp/' + item.asin || item.image?.type !== 'photo' || !item.image.authorized || !item.image.variantReviewed || !/^\/assets\/products\/[a-z0-9-]+\.webp$/.test(item.image.src) || !item.image.author || !item.image.licenseUrl)) throw new Error('Real products require verified identities and licensed variant-reviewed photos');
  }
  return data.items;
}

async function fetchJSON(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Catalog request failed');
  return response.json();
}
export async function loadCatalog() {
  const [data, config] = await Promise.all([fetchJSON('/data/catalog.json'), fetchJSON('/data/site.json')]);
  if (config?.locale !== 'en-US' || !config.affiliate || !config.amazonContent) throw new Error('Invalid site configuration');
  return { items: validateCatalog(data), config };
}

export function authorizedPrice(item, config, now = Date.now()) {
  const price = item.price;
  if (!config?.amazonContent?.enabled || item.verification.status !== 'verified' || !price?.authorized || price.source !== 'creators-api' || price.currency !== 'USD') return null;
  const fetched = Date.parse(price.fetchedAt), expiry = Date.parse(price.expiresAt);
  if (!Number.isFinite(price.amount) || price.amount < 0 || !Number.isFinite(fetched) || !Number.isFinite(expiry) || fetched > now || now >= expiry || expiry - fetched > 3600000) return null;
  return price.amount;
}

export function matchCatalog(items, filters, config) {
  const words = normalize(filters.query || '').split(/\s+/).filter(Boolean);
  const preferences = filters.preferences || [];
  const matches = [];
  for (const item of items) {
    const gifts = item.styles.includes('gift-ideas');
    if (filters.category && filters.category !== 'all' && (filters.category === 'gifts' ? !gifts : item.category !== filters.category)) continue;
    if (filters.savedOnly && !filters.saved?.includes(item.id)) continue;
    if (!preferences.every(preference => item.styles.includes(preference))) continue;
    if (filters.priority && !item.priorities.includes(filters.priority)) continue;
    const haystack = normalize([item.name, item.brand || '', item.model || '', item.tags, item.search, item.category, item.description, ...(item.features || []), ...item.styles].join(' '));
    if (!words.every(word => haystack.includes(word))) continue;
    const price = authorizedPrice(item, config);
    // Demo targets preserve the prototype's idea filter; they are never actual prices.
    const reference = price ?? (item.verification.status === 'demo' ? item.planningBudget : null);
    if (reference !== null && reference > filters.budget) continue;
    const reasons = [];
    if (filters.category !== 'all') reasons.push(filters.category === 'gifts' ? 'An editorial gift idea' : `A ${item.category} idea for your shortlist`);
    if (words.length) reasons.push('Matches your search words');
    preferences.forEach(preference => reasons.push(`Tagged ${LABELS[preference].toLowerCase()} in our editorial catalog`));
    if (filters.priority) reasons.push(`Selected for your ${LABELS[filters.priority].toLowerCase()} priority`);
    if (price !== null) reasons.push('Authorized price data is within your budget preference');
    else if (reference !== null) reasons.push('Its illustrative planning target fits your budget preference');
    else reasons.push('Price is unverified; check your budget with the retailer');
    const exact = normalize(item.name).includes(normalize(filters.query || '')) && words.length ? 2 : 0;
    matches.push({ item, reasons, reference, score: exact + preferences.length + (filters.priority ? 1 : 0) });
  }
  const direction = filters.sort === 'asc' ? 1 : -1;
  matches.sort((a, b) => {
    if (filters.sort === 'name') return a.item.name.localeCompare(b.item.name, 'en-US');
    if (['asc', 'desc'].includes(filters.sort)) {
      if (a.reference === null && b.reference !== null) return 1;
      if (b.reference === null && a.reference !== null) return -1;
      return ((a.reference ?? 0) - (b.reference ?? 0)) * direction || a.item.id.localeCompare(b.item.id);
    }
    return b.score - a.score; // Stable catalog order breaks equal-score ties.
  });
  return matches;
}

export function retailerDestination(item, config) {
  const affiliate = config?.affiliate;
  if (item.verification.status === 'verified' && affiliate?.enabled && affiliate.approved && affiliate.associateTag && ['owner-provided', 'owner-tag-confirmed'].includes(item.affiliateVerification?.status)) {
    const url = safeAmazonURL(item.affiliateUrl);
    if (url && (new URL(url).hostname === 'amzn.to' || new URL(url).searchParams.get('tag') === affiliate.associateTag)) return { url, sponsored: true, label: 'View on Amazon' };
  }
  if (item.verification.status === 'verified') {
    const url = safeAmazonURL(item.productUrl);
    if (url && !new URL(url).searchParams.has('tag') && new URL(url).hostname !== 'amzn.to') return { url, sponsored: false, label: 'View on Amazon' };
  }
  return { url: 'https://www.amazon.com/s?k=' + encodeURIComponent(item.search), sponsored: false, label: 'Search on Amazon' };
}
export function safeAmazonURL(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && ['www.amazon.com', 'amazon.com', 'amzn.to'].includes(url.hostname) ? url.href : null; } catch { return null; }
}
