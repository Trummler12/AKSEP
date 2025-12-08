import { apiPost } from './apiClient.js';
import { getLanguage } from '../state/languageStore.js';

/**
 * POST /api/v1/topics/interest-search
 * Body: InterestSearchRequestDto.:contentReference[oaicite:3]{index=3}
 */
export async function searchTopicsByInterest({ interestsText, maxResults = 50, explainMatches = true } = {}) {
  const language = getLanguage();

  const body = {
    interestsText: interestsText ?? '',
    language,
    maxResults,
    explainMatches
  };

  const data = await apiPost('/topics/interest-search', body);
  // data: InterestSearchResponseDto
  return data;
}
