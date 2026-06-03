import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true // Important for sending/receiving HTTP-only cookies
});

export default api;
