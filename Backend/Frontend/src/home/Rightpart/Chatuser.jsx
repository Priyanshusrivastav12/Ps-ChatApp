import React, { useState, useEffect } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { CiMenuFries } from "react-icons/ci";
import { IoMoon, IoSunny, IoPersonCircle } from "react-icons/io5";

function Chatuser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers, socket } = useSocketContext();
  const { isDark, toggleTheme } = useTheme();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedConversation._id) {
        setIsTyping(true);
      }
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      if (senderId === selectedConversation._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket, selectedConversation]);

  const getOnlineUsersStatus = (userId) => {
    if (isTyping) return "typing...";
    return onlineUsers.includes(userId) ? "Online" : "Offline";
  };

  const isOnline = onlineUsers.includes(selectedConversation._id);

  return (
    <div className={`relative glass-effect border-b shadow-lg transition-colors duration-200 ${
      isDark ? 'border-white/10' : 'border-gray-200'
    }`}>
      {/* Mobile menu button - positioned to avoid overlap */}
      <label
        htmlFor="my-drawer-2"
        className={`btn btn-ghost drawer-button lg:hidden absolute left-2 top-1/2 transform -translate-y-1/2 z-30 glass-effect w-10 h-10 min-h-10 p-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}
      >
        <CiMenuFries className="text-lg" />
      </label>
      
      <div className="flex items-center justify-center h-[8vh] px-4 sm:px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className={`absolute inset-0 transition-colors duration-200 ${
          isDark 
            ? 'bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50' 
            : 'bg-gradient-to-r from-gray-100/50 via-gray-50/50 to-gray-100/50'
        }`}></div>
        
        {/* Animated accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
        
        {/* Mobile: Left padding to avoid menu button overlap */}
        <div className="flex items-center space-x-3 sm:space-x-4 relative z-10 w-full lg:pl-0 pl-12 pr-2">
          {/* Avatar with enhanced styling - WhatsApp/Instagram Style */}
          <div className="relative flex-shrink-0">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-3 transition-all duration-300 ${
              isOnline 
                ? 'border-green-500 shadow-lg shadow-green-500/30' 
                : isDark 
                  ? 'border-gray-600' 
                  : 'border-gray-300'
            }`}>
              {selectedConversation.avatar ? (
                <img 
                  src={selectedConversation.avatar} 
                  alt={selectedConversation.fullname} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <IoPersonCircle className={`text-3xl sm:text-4xl lg:text-5xl transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              )}
            </div>
            
            {/* Online Status Indicator - WhatsApp Style */}
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-3 border-white shadow-lg">
                <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
            
            {/* Typing indicator overlay */}
            {isTyping && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* User info - responsive text sizing */}
          <div className="flex-1 min-w-0">
            <h1 className={`text-base sm:text-lg lg:text-xl font-semibold truncate transition-colors duration-200 ${
              isDark 
                ? 'text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text' 
                : 'text-gray-900 bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text'
            }`}>
              {selectedConversation.fullname}
            </h1>
            <div className="flex items-center space-x-2">
              <span className={`text-xs sm:text-sm transition-colors duration-300 truncate ${
                isTyping 
                  ? "text-blue-400 animate-pulse font-medium" 
                  : isOnline 
                    ? "text-green-400 font-medium" 
                    : isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                {getOnlineUsersStatus(selectedConversation._id)}
              </span>
            </div>
          </div>
          
          {/* Quick theme toggle button */}
          <button
            onClick={toggleTheme}
            className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'text-yellow-400 hover:bg-yellow-400/20' 
                : 'text-blue-600 hover:bg-blue-600/20'
            }`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <IoSunny className="text-lg" /> : <IoMoon className="text-lg" />}
          </button>
          
          {/* Activity indicator - hidden on small screens to save space */}
          <div className="hidden md:flex flex-col items-center space-y-1 flex-shrink-0">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isOnline ? "bg-green-400 animate-pulse" : "bg-gray-500"
            }`}></div>
            <div className={`text-xs transition-colors duration-200 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isOnline ? "●" : "○"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatuser;
