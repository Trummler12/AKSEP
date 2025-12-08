import { getLanguage } from '../state/languageStore.js';

const API_BASE = '/api/v1';

export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {{ status?: number, errorCode?: string, path?: string, details?: any }} [info]
   */
  constructor(message, info = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = info.status ?? null;
    this.errorCode = info.errorCode ?? null;
    this.path = info.path ?? null;
    this.details = info.details;
  }
}

/**
 * Low-level request helper.
 * - Adds base URL
 * - Sends Accept-Language
 * - Maps non-2xx responses to ApiError (ErrorResponseDto)
 * - Maps network errors to ApiError with status=null
 */
async function request(path, { method = 'GET', body = null } = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    Accept: 'application/json'
  };

  const lang = getLanguage && getLanguage();
  if (lang) {
    headers['Accept-Language'] = lang;
  }

  const options = { method, headers };

  if (body != null) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (err) {
    throw new ApiError('Backend not reachable. Please try again later.', {
      details: err
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  let data = null;

  if (isJson) {
    try {
      data = await response.json();
    } catch {
      // ignore parse errors
    }
  }

  if (!response.ok) {
    // expected error format from backend
    const message =
      (data && data.message) ||
      `Request failed with status ${response.status}`;

    throw new ApiError(message, {
      status: response.status,
      errorCode: data && data.error,
      path: data && data.path,
      details: data
    });
  }

  return data;
}

export function apiGet(path) {
  return request(path, { method: 'GET' });
}

export function apiPost(path, body) {
  return request(path, { method: 'POST', body });
}
