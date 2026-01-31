import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Add request interceptor to include Admin-Auth header when admin is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    const isAdminLoggedIn = localStorage.getItem("admin_logged_in");

    if (token && isAdminLoggedIn) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Admin-Auth"] = "admin-authenticated";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Perplexity AI proxy call
export async function perplexityChat({ model = 'pplx-70b-online', messages, response_format }) {
  const res = await api.post('/api/auth/ai/perplexity', {
    model,
    messages,
    ...(response_format ? { response_format } : {}),
  });
  return res.data;
}

export default api;
