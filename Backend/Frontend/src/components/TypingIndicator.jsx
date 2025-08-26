import React from 'react';
import { useTheme } from '../context/ThemeProvider';

function TypingIndicator({ username }) {
  const { isDark } = useTheme();

  return (
    <div className={`flex items-center space-x-3 px-4 py-3 mb-2 transition-colors duration-200 ${
      isDark ? 'text-gray-400' : 'text-gray-600'
    }`}>
      {/* Avatar placeholder */}
      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-700 border-slate-600' 
          : 'bg-gray-200 border-gray-300'
      }`}>
        <span className={`text-xs font-medium transition-colors duration-200 ${
          isDark ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {username ? username.charAt(0).toUpperCase() : '?'}
        </span>
      </div>

      {/* Typing content */}
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-2xl transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-800/50 border border-slate-700/50' 
          : 'bg-gray-100 border border-gray-200'
      }`}>
        {/* Typing text */}
        <span className={`text-sm italic transition-colors duration-200 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {username || 'Someone'} is typing
        </span>
        
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors duration-200 ${
            isDark ? 'bg-blue-400' : 'bg-blue-500'
          }`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors duration-200 ${
            isDark ? 'bg-blue-400' : 'bg-blue-500'
          }`} style={{ animationDelay: '150ms' }}></div>
          <div className={`w-1.5 h-1.5 rounded-full animate-bounce transition-colors duration-200 ${
            isDark ? 'bg-blue-400' : 'bg-blue-500'
          }`} style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
