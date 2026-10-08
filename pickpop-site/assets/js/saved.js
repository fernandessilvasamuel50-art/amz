export function createSavedStore(ids) {
  const valid = new Set(ids);
  let saved = [], persistent = true, error = '';
  const listeners = new Set();
  const decode = raw => { try { const value = JSON.parse(raw || '[]'); return Array.isArray(value) ? [...new Set(value.filter(id => valid.has(id)))]: []; } catch { return []; } };
  const notify = () => listeners.forEach(listener => listener());
  function load() {
    try {
      persistent = localStorage.getItem('pickpop-persistence') !== 'off';
      saved = persistent ? decode(localStorage.getItem('pickpop-saved')) : [];
      error = '';
    } catch { error = 'Browser storage is unavailable. Saved ideas last only for this visit.'; }
  }
  load();
  function persist() {
    try {
      if (persistent) localStorage.setItem('pickpop-saved', JSON.stringify(saved));
      else localStorage.removeItem('pickpop-saved');
      error = '';
    } catch { error = 'Browser storage is unavailable. Saved ideas last only for this visit.'; }
  }
  window.addEventListener('storage', event => {
    if (['pickpop-saved', 'pickpop-persistence', null].includes(event.key)) { load(); notify(); }
  });
  return {
    get ids() { return [...saved]; }, get persistent() { return persistent; }, get error() { return error; },
    toggle(id) { if (!valid.has(id)) return; saved = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id]; persist(); notify(); },
    setPersistent(value) {
      persistent = Boolean(value);
      try { localStorage.setItem('pickpop-persistence', persistent ? 'on' : 'off'); } catch { /* persist supplies the visible error */ }
      persist(); notify();
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  };
}
