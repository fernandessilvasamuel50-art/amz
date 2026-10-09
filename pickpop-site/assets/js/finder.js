import { loadCatalog, CATEGORIES, PREFERENCES, PRIORITIES, LABELS, parseBudget, money, matchCatalog } from './catalog.js';
import { CuratedCatalogProvider } from './providers.js';
import { createSavedStore } from './saved.js';
import { element, productCard } from './cards.js';
import { initQuiz } from './quiz.js';
import { renderComparison } from './comparison.js';
import { track, searchTopic } from './metrics.js';
const $ = id => document.getElementById(id);
let items = [], config, provider, store, initialized = false, comparison = [];
const filters = { query: '', category: 'all', budget: 50, preferences: [], priority: '', savedOnly: false, sort: 'featured' };
const params = new URLSearchParams(location.search);
filters.query = (params.get('q') || '').slice(0, 120); filters.budget = parseBudget(params.get('budget'));
if (CATEGORIES.includes(params.get('category'))) filters.category = params.get('category');
filters.preferences = [...new Set((params.get('preferences') || '').split(',').filter(value => PREFERENCES.includes(value)))];
if (PRIORITIES.includes(params.get('priority'))) filters.priority = params.get('priority');
if (location.search) {
  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots); }
  robots.content = 'noindex,follow';
}
function syncControls() {
  if (!$('product-grid')) return;
  $('product-search').value = filters.query; $('budget-input').value = String(filters.budget);
  const range = $('budget-range'); range.max = String(Math.max(300, Math.ceil(filters.budget))); range.value = String(filters.budget);
  range.setAttribute('aria-valuetext', money(filters.budget) + ' budget preference, not a guaranteed price');
  $('budget-value').textContent = money(filters.budget); $('budget-scale-max').textContent = money(Number(range.max));
  const percent = ((Number(range.value) - 1) / (Number(range.max) - 1)) * 100;
  range.style.background = `linear-gradient(90deg,var(--coral) ${percent}%,#efece7 ${percent}%)`;
  for (const [attribute, value] of [['budget', filters.budget], ['category', filters.category]]) {
    document.querySelectorAll(`[data-${attribute}]`).forEach(button => {
      const active = attribute === 'budget' ? Number(button.dataset.budget) === value : button.dataset.category === value;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
  }
  document.querySelectorAll('[data-preference]').forEach(input => { input.checked = filters.preferences.includes(input.dataset.preference); });
  $('priority-filter').value = filters.priority; $('sort-order').value = filters.sort;
}
function saveIdea(id) {
  const buttons = [...$('product-grid').querySelectorAll('.heart-button')], index = buttons.findIndex(button => button.dataset.productId === id);
  store.toggle(id);
  const remaining = [...$('product-grid').querySelectorAll('.heart-button')];
  (remaining.find(button => button.dataset.productId === id) || remaining[Math.min(index, remaining.length - 1)] || $('saved-toggle')).focus({ preventScroll: true });
}
function compareIdea(id) {
  if (comparison.includes(id)) comparison = comparison.filter(value => value !== id);
  else if (comparison.length < 3) comparison.push(id);
  else { $('compare-status').textContent = 'Three ideas is the limit. Remove one before adding another.'; return; }
  render(); $('compare-status').textContent = `${comparison.length} idea${comparison.length === 1 ? '' : 's'} selected for comparison.`;
  document.querySelector(`[data-compare-id="${id}"]`)?.focus({ preventScroll: true });
}
function render() {
  const grid = $('product-grid'); if (!grid || !store) return;
  const matches = provider.search({ ...filters, saved: store.ids }), fragment = document.createDocumentFragment();
  matches.forEach(match => fragment.append(productCard(match, { config, store, onSave: saveIdea, comparison, onCompare: compareIdea })));
  grid.replaceChildren(fragment);
  $('saved-count').textContent = String(store.ids.length); $('saved-toggle').setAttribute('aria-pressed', String(filters.savedOnly)); $('remember-saved').checked = store.persistent;
  $('saved-status').textContent = store.error || (!store.persistent ? 'Saved ideas stay in this tab for this visit. Remembering favorites is off.' : '');
  $('results-summary').textContent = `${matches.length} ${filters.savedOnly ? 'saved' : 'matching'} idea${matches.length === 1 ? '' : 's'} · ${filters.category === 'all' ? 'all categories' : filters.category} · ${money(filters.budget)} budget preference${filters.query ? ` · “${filters.query}”` : ''}${filters.priority ? ` · ${LABELS[filters.priority]}` : ''}.`;
  $('empty-state').hidden = matches.length > 0;
  $('empty-title').textContent = filters.savedOnly ? (store.ids.length ? 'Your saved ideas are outside these filters.' : 'Your next favorite is waiting.') : 'No match in our curated catalog.';
  $('empty-description').textContent = filters.savedOnly ? 'Save an idea with its heart, or clear the filters to see your shortlist.' : 'Try fewer preferences, another keyword, or another category. We will not substitute unrelated products.';
  $('reset-filters').textContent = filters.savedOnly && store.ids.length ? 'Show all saved ideas →' : 'See all ideas →';
  $('amazon-fallback').hidden = filters.savedOnly; $('amazon-fallback').href = 'https://www.amazon.com/s?k=' + encodeURIComponent(filters.query || (filters.category === 'all' ? 'shopping ideas' : filters.category));
  renderComparison($('comparison'), comparison.map(id => items.find(item => item.id === id)), id => { comparison = comparison.filter(value => value !== id); render(); $('compare-status').focus({ preventScroll: true }); });
}
function reset(all = false) {
  const keepSaved = all && filters.savedOnly && store.ids.length > 0;
  Object.assign(filters, { query: '', category: 'all', budget: all ? 300 : 50, preferences: [], priority: '', savedOnly: keepSaved, sort: 'featured' });
  $('budget-error').hidden = true; $('budget-input').setAttribute('aria-invalid', 'false'); syncControls(); render();
}
function resultsFocus() {
  if (!$('budget-input').reportValidity()) return;
  filters.budget = parseBudget($('budget-input').value); syncControls(); render();
  track('search', { category: filters.category, queryLength: filters.query.length, queryTopic: searchTopic(filters.query), count: provider.search(filters).length, budgetBand: filters.budget <= 25 ? 'up-to-25' : filters.budget <= 100 ? 'up-to-100' : 'over-100' });
  $('results-summary').focus({ preventScroll: true }); $('results').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}
function initFinder() {
  if (!$('product-grid')) return;
  syncControls();
  $('product-search').addEventListener('input', event => { filters.query = event.target.value.slice(0, 120); render(); });
  $('product-search').addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); resultsFocus(); } });
  $('search-button').addEventListener('click', resultsFocus); $('find-button').addEventListener('click', resultsFocus);
  $('budget-range').addEventListener('input', event => { filters.budget = Number(event.target.value); syncControls(); render(); });
  $('budget-input').addEventListener('input', event => {
    const value = parseBudget(event.target.value, null); $('budget-error').hidden = value !== null; event.target.setAttribute('aria-invalid', String(value === null));
    if (value !== null) { filters.budget = value; syncControls(); render(); }
  });
  document.querySelectorAll('[data-budget]').forEach(button => button.addEventListener('click', () => { filters.budget = Number(button.dataset.budget); $('budget-error').hidden = true; $('budget-input').setAttribute('aria-invalid', 'false'); syncControls(); render(); }));
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { filters.category = button.dataset.category; syncControls(); render(); track('category', { category: filters.category }); }));
  document.querySelectorAll('[data-preference]').forEach(input => input.addEventListener('change', () => {
    filters.preferences = [...document.querySelectorAll('[data-preference]:checked')].map(input => input.dataset.preference); render(); track('filter', { preference: input.dataset.preference });
  }));
  $('priority-filter').addEventListener('change', event => { filters.priority = event.target.value; render(); });
  $('sort-order').addEventListener('change', event => { filters.sort = event.target.value; render(); });
  $('saved-toggle').addEventListener('click', () => { filters.savedOnly = !filters.savedOnly; render(); });
  $('remember-saved').addEventListener('change', event => store.setPersistent(event.target.checked));
  $('clear-filters').addEventListener('click', () => reset());
  $('reset-filters').addEventListener('click', () => { reset(true); $('results-summary').focus({ preventScroll: true }); });
  render();
}
async function boot() {
  if (initialized) return;
  const status = $('catalog-status'); if (status) { status.hidden = false; status.textContent = 'Opening the idea catalog…'; }
  $('product-grid')?.setAttribute('aria-busy', 'true'); document.querySelectorAll('[data-catalog-control]').forEach(control => { control.disabled = true; });
  try {
    ({ items, config } = await loadCatalog()); provider = new CuratedCatalogProvider({ schemaVersion: 1, items }, config); store = createSavedStore(items.map(item => item.id));
    initFinder(); initQuiz({ items, config, store, provider }); store.subscribe(render);
    if (status) status.hidden = true; if ($('catalog-error')) $('catalog-error').hidden = true; initialized = true;
  } catch {
    if (status) status.textContent = 'Our idea catalog could not load. Your saved favorites have not been changed.';
    if ($('catalog-error')) $('catalog-error').hidden = false;
    if ($('quiz-app')) {
      const retry = element('button', 'btn btn-dark', 'Try loading the quiz again'); retry.type = 'button'; retry.addEventListener('click', boot);
      $('quiz-app').replaceChildren(element('p', '', 'The quiz needs our idea catalog, which could not load. Your answers and favorites have not been sent anywhere.'), retry);
    }
  } finally {
    $('product-grid')?.setAttribute('aria-busy', 'false'); document.querySelectorAll('[data-catalog-control]').forEach(control => { control.disabled = !initialized; });
  }
}
$('catalog-retry')?.addEventListener('click', boot);
boot();
