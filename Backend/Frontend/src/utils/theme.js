// Theme utility functions for consistent styling across components

/**
 * Get theme-aware class names for common UI patterns
 */
export const getThemeClasses = (isDark) => ({
  // Background classes
  bg: {
    primary: isDark ? 'bg-slate-900' : 'bg-white',
    secondary: isDark ? 'bg-slate-800' : 'bg-gray-50',
    tertiary: isDark ? 'bg-slate-700' : 'bg-gray-100',
    quaternary: isDark ? 'bg-slate-600' : 'bg-gray-200',
    drawer: isDark ? 'bg-slate-900' : 'bg-white',
    chat: isDark ? 'bg-slate-800' : 'bg-gray-50',
    header: isDark ? 'bg-slate-900/95' : 'bg-white/95',
    sidebar: isDark ? 'bg-slate-900' : 'bg-white',
    input: isDark ? 'bg-slate-700' : 'bg-white',
    card: isDark ? 'bg-slate-800' : 'bg-white',
    modal: isDark ? 'bg-slate-800' : 'bg-white',
    overlay: isDark ? 'bg-black/50' : 'bg-gray-900/50',
    hover: isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100',
    active: isDark ? 'bg-slate-600' : 'bg-gray-200'
  },
  
  // Text classes
  text: {
    primary: isDark ? 'text-white' : 'text-gray-900',
    secondary: isDark ? 'text-gray-300' : 'text-gray-700',
    tertiary: isDark ? 'text-gray-400' : 'text-gray-600',
    muted: isDark ? 'text-gray-500' : 'text-gray-500',
    inverse: isDark ? 'text-gray-900' : 'text-white',
    accent: isDark ? 'text-blue-400' : 'text-blue-600',
    success: isDark ? 'text-green-400' : 'text-green-600',
    warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
    error: isDark ? 'text-red-400' : 'text-red-600'
  },
  
  // Border classes
  border: {
    primary: isDark ? 'border-slate-700' : 'border-gray-200',
    secondary: isDark ? 'border-slate-600' : 'border-gray-300',
    hover: isDark ? 'hover:border-slate-500' : 'hover:border-gray-400',
    focus: isDark ? 'focus:border-blue-500' : 'focus:border-blue-500',
    accent: isDark ? 'border-blue-500' : 'border-blue-500',
    success: isDark ? 'border-green-500' : 'border-green-500',
    warning: isDark ? 'border-yellow-500' : 'border-yellow-500',
    error: isDark ? 'border-red-500' : 'border-red-500'
  },
  
  // Button classes
  button: {
    primary: isDark 
      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
      : 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: isDark 
      ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600' 
      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300',
    ghost: isDark 
      ? 'text-gray-300 hover:text-white hover:bg-slate-700' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: isDark 
      ? 'bg-red-600 hover:bg-red-700 text-white' 
      : 'bg-red-600 hover:bg-red-700 text-white'
  },
  
  // Input classes
  input: {
    base: isDark 
      ? 'appearance-none block w-full px-4 py-3 border bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20' 
      : 'appearance-none block w-full px-4 py-3 border bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20',
    error: isDark 
      ? 'appearance-none block w-full px-4 py-3 border bg-red-900/20 border-red-500 text-white placeholder-red-400 focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20' 
      : 'appearance-none block w-full px-4 py-3 border bg-red-50 border-red-300 text-gray-900 placeholder-red-400 focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20',
    success: isDark 
      ? 'appearance-none block w-full px-4 py-3 border bg-green-900/20 border-green-500 text-white focus:outline-none focus:ring-2 focus:border-green-500 focus:ring-green-500/20' 
      : 'appearance-none block w-full px-4 py-3 border bg-green-50 border-green-300 text-gray-900 focus:outline-none focus:ring-2 focus:border-green-500 focus:ring-green-500/20'
  },
  
  // Card/Modal classes
  card: {
    base: isDark 
      ? 'bg-slate-800 border-slate-700 shadow-xl' 
      : 'bg-white border-gray-200 shadow-lg',
    hover: isDark 
      ? 'hover:bg-slate-700 hover:shadow-2xl' 
      : 'hover:bg-gray-50 hover:shadow-xl'
  },
  
  // Message bubble classes
  message: {
    sent: isDark 
      ? 'bg-blue-600 text-white' 
      : 'bg-blue-600 text-white',
    received: isDark 
      ? 'bg-slate-700 text-white' 
      : 'bg-white text-gray-900 border border-gray-200',
    timestamp: isDark 
      ? 'text-gray-400' 
      : 'text-gray-500'
  },
  
  // Scrollbar classes
  scrollbar: {
    track: isDark ? 'bg-slate-800' : 'bg-gray-100',
    thumb: isDark ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-400 hover:bg-gray-500'
  }
});

