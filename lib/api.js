const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
const TOKEN_KEY = 'adgenie_token';
const USER_KEY = 'adgenie_user';
const HQ_TOKEN_KEY = 'adgenie_hq_token';
const HQ_USER_KEY = 'adgenie_hq_user';

function normalizeApiDetail(detail) {
  if (!detail) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => {
      const path = Array.isArray(item?.loc) ? item.loc.filter((x) => x !== 'body').join('.') : '';
      return `${path ? `${path}: ` : ''}${item?.msg || item?.message || 'Validation error'}`;
    }).join(' | ');
  }
  if (typeof detail === 'object') return detail.message || JSON.stringify(detail);
  return String(detail);
}

export const getToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY));
export const setToken = (token) => { if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token); };
export const clearToken = () => { if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY); };
export const getStoredUser = () => { if (typeof window === 'undefined') return null; try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); } catch { return null; } };
export const setStoredUser = (user) => { if (typeof window !== 'undefined') localStorage.setItem(USER_KEY, JSON.stringify(user)); };
export const clearStoredUser = () => { if (typeof window !== 'undefined') localStorage.removeItem(USER_KEY); };
export const isAuthenticated = () => Boolean(getToken());
export const logout = () => { clearToken(); clearStoredUser(); };
export const getHqToken = () => (typeof window === 'undefined' ? null : localStorage.getItem(HQ_TOKEN_KEY));
export const setHqToken = (token) => { if (typeof window !== 'undefined') localStorage.setItem(HQ_TOKEN_KEY, token); };
export const getStoredHqUser = () => { if (typeof window === 'undefined') return null; try { return JSON.parse(localStorage.getItem(HQ_USER_KEY) || 'null'); } catch { return null; } };
export const setStoredHqUser = (user) => { if (typeof window !== 'undefined') localStorage.setItem(HQ_USER_KEY, JSON.stringify(user)); };
export const clearHqSession = () => { if (typeof window !== 'undefined') { localStorage.removeItem(HQ_TOKEN_KEY); localStorage.removeItem(HQ_USER_KEY); } };
export const isHqAuthenticated = () => Boolean(getHqToken());

