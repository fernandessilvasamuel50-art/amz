import { CATEGORIES, LABELS, money, parseBudget, matchCatalog } from './catalog.js';
import { element, productCard } from './cards.js';
import { track } from './metrics.js';

export function initQuiz({ items, config, store }) {
  const root = document.getElementById('quiz-app');
  if (!root) return;
  let step = 0;
  const answers = { category: 'kitchen', budget: 50, style: 'any', priority: 'everyday-convenience' };
  const questions = [
    { key: 'category', title: 'What are you shopping for?', options: CATEGORIES.map(key => [key, key[0].toUpperCase() + key.slice(1), { kitchen: '☕', home: '⌂', tech: '⌘', pets: '♡', gifts: '✦' }[key]]) },
    { key: 'budget', title: "What's your budget?", options: [5, 10, 25, 50, 100, 200].map(value => [value, money(value), '$']) },
    { key: 'style', title: "What's your style?", options: [['any', 'A little of everything', '✳'], ['minimalist', 'Minimalist', '○'], ['modern', 'Modern', '◇'], ['cozy', 'Cozy', '☼']] },
    { key: 'priority', title: 'What matters most to you?', options: ['saving-money', 'small-spaces', 'everyday-convenience', 'aesthetic-design', 'gift-giving'].map(key => [key, LABELS[key], '✦']) }
  ];
  function render(focus = true) {
    root.replaceChildren();
    const progress = element('p', 'quiz-progress', step < 4 ? `Step ${step + 1} of 4 · no account needed` : 'Your vibe, explained');
    root.append(progress);
    if (step < 4) {
      const question = questions[step];
      const heading = element('h3', 'quiz-heading', question.title); heading.tabIndex = -1;
      const group = element('fieldset', 'quiz-options');
      const legend = element('legend', 'sr-only', question.title); group.append(legend);
      for (const [value, label, icon] of question.options) {
        const option = element('label', 'quiz-option');
        const input = element('input'); input.type = 'radio'; input.name = 'quiz-' + question.key; input.value = String(value); input.checked = answers[question.key] === value;
        input.addEventListener('change', () => { answers[question.key] = value; });
        const symbol = element('span', 'quiz-symbol', icon); symbol.setAttribute('aria-hidden', 'true');
        option.append(input, symbol, element('span', '', label)); group.append(option);
      }
      root.append(heading, group);
      if (step === 1) {
        const label = element('label', 'quiz-custom-budget', 'Or enter your budget in USD');
        const input = element('input'); input.type = 'number'; input.id = 'quiz-budget'; input.min = '1'; input.max = '10000'; input.step = '0.01'; input.required = true; input.value = String(answers.budget);
        input.addEventListener('input', () => {
          const value = parseBudget(input.value, null);
          if (value !== null) answers.budget = value;
          root.querySelectorAll('[name="quiz-budget"]').forEach(radio => { radio.checked = Number(radio.value) === value; });
        });
        group.addEventListener('change', () => { input.value = String(answers.budget); });
        label.append(input); root.append(label);
      }
      const actions = element('div', 'quiz-actions');
      if (step > 0) { const back = element('button', 'btn btn-outline', '← Back'); back.type = 'button'; back.addEventListener('click', () => { step--; render(); }); actions.append(back); }
      const next = element('button', 'btn btn-dark', step === 3 ? 'Find my vibe ↗' : 'Keep going →'); next.type = 'button'; next.id = 'quiz-next';
      next.addEventListener('click', () => {
        const budgetInput = document.getElementById('quiz-budget');
        if (budgetInput && !budgetInput.reportValidity()) return;
        if (budgetInput) answers.budget = parseBudget(budgetInput.value);
        track('quiz_step', { step: step + 1 }); step++; render();
      });
      actions.append(next); root.append(actions);
      if (focus) heading.focus({ preventScroll: true });
    } else {
      const matches = matchCatalog(items, { category: answers.category, budget: answers.budget, preferences: answers.style === 'any' ? [] : [answers.style], priority: answers.priority, sort: 'featured' }, config);
      const heading = element('h3', 'quiz-heading', matches.length ? 'A little more you.' : 'Your vibe deserves a better match.'); heading.tabIndex = -1;
      root.append(heading, element('p', 'quiz-answer-summary', `${answers.category} · ${money(answers.budget)} budget preference · ${answers.style === 'any' ? 'any style' : LABELS[answers.style]} · ${LABELS[answers.priority]}`));
      root.append(element('p', 'quiz-honesty', 'These are example concepts selected by category, editorial style tags, priority, and illustrative planning target. They are not verified Amazon products or prices.'));
      if (!matches.length) root.append(element('p', '', 'Our starter catalog has no idea matching all four answers. Try another style, priority, or budget; we will not substitute unrelated ideas.'));
      const grid = element('div', 'product-grid quiz-results');
      matches.slice(0, 3).forEach(match => grid.append(productCard(match, { config, store, onSave: id => { store.toggle(id); } })));
      root.append(grid);
      const actions = element('div', 'quiz-actions');
      const restart = element('button', 'btn btn-outline', 'Adjust my answers'); restart.type = 'button'; restart.id = 'quiz-restart'; restart.addEventListener('click', () => { step = 0; render(); });
      const link = element('a', 'btn btn-dark', 'Explore these filters →');
      const params = new URLSearchParams({ category: answers.category, budget: String(answers.budget), priority: answers.priority });
      if (answers.style !== 'any') params.set('preferences', answers.style);
      link.href = '/find/' + '?' + params + '#results';
      actions.append(restart, link); root.append(actions);
      if (focus) heading.focus({ preventScroll: true });
      track('quiz_complete', { category: answers.category, count: matches.length });
    }
  }
  store.subscribe(() => {
    root.querySelectorAll('[data-product-id]').forEach(button => {
      const active = store.ids.includes(button.dataset.productId);
      button.setAttribute('aria-pressed', String(active)); button.classList.toggle('active', active); button.textContent = active ? '♥' : '♡';
      const item = items.find(item => item.id === button.dataset.productId);
      button.setAttribute('aria-label', `${active ? 'Remove from' : 'Save to'} favorites: ${item.name}`);
    });
  });
  render(false);
}
