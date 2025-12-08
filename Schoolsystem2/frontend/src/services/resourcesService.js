import { apiGet } from './apiClient.js';
import { getLanguage } from '../state/languageStore.js';

/**
 * Optional: GET /api/v1/resources/{id}:contentReference[oaicite:5]{index=5}
 */
export async function fetchResourceById(resourceId) {
  const lang = getLanguage();
  const params = new URLSearchParams();
  if (lang) params.set('lang', lang);
  const query = params.toString();

  return apiGet(`/resources/${encodeURIComponent(resourceId)}${query ? `?${query}` : ''}`);
}
