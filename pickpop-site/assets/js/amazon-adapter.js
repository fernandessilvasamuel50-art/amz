import { AmazonCreatorsApiProvider } from './providers.js';
/* Integration boundary only. Never place Amazon credentials in public JavaScript. */
export async function requestAuthorizedCatalog(config) {
  if (!config.amazonContent?.enabled || !config.amazonContent.serverEndpoint) {
    return new AmazonCreatorsApiProvider().search({});
  }
  // Intentionally fail closed until an approved server-side integration is implemented and reviewed.
  throw new Error('An authorized server-side Amazon adapter is required before enabling live data.');
}
