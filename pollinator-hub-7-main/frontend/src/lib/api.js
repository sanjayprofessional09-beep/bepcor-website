import axios from 'axios';

const BASE = `${process.env.REACT_APP_BACKEND_URL}/api`;

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

const extractError = (err) => {
  const d = err?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((x) => x.msg || String(x)).join(', ');
  if (typeof d === 'string') return d;
  return err?.message || 'Something went wrong';
};

export const api = {
  subscribeNewsletter: async (email) => {
    try {
      const res = await client.post('/newsletter/subscribe', { email });
      return { ok: true, data: res.data };
    } catch (err) {
      return { ok: false, error: extractError(err), status: err?.response?.status };
    }
  },
  createDonation: async (payload) => {
    try {
      const res = await client.post('/donations', payload);
      return { ok: true, data: res.data };
    } catch (err) {
      return { ok: false, error: extractError(err) };
    }
  },
  createVolunteer: async (payload) => {
    try {
      const res = await client.post('/volunteers', payload);
      return { ok: true, data: res.data };
    } catch (err) {
      return { ok: false, error: extractError(err) };
    }
  },
  sendContact: async (payload) => {
    try {
      const res = await client.post('/contact', payload);
      return { ok: true, data: res.data };
    } catch (err) {
      return { ok: false, error: extractError(err) };
    }
  },
  listPosts: async ({ category, q } = {}) => {
    try {
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (q) params.q = q;
      const res = await client.get('/posts', { params });
      return { ok: true, data: res.data };
    } catch (err) {
      return { ok: false, error: extractError(err), data: [] };
    }
  },
};

export default api;
