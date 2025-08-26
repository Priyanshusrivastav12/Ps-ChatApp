import React, { useState } from 'react';
import { 
  IoClose, 
  IoMoon, 
  IoSunny, 
  IoPhonePortrait,
  IoDesktop,
  IoCheckmark,
  IoRefresh,
  IoColorPalette
} from 'react-icons/io5';
import { FaTextHeight } from 'react-icons/fa';
import { useTheme } from '../context/ThemeProvider';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

function Settings({ isOpen, onClose }) {
  useBodyScrollLock(isOpen);
  const {
    currentTheme,
    theme,
    fontSize,
    THEMES,
    FONT_SIZES,
    FONT_SIZE_CONFIG,
    setTheme,
    setFontSize,
    toggleTheme,
    resetToDefaults,
    isDark,
    isLight,
    isAuto,
    systemTheme,
    fontSizeLabel
  } = useTheme();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const themeOptions = [
    {
      value: THEMES.LIGHT,
      label: 'Light',
      description: 'Clean and bright interface',
      icon: IoSunny,
      preview: 'bg-white text-gray-900 border-gray-200'
    },
    {
      value: THEMES.DARK,
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: IoMoon,
      preview: 'bg-gray-900 text-white border-gray-700'
    },
    {
      value: THEMES.AUTO,
      label: 'Auto',
      description: `Follows system (${systemTheme})`,
      icon: IoDesktop,
      preview: systemTheme === 'dark' ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'
    }
  ];

  const fontSizeOptions = [
    {
      value: FONT_SIZES.SMALL,
      label: 'Small',
      description: 'Compact and space-efficient',
      preview: 'text-sm'
    },
    {
      value: FONT_SIZES.MEDIUM,
      label: 'Medium',
      description: 'Default comfortable size',
      preview: 'text-base'
    },
    {
      value: FONT_SIZES.LARGE,
      label: 'Large',
      description: 'Better readability',
      preview: 'text-lg'
    }
  ];

  const handleReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-start p-2 sm:p-4 overflow-y-auto"
      onClick={handleBackdropClick}
      style={{ position: 'fixed' }}
    >
      <div 
        className={`rounded-xl shadow-2xl w-full sm:w-80 md:w-96 ml-0 sm:ml-4 mt-2 sm:mt-4 p-3 sm:p-4 relative animate-in slide-in-from-left-2 duration-300 max-h-[calc(100vh-1rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto max-w-sm mx-auto sm:mx-0 ${
          isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 sm:p-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-100'}`}>
              <IoColorPalette className={`text-base sm:text-lg ${isDark ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Appearance</h2>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Customize your experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <IoClose className="text-lg sm:text-xl" />
          </button>
        </div>

        {/* Theme Selection */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <IoColorPalette className={`text-sm sm:text-base ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className="text-sm sm:text-base font-semibold">Theme</h3>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = theme === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`w-full p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:scale-[1.01] ${
                    isSelected
                      ? isDark
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-blue-500 bg-blue-50'
                      : isDark
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      <IconComponent className="text-sm sm:text-base" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-xs sm:text-sm">{option.label}</span>
                        {isSelected && (
                          <IoCheckmark className="text-blue-500 text-sm sm:text-base" />
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                    </div>
                    
                    {/* Theme Preview */}
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border ${option.preview}`}>
                      <div className="w-full h-1 bg-current opacity-20 rounded-t"></div>
                      <div className="w-full h-1 bg-current opacity-10"></div>
                      <div className="w-full h-1 bg-current opacity-20 rounded-b"></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size Selection */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 mb-2 sm:mb-3">
            <FaTextHeight className={`text-sm sm:text-base ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className="text-sm sm:text-base font-semibold">Font Size</h3>
          </div>
          
          <div className="space-y-1.5 sm:space-y-2">
            {fontSizeOptions.map((option) => {
              const isSelected = fontSize === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`w-full p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-200 hover:scale-[1.01] ${
                    isSelected
                      ? isDark
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-green-500 bg-green-50'
                      : isDark
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${
                      isSelected
                        ? 'bg-green-500 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      <FaTextHeight className="text-sm sm:text-base" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-xs sm:text-sm">{option.label}</span>
                        {isSelected && (
                          <IoCheckmark className="text-green-500 text-sm sm:text-base" />
                        )}
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                    </div>
                    
                    {/* Font Size Preview */}
                    <div className={`${option.preview} font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Aa
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-3 sm:pt-4 space-y-1.5 sm:space-y-2" style={{
          borderColor: isDark ? '#374151' : '#E5E7EB'
        }}>
          <button
            onClick={toggleTheme}
            className={`w-full p-2 rounded-lg border transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm ${
              isDark
                ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                : 'border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {isDark ? <IoSunny className="text-sm sm:text-base" /> : <IoMoon className="text-sm sm:text-base" />}
            <span>Toggle to {isDark ? 'Light' : 'Dark'}</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className={`w-full p-2 rounded-lg border transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm ${
              isDark
                ? 'border-red-600/50 hover:bg-red-600/10 text-red-400'
                : 'border-red-300 hover:bg-red-50 text-red-600'
            }`}
          >
            <IoRefresh className="text-sm sm:text-base" />
            <span>Reset to Defaults</span>
          </button>
        </div>

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className={`rounded-xl p-3 sm:p-4 max-w-xs sm:max-w-sm w-full ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <h3 className="text-sm sm:text-base font-semibold mb-2">Reset Settings?</h3>
              <p className={`text-xs sm:text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                This will reset your theme to Dark mode and font size to Medium.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className={`flex-1 p-2 rounded-lg border transition-colors text-xs sm:text-sm ${
                    isDark
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                      : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Settings Summary */}
        <div className={`mt-2 sm:mt-3 p-2 rounded-lg text-xs ${
          isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          <div className="flex justify-between items-center">
            <span>Current: {theme === THEMES.AUTO ? `Auto (${currentTheme})` : theme} • {fontSizeLabel}</span>
            <div className="flex items-center space-x-1">
              {isDark ? <IoMoon className="text-xs" /> : <IoSunny className="text-xs" />}
              <FaTextHeight className="text-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
