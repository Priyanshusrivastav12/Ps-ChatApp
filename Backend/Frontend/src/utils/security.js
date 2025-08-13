/**
 * Security utilities for enhanced authentication
 * Provides security features like rate limiting, device fingerprinting, and more
 */

/**
 * Rate limiting utility
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.storageKey = 'authRateLimit';
  }

  /**
   * Check if action is rate limited
   * @param {string} identifier - Unique identifier (email, IP, etc.)
   * @returns {object} - Rate limit status
   */
  checkRateLimit(identifier) {
    const key = `${this.storageKey}_${identifier}`;
    const data = this.getStoredData(key);
    
    if (!data) {
      return { isLimited: false, attempts: 0, resetTime: null };
    }

    const now = Date.now();
    const { attempts, firstAttempt } = data;

    // Reset if window has passed
    if (now - firstAttempt > this.windowMs) {
      localStorage.removeItem(key);
      return { isLimited: false, attempts: 0, resetTime: null };
    }

    // Check if limit exceeded
    if (attempts >= this.maxAttempts) {
      const resetTime = new Date(firstAttempt + this.windowMs);
      return { 
        isLimited: true, 
        attempts, 
        resetTime,
        remainingTime: resetTime.getTime() - now
      };
    }

    return { isLimited: false, attempts, resetTime: null };
  }

  /**
   * Record an attempt
   * @param {string} identifier - Unique identifier
   * @param {boolean} success - Whether attempt was successful
   */
  recordAttempt(identifier, success = false) {
    const key = `${this.storageKey}_${identifier}`;
    
    if (success) {
      // Clear on successful attempt
      localStorage.removeItem(key);
      return;
    }

    const data = this.getStoredData(key);
    const now = Date.now();

    if (!data || (now - data.firstAttempt > this.windowMs)) {
      // Start new window
      this.setStoredData(key, {
        attempts: 1,
        firstAttempt: now,
        lastAttempt: now
      });
    } else {
      // Increment attempts
      this.setStoredData(key, {
        ...data,
        attempts: data.attempts + 1,
        lastAttempt: now
      });
    }
  }

  getStoredData(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  setStoredData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to store rate limit data:', error);
    }
  }
}

/**
 * Simple device fingerprinting
 * Creates a unique identifier for the device/browser
 */
export const generateDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Device fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    canvas.toDataURL()
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

/**
 * Session security manager
 */
export class SessionSecurity {
  constructor() {
    this.storageKey = 'sessionSecurity';
    this.fingerprintKey = 'deviceFingerprint';
  }

  /**
   * Initialize session security
   */
  initialize() {
    const fingerprint = generateDeviceFingerprint();
    const storedFingerprint = localStorage.getItem(this.fingerprintKey);
    
    if (storedFingerprint && storedFingerprint !== fingerprint) {
      console.warn('Device fingerprint mismatch - potential security risk');
      this.clearSession();
      return false;
    }
    
    localStorage.setItem(this.fingerprintKey, fingerprint);
    this.updateLastActivity();
    return true;
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity() {
    const data = {
      lastActivity: Date.now(),
      fingerprint: generateDeviceFingerprint()
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /**
   * Check if session is valid
   * @param {number} maxInactivity - Max inactivity in ms (default 30 minutes)
   */
  isSessionValid(maxInactivity = 30 * 60 * 1000) {
    try {
      const data = JSON.parse(localStorage.getItem(this.storageKey));
      if (!data) return false;

      const now = Date.now();
      const timeDiff = now - data.lastActivity;
      
      return timeDiff < maxInactivity;
    } catch {
      return false;
    }
  }

  /**
   * Clear session data
   */
  clearSession() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.fingerprintKey);
    localStorage.removeItem('ChatApp');
  }
}

/**
 * Password strength analyzer
 */
export const analyzePasswordSecurity = (password) => {
  const analysis = {
    score: 0,
    feedback: [],
    warnings: [],
    suggestions: []
  };

  if (!password) return analysis;

  // Length analysis
  if (password.length < 8) {
    analysis.warnings.push('Password is too short');
    analysis.suggestions.push('Use at least 8 characters');
  } else if (password.length >= 12) {
    analysis.score += 2;
  } else {
    analysis.score += 1;
  }

  // Character variety
  const patterns = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    numbers: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/
  };

