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
        
        // Also store JWT token if provided in response (fallback for cross-origin issues)
        if (response.data.token) {
          localStorage.setItem("jwt", response.data.token);
          Cookies.set("jwt", response.data.token, { 
            expires: 10,
            secure: window.location.protocol === 'https:',
            sameSite: 'none'
          });
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
    <>
      <div className={`min-h-screen flex items-center justify-center p-4 relative transition-colors duration-200 ${
        isDark ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        
        <div className="relative z-10 w-full max-w-md">
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

          <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-200 ${
            isDark 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-gray-100'
          }`}>
            {/* Header Section */}
            <div className={`px-8 py-12 text-center ${
              isDark 
                ? 'bg-slate-800 border-b border-slate-700' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
            }`}>
              <div className="flex items-center justify-center mb-4">
                <div className={`rounded-full p-3 shadow-lg ${
                  isDark ? 'bg-slate-700' : 'bg-white'
                }`}>
                  <svg className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                  </svg>
                </div>
              </div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-white'
              }`}>
                ChatApp
              </h1>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-blue-100'
              }`}>Connect with friends and family</p>
            </div>

            {/* Form Section */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`px-8 py-8 space-y-6 ${
                isDark ? 'bg-slate-800' : 'bg-white'
              }`}
              noValidate
            >
              <div className="text-center mb-6">
                <h2 className={`text-2xl font-semibold mb-2 transition-colors duration-200 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>Welcome back</h2>
                <p className={`text-sm transition-colors duration-200 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Sign in to your account</p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium transition-colors duration-200 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email or phone number
                </label>
                <div className="relative">
                  <input
                    ref={emailInputRef}
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled={isLocked || isLoading}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                      errors.email 
                        ? 'border-red-300 focus:border-red-500' 
                        : emailValue && !errors.email 
                          ? 'border-green-300 focus:border-green-500'
                          : isDark
                            ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                            : 'border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter your email"
                    {...register("email", { 
                      required: "Email is required",
                      validate: validateEmail,
                      onChange: () => clearErrors('email')
                    })}
                  />
                  {emailValue && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <div className="text-red-500 text-sm flex items-center mt-1">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isLocked || isLoading}
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-all duration-200 ${
                      errors.password 
                        ? 'border-red-300 focus:border-red-500' 
                        : passwordValue && !errors.password 
                          ? 'border-green-300 focus:border-green-500'
                          : isDark
                            ? 'border-slate-600 focus:border-blue-500 bg-slate-700 text-white placeholder-gray-400'
                            : 'border-gray-200 focus:border-blue-500 bg-gray-50 focus:bg-white text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    placeholder="Enter your password"
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
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-red-500 text-sm flex items-center mt-1">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </div>
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
                  className={`text-sm font-medium ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                  disabled={isLocked || isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLocked || isLoading || isSubmitting}
                className={`w-full py-3 px-4 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

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
                  <span className={`px-2 ${
                    isDark 
                      ? 'bg-slate-900 text-gray-400' 
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
            </form>

            {/* Footer */}
            <div className={`px-8 py-6 text-center border-t transition-colors duration-200 ${
              isDark 
                ? 'bg-gray-900/50 border-gray-700' 
                : 'bg-gray-50 border-gray-100'
            }`}>
              <p className={`text-sm transition-colors duration-200 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className={`font-medium transition-colors duration-200 ${
                    isDark 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  Sign up
                </Link>
              </p>
              <p className={`text-xs mt-2 transition-colors duration-200 ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Background pattern styles */}
        <style>
          {`
            .bg-pattern {
              background-image: url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%239C92AC' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e");
            }
          `}
        </style>
      </div>
    </>
  );
}

export default Login;
