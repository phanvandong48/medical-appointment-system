import axios from 'axios';

// Cấu hình URL API
const API_URL = 'https://medical-appointment-system-api.onrender.com';

// Tạo instance Axios với baseURL đã cấu hình
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để xử lý token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export instance đã cấu hình
export default api; 