  let varietyScore = 0;
  Object.entries(patterns).forEach(([type, pattern]) => {
    if (pattern.test(password)) {
      varietyScore++;
    } else {
      analysis.suggestions.push(`Add ${type}`);
    }
  });

  analysis.score += varietyScore;

  // Common patterns check
  const commonPatterns = [
    { pattern: /(.)\1{2,}/, warning: 'Contains repeated characters' },
    { pattern: /123|abc|qwe/i, warning: 'Contains common sequences' },
    { pattern: /password|admin|login/i, warning: 'Contains common words' },
    { pattern: /\d{4}/, warning: 'Contains 4+ consecutive digits' }
  ];

  commonPatterns.forEach(({ pattern, warning }) => {
    if (pattern.test(password)) {
      analysis.warnings.push(warning);
      analysis.score -= 1;
    }
  });

  // Dictionary check (simplified)
  const commonPasswords = [
    'password', '123456', 'qwerty', 'abc123', 'password123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon'
  ];

  if (commonPasswords.some(common => 
    password.toLowerCase().includes(common))) {
    analysis.warnings.push('Contains common password patterns');
    analysis.score -= 2;
  }

  // Final score adjustment
  analysis.score = Math.max(0, Math.min(10, analysis.score));

  // Generate feedback
  if (analysis.score >= 8) {
    analysis.feedback.push('Very strong password');
  } else if (analysis.score >= 6) {
    analysis.feedback.push('Strong password');
  } else if (analysis.score >= 4) {
    analysis.feedback.push('Moderate password');
  } else if (analysis.score >= 2) {
    analysis.feedback.push('Weak password');
  } else {
    analysis.feedback.push('Very weak password');
  }

  return analysis;
};

/**
 * Input sanitization
 */
export const sanitizeUserInput = (input, type = 'text') => {
  if (typeof input !== 'string') return '';

  // Basic HTML sanitization
  const htmlSanitized = input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');

  switch (type) {
    case 'email':
      return htmlSanitized.toLowerCase().trim();
    case 'name':
      return htmlSanitized.replace(/[^a-zA-Z\s'-]/g, '').trim();
    case 'password':
      return input; // Don't modify passwords
    default:
      return htmlSanitized.trim();
  }
};

/**
 * CSRF token generator (simple implementation)
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Secure random string generator
 */
export const generateSecureRandom = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
};

/**
 * Check for suspicious activity patterns
 */
export const detectSuspiciousActivity = (activities) => {
  const flags = [];
  
  if (!Array.isArray(activities)) return flags;

  // Rapid successive attempts
  const rapidAttempts = activities.filter(activity => 
    Date.now() - activity.timestamp < 60000 // Within last minute
  );
  
  if (rapidAttempts.length > 10) {
    flags.push('Rapid successive attempts detected');
  }

  // Multiple device fingerprints
  const fingerprints = new Set(activities.map(a => a.fingerprint).filter(Boolean));
  if (fingerprints.size > 3) {
    flags.push('Multiple devices detected');
  }

  // Time-based patterns
  const hours = activities.map(a => new Date(a.timestamp).getHours());
  const uniqueHours = new Set(hours);
  if (uniqueHours.size === 1 && activities.length > 20) {
    flags.push('Unusual time pattern detected');
  }

  return flags;
};

// Initialize security
export const initializeSecurity = () => {
  const sessionSecurity = new SessionSecurity();
  const rateLimiter = new RateLimiter();
  
  // Initialize session
  sessionSecurity.initialize();
  
  // Set up activity monitoring
  const updateActivity = () => sessionSecurity.updateLastActivity();
  
  // Monitor user activity
  ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });
  
  // Check session validity periodically
  setInterval(() => {
    if (!sessionSecurity.isSessionValid()) {
      sessionSecurity.clearSession();
      window.location.reload();
    }
  }, 60000); // Check every minute
  
  return { sessionSecurity, rateLimiter };
};

export default {
  RateLimiter,
  SessionSecurity,
  generateDeviceFingerprint,
  analyzePasswordSecurity,
  sanitizeUserInput,
  generateCSRFToken,
  generateSecureRandom,
  detectSuspiciousActivity,
  initializeSecurity
};
