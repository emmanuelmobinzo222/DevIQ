import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }
};

// Rides API
export const ridesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/rides', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/rides/${id}`);
    return response.data;
  },
  
  create: async (rideData) => {
    const response = await api.post('/rides', rideData);
    return response.data;
  }
};

// Bookings API
export const bookingsAPI = {
  bookRide: async (rideId, bookingData) => {
    const response = await api.post(`/bookings/rides/${rideId}/book`, bookingData);
    return response.data;
  },
  
  getHistory: async (userId) => {
    const response = await api.get(`/bookings/users/${userId}/history`);
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
};

export default api;
