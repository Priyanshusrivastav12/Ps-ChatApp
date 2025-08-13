/**
 * Form validation utilities for enhanced authentication
 * Provides comprehensive validation rules and feedback
 */

export const ValidationRules = {
  // Email validation
  email: {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address"
    },
    maxLength: {
      value: 254,
      message: "Email is too long"
    },
    validate: (value) => {
      // Additional custom validations
      const trimmed = value.trim().toLowerCase();
      
      // Check for common typos
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const domain = trimmed.split('@')[1];
      
      if (domain && domain.includes('..')) {
        return "Invalid email format";
      }
      
      return true;
    }
  },

  // Password validation
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long"
    },
    maxLength: {
      value: 128,
      message: "Password is too long"
    },
    validate: (value) => {
      // Check for common weak passwords
      const weakPasswords = ['password', '123456', 'qwerty', 'abc123'];
      if (weakPasswords.includes(value.toLowerCase())) {
        return "Please choose a stronger password";
      }
      
      return true;
    }
  },

  // Strong password validation (for signup)
  strongPassword: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long"
    },
    validate: (value) => {
      const checks = {
        length: value.length >= 8,
        lowercase: /[a-z]/.test(value),
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };

      const passedChecks = Object.values(checks).filter(Boolean).length;
      
      if (passedChecks < 3) {
        return "Password must contain at least 3 of: lowercase, uppercase, number, special character";
      }
      
      return true;
    }
  },

  // Full name validation
  fullName: {
    required: "Full name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters"
    },
    maxLength: {
      value: 50,
      message: "Name is too long"
    },
    pattern: {
      value: /^[a-zA-Z\s'.-]+$/,
      message: "Name can only contain letters, spaces, apostrophes, and hyphens"
    }
  }
};

/**
 * Password strength calculator
 * @param {string} password - The password to check
 * @returns {object} - Strength score and feedback
 */
export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: "Enter a password", color: "gray" };

  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) {
    score += 2;
  } else if (password.length >= 6) {
    score += 1;
    feedback.push("Use at least 8 characters");
  } else {
    feedback.push("Too short (minimum 6 characters)");
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push("Add uppercase letters");

  if (/\d/.test(password)) score += 1;
  else feedback.push("Add numbers");

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push("Add special characters");

  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
    feedback.push("Avoid repeated characters");
  }

  if (/123|abc|qwe|zxc/i.test(password)) {
    score -= 1;
    feedback.push("Avoid common patterns");
  }

  // Determine strength
  let strength, color;
  if (score >= 5) {
    strength = "Very Strong";
    color = "green";
  } else if (score >= 4) {
    strength = "Strong";
    color = "blue";
  } else if (score >= 3) {
    strength = "Medium";
    color = "yellow";
  } else if (score >= 2) {
    strength = "Weak";
    color = "orange";
  } else {
    strength = "Very Weak";
    color = "red";
  }

  return {
    score,
    strength,
    color,
    feedback: feedback.slice(0, 2) // Show top 2 suggestions
  };
};

/**
 * Real-time email validation
 * @param {string} email - The email to validate
 * @returns {object} - Validation result
 */
export const validateEmailRealtime = (email) => {
  if (!email) return { isValid: false, message: "" };

  const trimmed = email.trim().toLowerCase();
  
  // Basic format check
  if (!trimmed.includes('@')) {
    return { isValid: false, message: "Email must contain @" };
  }

  const [localPart, domain] = trimmed.split('@');
  
  if (!localPart) {
    return { isValid: false, message: "Email must have text before @" };
  }

  if (!domain) {
    return { isValid: false, message: "Email must have domain after @" };
  }

  if (!domain.includes('.')) {
    return { isValid: false, message: "Domain must contain a period" };
  }

  // Full validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: "Invalid email format" };
  }

  return { isValid: true, message: "Valid email format" };
};

/**
 * Suggestions for common email typos
 * @param {string} email - The email to check
 * @returns {string|null} - Suggested correction or null
 */
export const suggestEmailCorrection = (email) => {
  if (!email || !email.includes('@')) return null;

  const [localPart, domain] = email.toLowerCase().split('@');
  
  const commonDomains = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outloo.com': 'outlook.com'
  };

  if (commonDomains[domain]) {
    return `${localPart}@${commonDomains[domain]}`;
  }

  return null;
};

/**
 * Form field validation state helper
 * @param {object} error - Field error object
 * @param {string} value - Field value
 * @returns {string} - CSS class for styling
 */
export const getFieldValidationClass = (error, value) => {
  if (error) return 'border-red-400 focus:ring-red-500';
  if (value && !error) return 'border-green-400 focus:ring-green-500';
  return 'border-white/20 focus:ring-purple-500';
};

/**
 * Sanitize input values
 * @param {string} value - Input value
 * @param {string} type - Input type
 * @returns {string} - Sanitized value
 */
export const sanitizeInput = (value, type = 'text') => {
  if (!value) return '';

  switch (type) {
    case 'email':
      return value.trim().toLowerCase();
    case 'name':
      return value.trim().replace(/\s+/g, ' ');
    case 'password':
      return value; // Don't modify passwords
    default:
      return value.trim();
  }
};

/**
 * Check if form is ready for submission
 * @param {object} formState - React Hook Form state
 * @param {object} values - Form values
 * @returns {boolean} - Whether form can be submitted
 */
export const isFormReady = (formState, values) => {
  const { errors, isDirty, isValid } = formState;
  const hasRequiredFields = values.email && values.password;
  
  return isDirty && isValid && hasRequiredFields && Object.keys(errors).length === 0;
};

export default {
  ValidationRules,
  calculatePasswordStrength,
  validateEmailRealtime,
  suggestEmailCorrection,
  getFieldValidationClass,
  sanitizeInput,
  isFormReady
};
