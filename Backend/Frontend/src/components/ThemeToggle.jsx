import React from 'react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { useTheme } from '../context/ThemeProvider';

function ThemeToggle({ className = '', size = 'sm' }) {
  const { isDark, toggleTheme } = useTheme();

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={toggleTheme}
      className={`${sizes[size]} ${className} ${
        isDark 
          ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 border-slate-600' 
          : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
      } border rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <IoSunny className={iconSizes[size]} />
      ) : (
        <IoMoon className={iconSizes[size]} />
      )}
    </button>
  );
}

export default ThemeToggle;
