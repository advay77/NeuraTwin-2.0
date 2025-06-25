import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.ronitrox.xyz',
  withCredentials: true,
});

export default api;
// http://192.168.1.9:5000
// http://localhost:5000
// http://74.225.162.133/
//https://backend.ronitrox.xyz