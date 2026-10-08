/* Integration boundary only. Never place Amazon credentials in public JavaScript. */
export async function requestAuthorizedCatalog(config) {
  if (!config.amazonContent?.enabled || !config.amazonContent.serverEndpoint) {
    return { status: 'disabled', items: [], message: 'Authorized Amazon data is not connected.' };
  }
  // Intentionally fail closed until an approved server-side integration is implemented and reviewed.
  throw new Error('An authorized server-side Amazon adapter is required before enabling live data.');
}
