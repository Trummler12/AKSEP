import { apiGet } from './apiClient.js';
import { getLanguage } from '../state/languageStore.js';

/**
 * Fetch list of topics with filters for /topics page.
 * Mirrors GET /api/v1/topics query parameters.:contentReference[oaicite:0]{index=0}
 */
export async function fetchTopicsList(filters = {}) {
  const lang = getLanguage();
  const params = new URLSearchParams();

  if (filters.maxLayer != null) params.set('maxLayer', String(filters.maxLayer));
  if (filters.showCourses != null) params.set('showCourses', String(filters.showCourses));
  if (filters.showAchievements != null) params.set('showAchievements', String(filters.showAchievements));
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortDirection) params.set('sortDirection', filters.sortDirection);
  if (lang) params.set('lang', lang);

  const query = params.toString();
  const data = await apiGet(`/topics${query ? `?${query}` : ''}`);
  // data shape: { items: TopicSummaryDto[], total: number }:contentReference[oaicite:1]{index=1}
  return data;
}

/**
 * Fetch topic details + ID resolution for /topics/:topicId
 * Returns TopicResolutionResponseDto.:contentReference[oaicite:2]{index=2}
 */
export async function fetchTopicById(topicId) {
  const lang = getLanguage();
  const params = new URLSearchParams();
  if (lang) params.set('lang', lang);

  const query = params.toString();
  return apiGet(`/topics/${encodeURIComponent(topicId)}${query ? `?${query}` : ''}`);
}
