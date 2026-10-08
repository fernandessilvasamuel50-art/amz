/* Shared navigation for the homepage, guides, and informational pages. */
(() => {
  'use strict';
  const menu = document.getElementById('mobile-menu');
  const nav = document.getElementById('mobile-nav');
  if (!menu || !nav) return;

  function setOpen(open) {
    nav.hidden = !open;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menu.addEventListener('click', () => setOpen(nav.hidden));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !nav.hidden) {
      setOpen(false);
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav.hidden && !nav.contains(event.target) && !menu.contains(event.target)) setOpen(false);
  });
  const desktop = window.matchMedia('(min-width: 851px)');
  desktop.addEventListener('change', event => { if (event.matches) setOpen(false); });
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
