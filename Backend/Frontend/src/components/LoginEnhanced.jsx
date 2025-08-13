import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthProvider";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_CONFIG } from "../config/api.js";
import { 
  FaEye, 
  FaEyeSlash, 
  FaSpinner, 
  FaGoogle, 
  FaGithub, 
  FaShieldAlt,
  FaUserLock 
} from 'react-icons/fa';
import { validateEmailRealtime, getFieldValidationClass } from '../utils/validation';
import { RateLimiter } from '../utils/security';

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = API_CONFIG.AXIOS_CONFIG.timeout;

function LoginEnhanced() {
  const [authUser, setAuthUser] = useAuth();
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
      const response = await axios.post(API_CONFIG.ENDPOINTS.USER.LOGIN, userInfo);
      
      if (response.data) {
        toast.success("✅ Login successful! Welcome back!");
        
        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', data.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        localStorage.setItem("ChatApp", JSON.stringify(response.data));
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 grid-pattern"></div>

        <div className="relative z-10 w-full max-w-md">
          {/* Security Alert for locked account */}
          {isLocked && (
            <div className="mb-6 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-4 text-center">
              <FaUserLock className="text-red-400 text-2xl mx-auto mb-2" />
              <p className="text-red-400 text-sm">
                Account temporarily locked until {lockoutTime?.toLocaleTimeString()}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-10 rounded-2xl space-y-6 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
            noValidate
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <FaShieldAlt className="text-blue-400 text-2xl mr-2" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Chat<span className="text-emerald-400">App</span>
                </h1>
              </div>
              <h2 className="text-xl text-white font-semibold">Welcome Back</h2>
              <p className="text-white/60 text-sm mt-2">Sign in to continue your conversations</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">
                Email Address
                <span className="text-red-400 ml-1" aria-label="required">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-5 h-5 text-white/40"
                    aria-hidden="true"
                  >
                    <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                    <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                  </svg>
                </div>
                <input
                  ref={emailInputRef}
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={isLocked || isLoading}
                  className={`w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email 
                      ? 'border-red-400 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500'
                  } ${emailValue && !errors.email ? 'border-green-400' : ''}`}
                  placeholder="Enter your email address"
                  aria-describedby={errors.email ? "email-error" : "email-help"}
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email", { 
                    required: "Email is required",
                    validate: validateEmail,
                    onChange: () => clearErrors('email')
                  })}
                />
                {emailValue && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              {!errors.email && (
                <p id="email-help" className="text-white/40 text-xs">
                  We'll never share your email with anyone else.
                </p>
              )}
              {errors.email && (
                <div id="email-error" className="text-red-400 text-sm font-medium flex items-center" role="alert">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">
                Password
                <span className="text-red-400 ml-1" aria-label="required">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-5 h-5 text-white/40"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isLocked || isLoading}
                  className={`w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password 
                      ? 'border-red-400 focus:ring-red-500' 
                      : 'border-white/20 focus:ring-purple-500'
                  } ${passwordValue && !errors.password ? 'border-green-400' : ''}`}
                  placeholder="Enter your password"
                  aria-describedby={errors.password ? "password-error" : "password-help"}
                  aria-invalid={errors.password ? "true" : "false"}
                  {...register("password", { 
                    required: "Password is required",
                    validate: validatePassword,
                    onChange: () => clearErrors('password')
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/70 transition-colors disabled:opacity-50"
                  disabled={isLocked || isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                </button>
              </div>
              {!errors.password && (
                <p id="password-help" className="text-white/40 text-xs">
                  Must be at least 6 characters long.
                </p>
              )}
              {errors.password && (
                <div id="password-error" className="text-red-400 text-sm font-medium flex items-center" role="alert">
                  <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                  disabled={isLocked || isLoading}
                />
                <span className="text-white/80 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => handleForgotPassword(emailValue)}
                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors disabled:opacity-50"
                disabled={isLocked || isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              name="login-submit"
              type="submit"
              disabled={isLocked || isLoading || isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Login attempts indicator */}
            {loginAttempts > 0 && !isLocked && (
              <div className="text-center">
                <p className="text-amber-400 text-sm">
                  ⚠️ {loginAttempts}/5 login attempts used
                </p>
              </div>
            )}

            {/* Social Login Section */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/10 backdrop-blur-sm text-white/60 rounded-lg">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                disabled={isLocked || isLoading}
                onClick={() => toast.info("Google login coming soon!")}
              >
                <FaGoogle className="text-red-400" />
                <span className="text-sm">Google</span>
              </button>
              <button
                type="button"
                className="w-full py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                disabled={isLocked || isLoading}
                onClick={() => toast.info("GitHub login coming soon!")}
              >
                <FaGithub className="text-gray-300" />
                <span className="text-sm">GitHub</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-white/60 text-sm">
                New to ChatApp?{' '}
                <Link
                  to="/signup"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                >
                  Create your account here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Inline styles for grid pattern */}
        <style>
          {`
            .grid-pattern {
              background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.02)'%3e%3cpath d='m0 .5h32m0 32v-32m-32 0v32'/%3e%3c/svg%3e");
              background-size: 50px 50px;
            }
          `}
        </style>
      </div>
    </>
  );
}

export default LoginEnhanced;