/**
 * Get consistent shadow classes based on theme
 */
export const getShadowClasses = (isDark, variant = 'default') => {
  const shadows = {
    default: isDark ? 'shadow-2xl shadow-black/25' : 'shadow-lg shadow-gray-900/10',
    hover: isDark ? 'hover:shadow-3xl hover:shadow-black/40' : 'hover:shadow-xl hover:shadow-gray-900/20',
    focus: isDark ? 'focus:shadow-lg focus:shadow-blue-500/25' : 'focus:shadow-lg focus:shadow-blue-500/25',
    inner: isDark ? 'shadow-inner shadow-black/25' : 'shadow-inner shadow-gray-900/10'
  };
  
  return shadows[variant] || shadows.default;
};

/**
 * Get glass morphism effect classes
 */
export const getGlassClasses = (isDark, opacity = 'default') => {
  const opacities = {
    light: isDark ? 'bg-white/5' : 'bg-white/70',
    default: isDark ? 'bg-white/10' : 'bg-white/80',
    heavy: isDark ? 'bg-white/20' : 'bg-white/90'
  };
  
  const blur = 'backdrop-blur-lg';
  const border = isDark ? 'border border-white/10' : 'border border-white/20';
  
  return `${opacities[opacity] || opacities.default} ${blur} ${border}`;
};

/**
 * Get transition classes for smooth theme switching
 */
export const getTransitionClasses = (properties = ['colors']) => {
  const transitions = {
    colors: 'transition-colors duration-200',
    all: 'transition-all duration-200',
    transform: 'transition-transform duration-200',
    opacity: 'transition-opacity duration-200',
    shadow: 'transition-shadow duration-200'
  };
  
  return properties.map(prop => transitions[prop] || transitions.colors).join(' ');
};

/**
 * Generate consistent spacing classes
 */
export const getSpacingClasses = (size = 'md') => {
  const spacing = {
    xs: 'p-2 gap-2',
    sm: 'p-3 gap-3',
    md: 'p-4 gap-4',
    lg: 'p-6 gap-6',
    xl: 'p-8 gap-8'
  };
  
  return spacing[size] || spacing.md;
};

/**
 * Get loading state classes
 */
export const getLoadingClasses = (isDark) => ({
  skeleton: isDark 
    ? 'bg-slate-700 animate-pulse' 
    : 'bg-gray-200 animate-pulse',
  spinner: isDark 
    ? 'text-blue-400' 
    : 'text-blue-600'
});

/**
 * Get focus ring classes for accessibility
 */
export const getFocusClasses = (isDark) => 
  isDark 
    ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800' 
    : 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white';

/**
 * Generate complete theme class combinations for common components
 */
export const getComponentClasses = (isDark) => ({
  page: `min-h-screen ${getThemeClasses(isDark).bg.primary} ${getThemeClasses(isDark).text.primary} ${getTransitionClasses(['colors'])}`,
  
  header: `${getThemeClasses(isDark).bg.header} ${getThemeClasses(isDark).text.primary} ${getThemeClasses(isDark).border.primary} border-b backdrop-blur-sm ${getTransitionClasses(['colors'])}`,
  
  sidebar: `${getThemeClasses(isDark).bg.sidebar} ${getThemeClasses(isDark).text.primary} ${getThemeClasses(isDark).border.primary} ${getTransitionClasses(['colors'])}`,
  
  card: `${getThemeClasses(isDark).card.base} rounded-lg ${getTransitionClasses(['colors', 'shadow'])}`,
  
  modal: `${getThemeClasses(isDark).bg.modal} ${getThemeClasses(isDark).text.primary} rounded-lg ${getShadowClasses(isDark)} ${getTransitionClasses(['colors'])}`,
  
  input: `${getThemeClasses(isDark).input.base} rounded-md ${getTransitionClasses(['colors', 'shadow'])}`,
  
  button: {
    primary: `${getThemeClasses(isDark).button.primary} px-4 py-2 rounded-md font-medium ${getTransitionClasses(['colors', 'transform'])} ${getFocusClasses(isDark)}`,
    secondary: `${getThemeClasses(isDark).button.secondary} px-4 py-2 rounded-md font-medium ${getTransitionClasses(['colors', 'transform'])} ${getFocusClasses(isDark)}`,
    ghost: `${getThemeClasses(isDark).button.ghost} px-3 py-2 rounded-md ${getTransitionClasses(['colors'])} ${getFocusClasses(isDark)}`
  }
});

export default {
  getThemeClasses,
  getShadowClasses,
  getGlassClasses,
  getTransitionClasses,
  getSpacingClasses,
  getLoadingClasses,
  getFocusClasses,
  getComponentClasses
};
