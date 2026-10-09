import { track } from './metrics.js';
// Explicit opt-in, in-memory QA recording only. Not a business analytics system.
const panel = document.getElementById('local-diagnostics');
if (panel && new URLSearchParams(location.search).get('diagnostics') === '1') {
  panel.hidden = false;
  const events = [];
  let recording = false;
  const status = document.getElementById('diagnostic-status');
  window.addEventListener('pickpop:metric', event => {
    if (!recording) return;
    events.push({ at: new Date().toISOString(), ...event.detail });
    if (events.length > 200) events.shift();
    status.textContent = `${events.length} local QA events. Nothing has been sent.`;
  });
  document.getElementById('diagnostic-start').addEventListener('click', () => {
    recording = true;
    track('page_view', { slug: 'finder' });
  });
  document.getElementById('diagnostic-stop').addEventListener('click', () => {
    recording = false; events.length = 0; status.textContent = 'Recording stopped and local events cleared.';
  });
  document.getElementById('diagnostic-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ scope: 'this-browser-qa-only', businessTraffic: false, events }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = 'pickpop-local-qa.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}
