import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ronitrox.xyz',
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    return config;
  }

  const token = localStorage.getItem('auth-token') ?? undefined;
  config.headers.Authorization = token ? `Bearer ${token}` : '';

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      return error.response;
    }
    return Promise.reject(error);
  }
);

export default api;
// http://192.168.1.9:5000
// http://localhost:5000
// http://74.225.162.133/
//https://backend.ronitrox.xyz
