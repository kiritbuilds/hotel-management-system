import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - auto logout on token expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Room APIs
export const roomAPI = {
  getAll: (params) => API.get('/rooms', { params }),
  getById: (id) => API.get(`/rooms/${id}`),
  getStats: () => API.get('/rooms/stats'),
  create: (data) => API.post('/rooms', data),
  update: (id, data) => API.put(`/rooms/${id}`, data),
  delete: (id) => API.delete(`/rooms/${id}`),
};

// Booking APIs
export const bookingAPI = {
  create: (data) => API.post('/bookings', data),
  getAll: (params) => API.get('/bookings', { params }),
  getMy: () => API.get('/bookings/my'),
  getById: (id) => API.get(`/bookings/${id}`),
  updateStatus: (id, data) => API.put(`/bookings/${id}/status`, data),
  cancel: (id, data) => API.put(`/bookings/${id}/cancel`, data),
  getDashboardStats: () => API.get('/bookings/dashboard-stats'),
};

// User APIs
export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
  createStaff: (data) => API.post('/users/staff', data),
};

export default API;