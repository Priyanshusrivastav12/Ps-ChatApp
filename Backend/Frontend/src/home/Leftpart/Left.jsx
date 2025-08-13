import React, { useState } from "react";
import Search from "./Search";
import Users from "./Users";
import Logout from "./Logout";
import UserProfile from "../../components/UserProfile";
import Settings from "../../components/Settings";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import { IoPersonCircle, IoSettings, IoColorPalette } from "react-icons/io5";

function Left() {
  const [authUser] = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isDark, currentTheme, fontSizeLabel } = useTheme();

  return (
    <div className={`w-full h-full flex flex-col transition-colors duration-200 ${
      isDark ? 'bg-slate-900 text-gray-300' : 'bg-white text-gray-700'
    }`}>
      {/* Header with Profile */}
      <div className={`flex-shrink-0 p-4 border-b lg:pt-4 pt-16 transition-colors duration-200 ${
        isDark ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          {/* App title for mobile - adjusted positioning */}
          <h1 className={`lg:hidden text-xl font-bold transition-colors duration-200 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            ChatApp
          </h1>
          
          {/* Desktop profile section */}
          <div className="hidden lg:flex items-center space-x-3 flex-1">
            <div 
              className={`w-10 h-10 rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
                isDark 
                  ? 'bg-slate-700 hover:ring-2 hover:ring-blue-400/50' 
                  : 'bg-gray-200 hover:ring-2 hover:ring-blue-500/50'
              }`}
              onClick={() => setShowProfile(true)}
            >
              {authUser?.user?.avatar ? (
                <img
                  src={authUser.user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IoPersonCircle className={`text-3xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`font-medium truncate transition-colors duration-200 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {authUser?.user?.fullname}
              </h2>
              <p className={`text-xs truncate transition-colors duration-200 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {authUser?.user?.bio || 'Hey there! I am using ChatApp.'}
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-slate-700/50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Appearance Settings"
            >
              <IoColorPalette className="text-lg" />
            </button>
            
            {/* Profile Settings button */}
            <button
              onClick={() => setShowProfile(true)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-400 hover:text-white hover:bg-slate-700/50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Profile Settings"
            >
              <IoSettings className="text-lg" />
            </button>
          </div>
        </div>
        
        {/* Theme indicator */}
        <div className={`mt-2 text-xs opacity-60 lg:block hidden ${
          isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {currentTheme} • {fontSizeLabel}
        </div>
      </div>
      
      {/* Search component */}
      <div className="flex-shrink-0">
        <Search />
      </div>
      
      {/* Users list - scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Users />
      </div>
      
      {/* Logout - fixed at bottom */}
      <div className="flex-shrink-0">
        <Logout />
      </div>
      
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
    </div>
  );
}

export default Left;
