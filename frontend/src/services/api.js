import axios from 'axios';

const API_BASE_URL = 'https://sweet-shop-y6vp.vercel.app/';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Sweets API
export const sweetsAPI = {
  getAll: () => api.get('/sweets'),
  search: (params) => api.get('/sweets/search', { params }),
  create: (sweetData) => api.post('/sweets', sweetData),
  update: (id, sweetData) => api.put(`/sweets/${id}`, sweetData),
  delete: (id) => api.delete(`/sweets/${id}`),
  purchase: (id) => api.post(`/sweets/${id}/purchase`),
  restock: (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity }),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (sweetId, quantity) => api.post('/cart/add', { sweetId, quantity }),
  updateCart: (sweetId, quantity) => api.put('/cart/update', { sweetId, quantity }),
  removeFromCart: (sweetId) => api.delete(`/cart/remove/${sweetId}`),
  clearCart: () => api.delete('/cart/clear'),
  checkout: () => api.post('/cart/checkout'),
};

export default api;
