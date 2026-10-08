import { money, LABELS } from './catalog.js';
import { element } from './cards.js';
export function renderComparison(root, selected, remove) {
  root.hidden = !selected.length; root.replaceChildren();
  if (!selected.length) return;
  root.append(element('h3', '', 'A side-by-side kind of good'), element('p', '', 'Compare up to three products. Manufacturer facts and editorial tags are separate; no live prices or test scores are displayed.'));
  const table = element('table', 'comparison-table'); table.append(element('caption', 'sr-only', 'Comparison of your selected ideas'));
  const head = element('thead'), row = element('tr'), corner = element('th', '', 'What to consider'); corner.scope = 'col'; row.append(corner);
  selected.forEach(item => {
    const th = element('th'); th.scope = 'col';
    const link = element('a', '', item.name); link.href = '/ideas/' + item.id + '/';
    const button = element('button', 'clear-filters', 'Remove'); button.type = 'button'; button.setAttribute('aria-label', `Remove ${item.name} from comparison`); button.addEventListener('click', () => remove(item.id));
    th.append(link, button); row.append(th);
  }); head.append(row); table.append(head);
  const body = element('tbody');
  for (const [label, value] of [
    ['Category', item => item.category], ['Brand & model', item => [item.brand, item.model].filter(Boolean).join(' · ')], ['Source-reviewed features', item => item.features.join(' ')], ['Editorial style tags', item => item.styles.map(style => LABELS[style]).join(', ')],
    ['Current price', item => item.verification.status === 'demo' ? money(item.planningBudget) + ' · not a price' : 'Verify current price on Amazon'],
    ['Before you choose', item => item.considerations.join(' ')], ['Information status', item => item.verification.status === 'demo' ? 'Demonstrative concept; no specific product verified' : 'Source-reviewed recommendation']
  ]) { const tr = element('tr'), th = element('th', '', label); th.scope = 'row'; tr.append(th); selected.forEach(item => tr.append(element('td', '', value(item)))); body.append(tr); }
  table.append(body); const scroll = element('div', 'table-scroll'); scroll.tabIndex = 0; scroll.setAttribute('role', 'region'); scroll.setAttribute('aria-label', 'Idea comparison; scroll horizontally if needed'); scroll.append(table); root.append(scroll);
}
