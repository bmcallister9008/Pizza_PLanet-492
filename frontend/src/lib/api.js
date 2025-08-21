import axios from 'axios';

// If frontend served from a different origin (e.g., Vite on :5173), set baseURL:
const baseURL = import.meta?.env?.VITE_API_URL || ''; // '' = same origin

const api = axios.create({
  baseURL,
  withCredentials: true, // send/receive cookies
});

export default api;
