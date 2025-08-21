import axios from 'axios';
import Cookies from 'js-cookie';
import { API_CONFIG } from '../config/api.js';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.AXIOS_CONFIG.timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from multiple sources
    const cookieToken = Cookies.get('jwt');
    const localStorageToken = localStorage.getItem('jwt');
    const token = cookieToken || localStorageToken;
    
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added Authorization header to request');
    } else if (!token) {
      console.log('⚠️ No JWT token found in cookies or localStorage');
    }
    
    // Ensure credentials are included for cookie-based auth
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔐 Authentication failed - 401 Unauthorized');
      console.log('🔍 Current tokens:', {
        cookie: !!Cookies.get('jwt'),
        localStorage: !!localStorage.getItem('jwt')
      });
      
      // Clear all authentication data
      Cookies.remove('jwt');
      localStorage.removeItem('jwt');
      localStorage.removeItem('ChatApp');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        console.log('🔄 Redirecting to login page');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
