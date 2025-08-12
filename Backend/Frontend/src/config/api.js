// API Configuration Helper
// This file centralizes all API-related configuration

const getEnvironment = () => {
  return import.meta.env.VITE_NODE_ENV || 'development';
};

const getApiBaseUrl = () => {
  const env = getEnvironment();
  if (env === 'production') {
    return import.meta.env.VITE_API_BASE_URL || 'https://ps-chatapp.onrender.com';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
};

const getSocketUrl = () => {
  const env = getEnvironment();
  if (env === 'production') {
    return import.meta.env.VITE_SOCKET_URL || 'https://ps-chatapp.onrender.com';
  }
  return import.meta.env.VITE_SOCKET_URL || 'http://localhost:4001';
};

// API endpoints
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  SOCKET_URL: getSocketUrl(),
  ENVIRONMENT: getEnvironment(),
  
  // API Endpoints
  ENDPOINTS: {
    // User endpoints
    USER: {
      SIGNUP: '/api/user/signup',
      LOGIN: '/api/user/login',
      LOGOUT: '/api/user/logout',
      ALL_USERS: '/api/user/allusers',
    },
    
    // Message endpoints
    MESSAGE: {
      SEND: (id) => `/api/message/send/${id}`,
      GET: (id) => `/api/message/get/${id}`,
    },
    
    // Health check
    HEALTH: '/health',
    API_INFO: '/api',
  },
  
  // Axios configuration
  AXIOS_CONFIG: {
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

// Debug information (only in development)
if (API_CONFIG.ENVIRONMENT === 'development') {
  console.log('🔧 API Configuration:', {
    environment: API_CONFIG.ENVIRONMENT,
    baseUrl: API_CONFIG.BASE_URL,
    socketUrl: API_CONFIG.SOCKET_URL,
  });
}

export default API_CONFIG;
