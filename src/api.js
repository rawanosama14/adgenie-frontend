const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const TOKEN_KEY = 'adgenie_token';
const USER_KEY = 'adgenie_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const setStoredUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
export const clearStoredUser = () => localStorage.removeItem(USER_KEY);

export const isAuthenticated = () => Boolean(getToken());

export const logout = () => {
  clearToken();
  clearStoredUser();
};

const DEFAULT_TIMEOUT_MS = 30000;

function withTimeout(signal, timeoutMs) {
  if (!timeoutMs) return signal;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  signal.addEventListener('abort', () => { clearTimeout(id); controller.abort(); });
  return controller.signal;
}

async function request(path, { method = 'GET', body, auth = false, form = false, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const headers = {};
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  } else if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  let payload;
  if (form && body) {
    payload = new URLSearchParams(body).toString();
  } else if (body !== undefined && body !== null) {
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: payload,
      signal: withTimeout(new AbortController().signal, timeoutMs),
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection and try again.');
    }
    throw new Error('Network error. Please check your internet connection.');
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detail =
      (data && (data.detail || data.message)) || `Server error (${response.status})`;
    const error = new Error(detail);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  register: (payload) =>
    request('/register', { method: 'POST', body: payload }),

  login: (email, password) =>
    request('/token', {
      method: 'POST',
      form: true,
      body: { username: email, password }
    }),

  generateCampaign: (payload) =>
    request('/generate-advanced-campaign', { method: 'POST', body: payload, auth: true }),

  generateCampaignStream: async (payload, onProgress) => {
    const token = getToken();
    let response;
    try {
      response = await fetch(`${API_BASE}/generate-advanced-campaign-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      throw new Error('Network error. Please check your internet connection.');
    }

    if (!response.ok) {
      let detail = `Server error (${response.status})`;
      try {
        const errData = await response.json();
        detail = errData.detail || errData.message || detail;
      } catch {}
      throw new Error(detail);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;
        try {
          const event = JSON.parse(jsonStr);
          if (event.type === 'progress' && onProgress) {
            onProgress(event.agent_log);
          } else if (event.type === 'complete') {
            finalResult = event.data;
          } else if (event.type === 'error') {
            throw new Error(event.message || 'Pipeline error');
          }
        } catch (e) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }

    if (!finalResult) {
      throw new Error('Generation ended before a complete campaign was returned. Please try again.');
    }
    return finalResult;
  },

  saveDraft: (payload) =>
    request('/drafts', { method: 'POST', body: payload, auth: true }),

  getDrafts: () =>
    request('/drafts', { auth: true }),

  getDraft: (draftId) =>
    request(`/drafts/${encodeURIComponent(draftId)}`, { auth: true }),

  deleteDraft: (draftId) =>
    request(`/drafts/${encodeURIComponent(draftId)}`, { method: 'DELETE', auth: true }),

  getCalendar: () =>
    request('/campaigns/calendar', { auth: true }),

  createCheckout: (dailyPostsCount) =>
    request(`/payments/create-checkout-session?daily_posts_count=${dailyPostsCount}`, {
      method: 'POST',
      auth: true
    }),

  getPreferences: () =>
    request('/user/preferences', { auth: true }),

  getAiUsage: () =>
    request('/user/ai-usage', { auth: true }),

  updatePreferences: (payload) =>
    request('/user/preferences', { method: 'PATCH', body: payload, auth: true }),

  getSubscriptionStatus: () =>
    request('/user/subscription-status', { auth: true }),

};
