import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  withCredentials: true, 
});

export default api;
// http://192.168.1.9:5000
// http://localhost:5000