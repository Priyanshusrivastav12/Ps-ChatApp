import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const THEME_STORAGE_KEY = 'chatapp-theme-preferences';

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

const FONT_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
};

const FONT_SIZE_CONFIG = {
  [FONT_SIZES.SMALL]: {
    label: 'Small',
    scale: '0.875rem', // 14px
    config: {
      '--font-xs': '0.75rem',    // 12px
      '--font-sm': '0.875rem',   // 14px  
      '--font-base': '1rem',     // 16px
      '--font-lg': '1.125rem',   // 18px
      '--font-xl': '1.25rem',    // 20px
      '--font-2xl': '1.5rem',    // 24px
      '--font-3xl': '1.875rem'   // 30px
    }
  },
  [FONT_SIZES.MEDIUM]: {
    label: 'Medium',
    scale: '1rem', // 16px (default)
    config: {
      '--font-xs': '0.75rem',    // 12px
      '--font-sm': '0.875rem',   // 14px
      '--font-base': '1rem',     // 16px
      '--font-lg': '1.125rem',   // 18px
      '--font-xl': '1.25rem',    // 20px
      '--font-2xl': '1.5rem',    // 24px
      '--font-3xl': '1.875rem'   // 30px
    }
  },
  [FONT_SIZES.LARGE]: {
    label: 'Large',
    scale: '1.125rem', // 18px
    config: {
      '--font-xs': '0.875rem',   // 14px
      '--font-sm': '1rem',       // 16px
      '--font-base': '1.125rem', // 18px
      '--font-lg': '1.25rem',    // 20px
      '--font-xl': '1.375rem',   // 22px
      '--font-2xl': '1.625rem',  // 26px
      '--font-3xl': '2rem'       // 32px
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [themePreferences, setThemePreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {
        theme: THEMES.DARK,
        fontSize: FONT_SIZES.MEDIUM,
        autoTheme: false
      };
    } catch {
      return {
        theme: THEMES.DARK,
        fontSize: FONT_SIZES.MEDIUM,
        autoTheme: false
      };
    }
  });

  const [currentTheme, setCurrentTheme] = useState(THEMES.DARK);

  // Detect system theme preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT;
    }
    return THEMES.DARK;
  };

  // Update theme based on preferences
  useEffect(() => {
    let finalTheme = themePreferences.theme;
    
    if (themePreferences.theme === THEMES.AUTO) {
      finalTheme = getSystemTheme();
    }
    
    setCurrentTheme(finalTheme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', finalTheme);
    document.documentElement.className = finalTheme;
    
    // Apply font size
    const fontConfig = FONT_SIZE_CONFIG[themePreferences.fontSize].config;
    Object.entries(fontConfig).forEach(([property, value]) => {
      document.documentElement.style.setProperty(property, value);
    });
    
    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themePreferences));
  }, [themePreferences]);

  // Listen for system theme changes when auto mode is enabled
  useEffect(() => {
    if (themePreferences.theme === THEMES.AUTO && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        setCurrentTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
        document.documentElement.setAttribute('data-theme', e.matches ? THEMES.DARK : THEMES.LIGHT);
        document.documentElement.className = e.matches ? THEMES.DARK : THEMES.LIGHT;
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themePreferences.theme]);

  const setTheme = (theme) => {
    setThemePreferences(prev => ({ ...prev, theme }));
  };

  const setFontSize = (fontSize) => {
    setThemePreferences(prev => ({ ...prev, fontSize }));
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
  };

  const resetToDefaults = () => {
    setThemePreferences({
      theme: THEMES.DARK,
      fontSize: FONT_SIZES.MEDIUM,
      autoTheme: false
    });
  };

  const value = {
    // Current state
    currentTheme,
    theme: themePreferences.theme,
    fontSize: themePreferences.fontSize,
    
    // Theme constants
    THEMES,
    FONT_SIZES,
    FONT_SIZE_CONFIG,
    
    // Actions
    setTheme,
    setFontSize,
    toggleTheme,
    resetToDefaults,
    
    // Utilities
    isDark: currentTheme === THEMES.DARK,
    isLight: currentTheme === THEMES.LIGHT,
    isAuto: themePreferences.theme === THEMES.AUTO,
    systemTheme: getSystemTheme(),
    
    // Font size utilities
    currentFontConfig: FONT_SIZE_CONFIG[themePreferences.fontSize],
    fontSizeLabel: FONT_SIZE_CONFIG[themePreferences.fontSize].label
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
