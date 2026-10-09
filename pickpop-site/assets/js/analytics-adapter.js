// Future GA4 event mapping only. Does not load Google scripts or create a service.
// Review consent, privacy, CSP and Google data settings before enabling a provider.
export function createGA4Adapter(gtag, measurementId) {
  if (typeof gtag !== 'function' || !/^G-[A-Z0-9]{6,20}$/.test(measurementId || '')) throw new Error('An approved GA4 function and public measurement ID are required');
  return { send(event) { gtag('event', event.name, { ...event.values, send_to: measurementId }); } };
}
