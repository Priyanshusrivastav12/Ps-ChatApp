import axios from "axios";
import Cookies from "js-cookie";
import apiClient from "../utils/axios.js";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { useTheme } from "../context/ThemeProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_CONFIG } from "../config/api.js";
import ThemeToggle from "./ThemeToggle";
import { 
  FaEye, 
  FaEyeSlash, 
  FaSpinner, 
  FaGoogle, 
  FaGithub, 
  FaUserLock 
} from 'react-icons/fa';

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = API_CONFIG.AXIOS_CONFIG.timeout;

function Login() {
  const [authUser, setAuthUser] = useAuth();
  const { isDark, currentTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const emailInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
    watch,
    setValue
  } = useForm({
    mode: 'onChange'
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  // Auto-focus email field on component mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
    
    // Load saved email from localStorage if remember me was checked
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  // Check for account lockout
  useEffect(() => {
    const lockoutData = localStorage.getItem('loginLockout');
    if (lockoutData) {
      const { attempts, timestamp } = JSON.parse(lockoutData);
      const timeDiff = Date.now() - timestamp;
      const lockoutDuration = 15 * 60 * 1000; // 15 minutes
      
      if (attempts >= 5 && timeDiff < lockoutDuration) {
        setIsLocked(true);
        setLockoutTime(new Date(timestamp + lockoutDuration));
      } else if (timeDiff >= lockoutDuration) {
        // Reset lockout after duration
        localStorage.removeItem('loginLockout');
        setLoginAttempts(0);
      } else {
        setLoginAttempts(attempts);
      }
    }
  }, []);

  // Enhanced email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return true;
  };

  // Enhanced password validation
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return true;
  };

  // Handle forgot password
  const handleForgotPassword = async (email) => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      setIsLoading(true);
      // Simulate API call for forgot password
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Password reset instructions sent to your email");
      setShowForgotPassword(false);
    } catch (error) {
      toast.error("Failed to send reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login attempts and lockout
  const handleLoginAttempt = (success) => {
    if (success) {
      localStorage.removeItem('loginLockout');
      setLoginAttempts(0);
      setIsLocked(false);
    } else {
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
        toast.error("Account temporarily locked due to multiple failed attempts. Try again in 15 minutes.");
      } else {
        toast.error(`Login failed. ${5 - newAttempts} attempts remaining.`);
      }
    }
  };

  const onSubmit = async (data) => {
    if (isLocked) {
      toast.error("Account is temporarily locked. Please try again later.");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    clearErrors();

    const userInfo = {
      email: data.email.toLowerCase().trim(),
      password: data.password,
    };
    
    console.log(`🔐 Attempting login to: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.LOGIN}`);
    
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.USER.LOGIN, userInfo);
      
      if (response.data) {
        console.log("✅ Login response received:", response.data);
        toast.success("✅ Login successful! Welcome back!");
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', data.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Store user data in localStorage
        localStorage.setItem("ChatApp", JSON.stringify(response.data));
        
        // Store JWT token if provided in response (for cross-origin scenarios)
        if (response.data.token) {
          localStorage.setItem("jwt", response.data.token);
          Cookies.set("jwt", response.data.token, { 
            expires: 10,
            secure: window.location.protocol === 'https:',
            sameSite: 'none'
          });
          console.log("🔑 JWT token stored successfully");
        } else {
          console.log("⚠️ No token in response, relying on HTTP-only cookie");
        }
        
        setAuthUser(response.data);
        handleLoginAttempt(true);
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      handleLoginAttempt(false);
      
      if (error.response) {
        const errorMessage = error.response.data.error;
        
        // Handle specific error types
        if (errorMessage.toLowerCase().includes('email')) {
          setError('email', { 
            type: 'server', 
            message: errorMessage 
          });
        } else if (errorMessage.toLowerCase().includes('password')) {
          setError('password', { 
            type: 'server', 
            message: errorMessage 
          });
        } else {
          toast.error("Error: " + errorMessage);
        }
      } else if (error.request) {
        toast.error("Network error: Unable to connect to server. Please check your internet connection.");
      } else {
        toast.error("Login failed: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={`min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200 ${
      isDark ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle size="md" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Security Alert for locked account */}
        {isLocked && (
          <div className={`mb-6 border rounded-lg p-4 text-center transition-colors duration-200 ${
            isDark 
              ? 'bg-red-900/20 border-red-800 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <FaUserLock className="text-xl mx-auto mb-2" />
            <p className="text-sm">
              Account temporarily locked until {lockoutTime?.toLocaleTimeString()}
            </p>
          </div>
        )}

        <div className="text-center">
          <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
            isDark ? 'bg-blue-600' : 'bg-blue-600'
          }`}>
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.172-.266l-5.855 1.955A1.002 1.002 0 014 20.723V17.5A8 8 0 0113 4c4.418 0 8 3.582 8 8z" />
            </svg>
          </div>
          <h2 className={`text-3xl font-bold transition-colors duration-200 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Welcome back</h2>
          <p className={`mt-2 text-sm transition-colors duration-200 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to your account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className={`py-8 px-4 shadow-sm rounded-lg sm:px-10 border transition-colors duration-200 ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-gray-200'
        }`}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLocked || isLoading}
                  placeholder="Enter your email"
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : isDark
                        ? 'border-slate-600 bg-slate-700 text-white'
                        : 'border-gray-300 bg-white'
                  } ${emailValue ? (isDark ? 'bg-slate-600 border-blue-400' : 'bg-blue-50 border-blue-200') : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                  {...register("email", { 
                    required: "Email is required",
                    validate: validateEmail,
                    onChange: () => clearErrors('email')
                  })}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {emailValue && !errors.email ? (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  )}
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="login-password" className={`block text-sm font-medium mb-1 transition-colors duration-200 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isLocked || isLoading}
                  placeholder="Enter your password"
                  className={`appearance-none block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : isDark
                        ? 'border-slate-600 bg-slate-700 text-white'
                        : 'border-gray-300 bg-white'
                  } ${passwordValue ? (isDark ? 'bg-slate-600 border-blue-400' : 'bg-blue-50 border-blue-200') : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
                  {...register("password", { 
                    required: "Password is required",
                    validate: validatePassword,
                    onChange: () => clearErrors('password')
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                    isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  disabled={isLocked || isLoading}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${
                    isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-300'
                  }`}
                  disabled={isLocked || isLoading}
                />
                <span className={`ml-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => handleForgotPassword(emailValue)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
                disabled={isLocked || isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLocked || isLoading || isSubmitting}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-200 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-blue-800'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </span>
                    Sign In
                  </>
                )}
              </button>
            </div>

            {/* Login attempts indicator */}
            {loginAttempts > 0 && !isLocked && (
              <div className={`rounded-lg p-3 text-center border ${
                isDark 
                  ? 'bg-amber-900/20 border-amber-700' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <p className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  ⚠️ {loginAttempts}/5 login attempts used
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDark ? 'border-slate-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 transition-colors duration-200 ${
                  isDark 
                    ? 'bg-slate-800 text-gray-400' 
                    : 'bg-white text-gray-500'
                }`}>or</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className={`w-full py-3 px-4 border rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm ${
                  isDark 
                    ? 'border-slate-600 text-gray-300 bg-slate-700 hover:bg-slate-600' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
                disabled={isLocked || isLoading}
                onClick={() => toast("Google login coming soon!", { 
                  icon: 'ℹ️',
                  duration: 3000 
                })}
              >
                <FaGoogle className="text-red-500" />
                <span>Continue with Google</span>
              </button>
              <button
                type="button"
                className={`w-full py-3 px-4 border rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm ${
                  isDark 
                    ? 'border-slate-600 text-gray-300 bg-slate-700 hover:bg-slate-600' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
                disabled={isLocked || isLoading}
                onClick={() => toast("GitHub login coming soon!", { 
                  icon: 'ℹ️',
                  duration: 3000 
                })}
              >
                <FaGithub className={isDark ? 'text-gray-300' : 'text-gray-800'} />
                <span>Continue with GitHub</span>
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className={`text-sm transition-colors duration-200 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className={`font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  Sign up instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
