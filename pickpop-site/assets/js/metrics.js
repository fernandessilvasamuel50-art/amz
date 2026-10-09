/* No network calls, cookies, user IDs or raw query text. External analytics is disabled. */
const EVENTS = new Set(['page_view', 'search', 'category', 'filter', 'idea_view', 'retailer_click', 'article_view', 'quiz_step', 'quiz_complete']);
const KEYS = new Set(['category', 'preference', 'budgetBand', 'queryLength', 'queryTopic', 'id', 'slug', 'step', 'count', 'sponsored', 'placement']);
export function searchTopic(query) {
  const text = String(query).toLowerCase();
  if (/coffee|chemex|brew|mug|drinkware/.test(text)) return 'coffee';
  if (/organ|storage|cabinet|spice|container/.test(text)) return 'organization';
  if (/cook|kitchen|skillet|lodge|brush|scale/.test(text)) return 'kitchen';
  if (/mouse|keyboard|webcam|logitech|desk/.test(text)) return 'workspace';
  if (/dog|pet|kong/.test(text)) return 'pets';
  return text.trim() ? 'other' : 'browse';
}
export function metricDetail(name, values = {}) {
  if (!EVENTS.has(name)) return null;
  return { name, values: Object.fromEntries(Object.entries(values).filter(([key, value]) => KEYS.has(key) && (
    typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10000 ||
    typeof value === 'string' && /^[a-zA-Z0-9_.-]{1,80}$/.test(value)
  ))) };
}
export function track(name, values = {}) {
  const detail = metricDetail(name, values);
  if (!detail) return;
  window.dispatchEvent(new CustomEvent('pickpop:metric', { detail }));
}
// Supplying an adapter requires owner approval AND current visitor consent.
// No provider is attached by default; do not queue events before consent.
export function subscribeApprovedAnalytics(adapter, { ownerApproved = false, visitorConsent = false } = {}) {
  if (!ownerApproved || !visitorConsent || typeof adapter?.send !== 'function') return () => {};
  const listener = event => {
    const detail = metricDetail(event.detail?.name, event.detail?.values);
    if (detail) { try { Promise.resolve(adapter.send(detail)).catch(() => {}); } catch {} }
  };
  window.addEventListener('pickpop:metric', listener);
  return () => window.removeEventListener('pickpop:metric', listener);
}
