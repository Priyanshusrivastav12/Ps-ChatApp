import React, { useState } from "react";
import { createPortal } from "react-dom";
import Search from "./Search";
import Users from "./Users";
import Logout from "./Logout";
import UserProfile from "../../components/UserProfile";
import Settings from "../../components/Settings";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import { getComponentClasses, getThemeClasses } from "../../utils/theme";
import { IoPersonCircle, IoSettings, IoColorPalette } from "react-icons/io5";
import { CiMenuFries } from "react-icons/ci";

function Left() {
  const [authUser] = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isDark, currentTheme, fontSizeLabel } = useTheme();
  const componentClasses = getComponentClasses(isDark);
  const themeClasses = getThemeClasses(isDark);

  return (
    <div className={`w-full h-screen flex flex-col overflow-hidden ${componentClasses.sidebar} pt-2 lg:pt-0`}>
      {/* Header - Fixed height with profile, theme toggle, and settings */}
      <div className={`flex-shrink-0 h-[8vh] px-4 py-3 border-b flex items-center justify-between ${themeClasses.border.primary} bg-gradient-to-r relative overflow-hidden ${
        isDark 
          ? 'from-slate-800 to-slate-700' 
          : 'from-gray-100 to-gray-50'
      } transition-colors duration-200 mt-8 lg:mt-0`}>
        {/* Accent line */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
          isDark 
            ? 'from-blue-500 via-purple-500 to-green-500' 
            : 'from-blue-400 via-purple-400 to-green-400'
        }`}></div>
        
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            className={`p-2 rounded-lg transition-colors duration-200 ${themeClasses.button.ghost}`}
            onClick={() => document.getElementById('my-drawer-2').checked = !document.getElementById('my-drawer-2').checked}
          >
            <CiMenuFries className="text-xl" />
          </button>
        </div>
        
        {/* App title for mobile - centered with proper spacing */}
        <h1 className={`lg:hidden text-xl font-bold ${themeClasses.text.primary} transition-colors duration-200 flex-1 text-center pr-12`}>
          ChatApp
        </h1>
          
        {/* Desktop profile section */}
        <div className="hidden lg:flex items-center space-x-3 flex-1">
          <div 
            className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
              isDark 
                ? 'border-gray-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/20' 
                : 'border-gray-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20'
            }`}
            onClick={() => setShowProfile(true)}
          >
            {authUser?.user?.avatar ? (
              <img
                src={authUser.user.avatar}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${themeClasses.bg.tertiary} transition-colors duration-300`}>
                <IoPersonCircle className={`text-2xl ${themeClasses.text.tertiary} transition-colors duration-300`} />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className={`font-medium truncate ${themeClasses.text.primary} transition-colors duration-200`}>
              {authUser?.user?.fullname}
            </h2>
            <p className={`text-xs truncate ${themeClasses.text.tertiary} transition-colors duration-200`}>
              {authUser?.user?.bio || 'Hey there! I am using ChatApp.'}
            </p>
          </div>
        </div>
        
        {/* Action buttons - Compact spacing */}
        <div className="flex items-center space-x-1">
          {/* Settings button */}
          <button
            onClick={() => setShowSettings(true)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${themeClasses.button.ghost}`}
            title="Appearance Settings"
          >
            <IoColorPalette className="text-base" />
          </button>
          
          {/* Profile Settings button */}
          <button
            onClick={() => setShowProfile(true)}
            className={`p-1.5 rounded-lg transition-all duration-200 ${themeClasses.button.ghost}`}
            title="Profile Settings"
          >
            <IoSettings className="text-base" />
          </button>
        </div>
      </div>
      
      {/* Search component - Fixed */}
      <div className="flex-shrink-0">
        <Search />
      </div>
      
      {/* Messages Header - Fixed */}
      <div className={`flex-shrink-0 px-8 py-2 text-white font-semibold bg-gradient-to-r rounded-md shadow-lg border relative overflow-hidden mx-2 mb-2 ${
        isDark 
          ? 'from-slate-800 to-slate-700 border-slate-600' 
          : 'from-gray-800 to-gray-700 border-gray-600'
      }`}>
        <span className="relative z-10">Messages</span>
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Users list - Scrollable only this section */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
        <Users />
      </div>
      
      {/* Logout - Fixed at bottom */}
      <div className="flex-shrink-0">
        <Logout />
      </div>
      
      {/* Render modals using portals to avoid positioning issues */}
      {typeof window !== 'undefined' && createPortal(
        <>
          {/* User Profile Modal */}
          <UserProfile 
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
          />
          
          {/* Settings Modal */}
          <Settings 
            isOpen={showSettings} 
            onClose={() => setShowSettings(false)} 
          />
        </>,
        document.body
      )}
    </div>
  );
}

export default Left;
