import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import toast from 'react-hot-toast';

/**
 * Enhanced authentication hook with additional security features
 * Provides login state management, rate limiting, and session handling
 */
export const useAuthEnhanced = () => {
  const [authUser, setAuthUser] = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Session management
  useEffect(() => {
    const checkSession = () => {
      const chatAppData = localStorage.getItem('ChatApp');
      if (chatAppData) {
        try {
          const userData = JSON.parse(chatAppData);
          const loginTime = userData.loginTime || Date.now();
          const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
          
          if (Date.now() - loginTime > sessionDuration) {
            handleLogout('Session expired. Please login again.');
          } else {
            // Set timeout for remaining session time
            const remainingTime = sessionDuration - (Date.now() - loginTime);
            setSessionTimeout(remainingTime);
          }
        } catch (error) {
          console.error('Invalid session data:', error);
          handleLogout('Invalid session. Please login again.');
        }
      }
    };

    checkSession();
    
    // Check session every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check for account lockout on initialization
  useEffect(() => {
    const lockoutData = localStorage.getItem('loginLockout');
    if (lockoutData) {
      try {
        const { attempts, timestamp } = JSON.parse(lockoutData);
        const timeDiff = Date.now() - timestamp;
        const lockoutDuration = 15 * 60 * 1000; // 15 minutes
        
        if (attempts >= 5 && timeDiff < lockoutDuration) {
          setIsLocked(true);
          setLockoutTime(new Date(timestamp + lockoutDuration));
          setLoginAttempts(attempts);
        } else if (timeDiff >= lockoutDuration) {
          // Reset lockout after duration
          localStorage.removeItem('loginLockout');
          setLoginAttempts(0);
          setIsLocked(false);
        } else {
          setLoginAttempts(attempts);
        }
      } catch (error) {
        console.error('Invalid lockout data:', error);
        localStorage.removeItem('loginLockout');
      }
    }
  }, []);

  // Handle login with enhanced security
  const handleLogin = useCallback(async (credentials, rememberMe = false) => {
    if (isLocked) {
      throw new Error('Account is temporarily locked. Please try again later.');
    }

    setIsLoading(true);

    try {
      // This would be your actual login API call
      const response = await loginUser(credentials);
      
      if (response.data) {
        // Add login timestamp for session management
        const userDataWithTimestamp = {
          ...response.data,
          loginTime: Date.now(),
          rememberMe
        };

        localStorage.setItem('ChatApp', JSON.stringify(userDataWithTimestamp));
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', credentials.email);
        }

        setAuthUser(userDataWithTimestamp);
        
        // Reset login attempts on successful login
        localStorage.removeItem('loginLockout');
        setLoginAttempts(0);
        setIsLocked(false);
        
        toast.success('✅ Login successful! Welcome back!');
        return response.data;
      }
    } catch (error) {
      // Handle failed login attempt
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        const lockoutData = {
          attempts: newAttempts,
          timestamp: Date.now()
        };
        localStorage.setItem('loginLockout', JSON.stringify(lockoutData));
        setIsLocked(true);
        setLockoutTime(new Date(Date.now() + 15 * 60 * 1000));
        toast.error('Account temporarily locked due to multiple failed attempts. Try again in 15 minutes.');
      } else {
        const remainingAttempts = 5 - newAttempts;
        toast.error(`Login failed. ${remainingAttempts} attempts remaining.`);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [authUser, isLocked, loginAttempts, setAuthUser]);

  // Handle logout
  const handleLogout = useCallback((message = 'Logged out successfully') => {
    localStorage.removeItem('ChatApp');
    localStorage.removeItem('rememberedEmail');
    setAuthUser(null);
    setSessionTimeout(null);
    toast.success(message);
  }, [setAuthUser]);

  // Get remembered email
  const getRememberedEmail = useCallback(() => {
    return localStorage.getItem('rememberedEmail') || '';
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!authUser && !!authUser.user;
  }, [authUser]);

  // Get user info
  const getUserInfo = useCallback(() => {
    return authUser?.user || null;
  }, [authUser]);

  // Check session validity
  const isSessionValid = useCallback(() => {
    if (!authUser) return false;
    
    const loginTime = authUser.loginTime || Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
    
    return Date.now() - loginTime < sessionDuration;
  }, [authUser]);

  // Refresh session
  const refreshSession = useCallback(() => {
    if (authUser) {
      const refreshedData = {
        ...authUser,
        loginTime: Date.now()
      };
      localStorage.setItem('ChatApp', JSON.stringify(refreshedData));
      setAuthUser(refreshedData);
    }
  }, [authUser, setAuthUser]);

  return {
    // State
    authUser,
    isLoading,
    loginAttempts,
    isLocked,
    lockoutTime,
    sessionTimeout,
    
    // Actions
    handleLogin,
    handleLogout,
    refreshSession,
    
    // Getters
    getRememberedEmail,
    getUserInfo,
    
    // Checkers
    isAuthenticated,
    isSessionValid,
    
    // Utils
    remainingAttempts: Math.max(0, 5 - loginAttempts),
    timeUntilUnlock: lockoutTime ? Math.max(0, lockoutTime.getTime() - Date.now()) : 0
  };
};

// Mock login function - replace with your actual API call
const loginUser = async (credentials) => {
  // This is a placeholder - replace with your actual login API
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};

export default useAuthEnhanced;
