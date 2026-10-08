import { track } from './metrics.js';
const path = location.pathname;
if (path.startsWith('/guides/') && path.endsWith('.html')) track('article_view', { slug: path.split('/').pop() });
if (path.startsWith('/ideas/')) track('idea_view', { id: path.split('/')[2] });
document.querySelectorAll('a[href^="https://www.amazon.com"],a[href^="https://amazon.com"],a[href^="https://amzn.to"]').forEach(link => {
  link.addEventListener('click', () => track('retailer_click', { id: path.split('/')[2] || 'editorial', sponsored: link.rel.includes('sponsored') }));
});
