/* No network calls, cookies, user IDs or raw query text. External analytics is disabled. */
const EVENTS = new Set(['search', 'category', 'filter', 'idea_view', 'retailer_click', 'article_view', 'quiz_step', 'quiz_complete']);
const KEYS = new Set(['category', 'preference', 'budgetBand', 'queryLength', 'id', 'slug', 'step', 'count', 'sponsored']);
export function track(name, values = {}) {
  if (!EVENTS.has(name)) return;
  const detail = { name, values: Object.fromEntries(Object.entries(values).filter(([key, value]) => KEYS.has(key) && ['string', 'number', 'boolean'].includes(typeof value))) };
  window.dispatchEvent(new CustomEvent('pickpop:metric', { detail }));
}
// An approved analytics adapter may subscribe after consent. This module does not buffer or send events.
