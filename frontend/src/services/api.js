import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
})

// Otomatis tambah token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Tambahkan token ke header Authorization
  }
  return config;
});

export default api;