async function request(path, { method = 'GET', body, auth = false, hqAuth = false, form = false, multipart = false, timeoutMs = 30000 } = {}) {
  const headers = {};
  if (!multipart && form) headers['Content-Type'] = 'application/x-www-form-urlencoded';
  else if (!multipart && body !== undefined && body !== null) headers['Content-Type'] = 'application/json';
  if (hqAuth && getHqToken()) headers.Authorization = `Bearer ${getHqToken()}`;
  else if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let payload = body;
  if (form && body) payload = new URLSearchParams(body).toString();
  else if (!multipart && body !== undefined && body !== null) payload = JSON.stringify(body);
  let res;
  try { res = await fetch(`${API_BASE}${path}`, { method, headers, body: payload, signal: controller.signal }); }
  catch (e) { if (e?.name === 'AbortError') throw new Error('انتهت مهلة الطلب. حاول مرة أخرى.'); throw new Error('تعذر الاتصال بالخادم.'); }
  finally { clearTimeout(timer); }
  let data = null; try { data = await res.json(); } catch {}
  if (!res.ok) { const err = new Error(normalizeApiDetail(data?.detail) || data?.message || `Server error (${res.status})`); err.status = res.status; throw err; }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method:'POST', body:{ email:payload.email, password:payload.password, name:payload.name || '', language:payload.language || 'ar' } }),
  login: (email,password) => request('/auth/token', { method:'POST', form:true, body:{username:email,password} }),
  hqLogin: async (email,password) => { const data = await request('/auth/hq-token', { method:'POST', form:true, body:{username:email,password} }); setHqToken(data.access_token); setStoredHqUser(data.user); return data; },
  hqLogout: () => clearHqSession(),
  me: () => request('/users/me', {auth:true}),
  getPreferences: async () => (await request('/users/me',{auth:true}))?.user || {},
  updatePreferences: async (p) => (await request('/users/me',{method:'PATCH',body:p,auth:true}))?.user || {},

  getPlans: () => request('/plans'),
  getSubscriptionStatus: () => request('/subscription/status',{auth:true}),
  requestSubscription: (p) => request('/subscription/request',{method:'POST',body:p,auth:true}),

  getBrands: () => request('/brands',{auth:true}),
  getBrand: (id) => request(`/brands/${encodeURIComponent(id)}`,{auth:true}),
  createBrand: (p) => request('/brands',{method:'POST',body:p,auth:true}),
  updateBrand: (id,p) => request(`/brands/${encodeURIComponent(id)}`,{method:'PATCH',body:p,auth:true}),
  deleteBrand: (id) => request(`/brands/${encodeURIComponent(id)}`,{method:'DELETE',auth:true}),
  uploadBrandLogo: (id,file) => { const fd=new FormData(); fd.append('file',file); return request(`/brands/${encodeURIComponent(id)}/logo`,{method:'POST',body:fd,multipart:true,auth:true,timeoutMs:60000}); },

  generateCampaign: (p) => request('/campaigns/generate',{method:'POST',body:p,auth:true,timeoutMs:180000}),
  generateCampaignStream: async (p,onProgress) => {
    const res = await fetch(`${API_BASE}/campaigns/generate/stream`,{method:'POST',headers:{'Content-Type':'application/json',...(getToken()?{Authorization:`Bearer ${getToken()}`}:{})},body:JSON.stringify(p)});
    if(!res.ok){ let d={}; try{d=await res.json();}catch{} throw new Error(normalizeApiDetail(d.detail)||d.message||`Server error (${res.status})`); }
    if(!res.body) throw new Error('Streaming غير متاح في المتصفح.');
    const reader=res.body.getReader(), decoder=new TextDecoder(); let buffer='', final=null;
    while(true){ const {done,value}=await reader.read(); if(done)break; buffer+=decoder.decode(value,{stream:true}); const lines=buffer.split('\n'); buffer=lines.pop()||''; for(const line of lines){ if(!line.startsWith('data: '))continue; const e=JSON.parse(line.slice(6)); if(e.type==='progress')onProgress?.(e.agent_log); else if(e.type==='complete')final=e.data; else if(e.type==='error')throw new Error(normalizeApiDetail(e.message)||'Generation failed'); }}
    if(!final) throw new Error('انتهى التوليد بدون نتيجة مكتملة.'); return final;
  },
  getCampaigns: () => request('/campaigns',{auth:true}),
  getCalendar: async () => { const d=await request('/campaigns',{auth:true}); return {scheduled_and_past_campaigns:(d.campaigns||[]).map(c=>({...c,campaign_data:c.result||{},timestamp:c.created_at}))}; },
  getCampaignById: (id) => request(`/campaigns/${encodeURIComponent(id)}`,{auth:true}),
  selectCampaignVariation: (id,variation_id) => request(`/campaigns/${encodeURIComponent(id)}/select`,{method:'PATCH',body:{variation_id},auth:true}),
  updateCampaignVariation: (id,variation_id,ad_copy) => request(`/campaigns/${encodeURIComponent(id)}/variations/${variation_id}`,{method:'PATCH',body:{ad_copy},auth:true}),
  regenerateCampaignImage: (id,variation_id) => request(`/campaigns/${encodeURIComponent(id)}/variations/${variation_id}/regenerate-image`,{method:'POST',auth:true,timeoutMs:240000}),

  getMetaIntegration: () => request('/integrations/meta',{auth:true}),
  connectMeta: (p) => request('/integrations/meta',{method:'POST',body:p,auth:true,timeoutMs:45000}),
  disconnectMeta: () => request('/integrations/meta',{method:'DELETE',auth:true}),
  publishCampaign: (campaign_id,platform) => request('/publishing/publish',{method:'POST',body:{campaign_id,platform},auth:true,timeoutMs:60000}),
  getPublishedAds: () => request('/publishing/history',{auth:true}),

  getHqOverview: () => request('/hq/overview',{hqAuth:true}),
  decideSubscription: (id,status,admin_note='') => request(`/hq/subscription-requests/${encodeURIComponent(id)}`,{method:'PATCH',body:{status,admin_note},hqAuth:true}),

  getAiUsage: async () => { const s=await request('/subscription/status',{auth:true}); return {requests:s.usage?.campaigns_this_month||0,daily_quota:s.usage?.campaigns_limit||0}; },
  saveDraft: (payload) => request('/drafts',{method:'POST',body:payload,auth:true}),
  getDrafts: () => request('/drafts',{auth:true}),
  getDraft: (id) => request(`/drafts/${encodeURIComponent(id)}`,{auth:true}),
  deleteDraft: (id) => request(`/drafts/${encodeURIComponent(id)}`,{method:'DELETE',auth:true}),
};
