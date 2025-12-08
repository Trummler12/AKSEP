import { apiGet } from './apiClient.js';

/**
 * GET /api/v1/tags – currently not heavily used, but ready for future autocomplete.:contentReference[oaicite:4]{index=4}
 */
export async function fetchAllTags() {
  const data = await apiGet('/tags');
  // { items: TagDto[], total: number }
  return data;
}
