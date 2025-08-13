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

function Settings({ isOpen, onClose }) {
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-blue-600' : 'bg-blue-100'}`}>
              <IoColorPalette className={`text-xl ${isDark ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Appearance</h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Customize your chat experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Theme Selection */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <IoColorPalette className={`text-lg ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className="text-lg font-semibold">Theme</h3>
          </div>
          
          <div className="space-y-3">
            {themeOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = theme === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    isSelected
                      ? isDark
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-blue-500 bg-blue-50'
                      : isDark
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      <IconComponent className="text-xl" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{option.label}</span>
                        {isSelected && (
                          <IoCheckmark className="text-blue-500 text-lg" />
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                    </div>
                    
                    {/* Theme Preview */}
                    <div className={`w-8 h-8 rounded-lg border-2 ${option.preview}`}>
                      <div className="w-full h-2 bg-current opacity-20 rounded-t-md"></div>
                      <div className="w-full h-2 bg-current opacity-10"></div>
                      <div className="w-full h-2 bg-current opacity-20 rounded-b-md"></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size Selection */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <FaTextHeight className={`text-lg ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className="text-lg font-semibold">Font Size</h3>
          </div>
          
          <div className="space-y-3">
            {fontSizeOptions.map((option) => {
              const isSelected = fontSize === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    isSelected
                      ? isDark
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-green-500 bg-green-50'
                      : isDark
                        ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected
                        ? 'bg-green-500 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300'
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      <FaTextHeight className="text-xl" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{option.label}</span>
                        {isSelected && (
                          <IoCheckmark className="text-green-500 text-lg" />
                        )}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
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
        <div className="border-t pt-6 space-y-3" style={{
          borderColor: isDark ? '#374151' : '#E5E7EB'
        }}>
          <button
            onClick={toggleTheme}
            className={`w-full p-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
              isDark
                ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
                : 'border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {isDark ? <IoSunny className="text-lg" /> : <IoMoon className="text-lg" />}
            <span>Toggle to {isDark ? 'Light' : 'Dark'} Mode</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className={`w-full p-3 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
              isDark
                ? 'border-red-600/50 hover:bg-red-600/10 text-red-400'
                : 'border-red-300 hover:bg-red-50 text-red-600'
            }`}
          >
            <IoRefresh className="text-lg" />
            <span>Reset to Defaults</span>
          </button>
        </div>

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className={`rounded-xl p-6 max-w-sm w-full ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}>
              <h3 className="text-lg font-semibold mb-2">Reset Settings?</h3>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                This will reset your theme to Dark mode and font size to Medium.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className={`flex-1 p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'border-gray-600 hover:bg-gray-700 text-gray-300'
                      : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Current Settings Summary */}
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          <div className="flex justify-between items-center">
            <span>Current: {theme === THEMES.AUTO ? `Auto (${currentTheme})` : theme} • {fontSizeLabel}</span>
            <div className="flex items-center space-x-1">
              {isDark ? <IoMoon className="text-sm" /> : <IoSunny className="text-sm" />}
              <FaTextHeight className="text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
