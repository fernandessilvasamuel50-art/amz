import { money, retailerDestination, authorizedPrice } from './catalog.js';
import { track } from './metrics.js';

export function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
export function productCard(match, { config, store, onSave, comparison = [], onCompare }) {
  const { item, reasons } = match;
  const card = element('article', 'product-card');
  const visual = element('div', 'product-visual'); visual.style.background = item.color;
  const chip = element('span', 'product-chip', item.chip);
  const icon = element('span', 'product-icon', item.emoji); icon.setAttribute('aria-hidden', 'true');
  const heart = element('button', 'heart-button' + (store.ids.includes(item.id) ? ' active' : ''), store.ids.includes(item.id) ? '♥' : '♡');
  heart.type = 'button'; heart.dataset.productId = item.id;
  heart.setAttribute('aria-label', `${store.ids.includes(item.id) ? 'Remove from' : 'Save to'} favorites: ${item.name}`);
  heart.setAttribute('aria-pressed', String(store.ids.includes(item.id)));
  heart.addEventListener('click', () => onSave(item.id));
  visual.append(chip, icon, heart);
  const copy = element('div', 'product-copy');
  const category = element('div', 'product-category', `${item.category} · ${item.verification.status === 'demo' ? 'example idea' : 'sourced recommendation'}`);
  const heading = element('h3');
  const detail = element('a', '', item.name); detail.href = `/ideas/${item.id}/`; heading.append(detail);
  const description = element('p', '', item.description);
  const why = element('p', 'why-match', reasons.join('. ') + '.');
  const reference = element('div', 'product-price');
  const price = authorizedPrice(item, config);
  if (price !== null) {
    reference.append(element('strong', '', money(price)), element('span', '', 'Authorized price · checked ' + new Date(item.price.fetchedAt).toLocaleString('en-US')));
  } else if (item.verification.status === 'demo') {
    reference.append(element('strong', '', money(item.planningBudget)), element('span', '', 'example planning target · not a price'));
  } else reference.append(element('span', '', 'Check the current price on Amazon'));
  const destination = retailerDestination(item, config);
  const link = element('a', 'product-cta', destination.label + ' ↗');
  link.href = destination.url; link.target = '_blank'; link.rel = 'noopener noreferrer ' + (destination.sponsored ? 'sponsored' : 'nofollow');
  link.setAttribute('aria-label', `${destination.label} for ${item.name} (opens in a new tab; verify the current price)`);
  link.addEventListener('click', () => track('retailer_click', { id: item.id, sponsored: destination.sponsored }));
  if (destination.sponsored) copy.append(element('p', 'affiliate-note', 'Paid link. As an Amazon Associate I earn from qualifying purchases.'));
  copy.append(category, heading, description, why, reference, link);
  const actions = element('div', 'card-tools');
  const more = element('a', '', 'Explore this idea →'); more.href = detail.href;
  actions.append(more);
  if (onCompare) {
    const compare = element('button', 'compare-choice', 'Compare'); compare.type = 'button'; compare.dataset.compareId = item.id;
    compare.setAttribute('aria-label', `Compare ${item.name}`); compare.setAttribute('aria-pressed', String(comparison.includes(item.id)));
    compare.addEventListener('click', () => onCompare(item.id)); actions.append(compare);
  }
  copy.append(actions); card.append(visual, copy);
  return card;
}
