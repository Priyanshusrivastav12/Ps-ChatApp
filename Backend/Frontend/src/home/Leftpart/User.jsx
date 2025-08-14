import React from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { IoPersonCircle } from "react-icons/io5";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const { isDark } = useTheme();
  const isOnline = onlineUsers.includes(user._id);
  
  const handleUserSelect = () => {
    setSelectedConversation(user);
    // Close mobile drawer when user is selected
    const drawerToggle = document.getElementById("my-drawer-2");
    if (drawerToggle && window.innerWidth < 1024) {
      drawerToggle.checked = false;
    }
  };
  
  return (
    <div
      className={`relative transition-all duration-300 mx-2 mb-2 rounded-xl overflow-hidden group cursor-pointer ${
        isSelected 
          ? isDark
            ? "bg-slate-700/50 border border-blue-500/50 shadow-lg shadow-blue-500/25" 
            : "bg-blue-50 border border-blue-200 shadow-md"
          : isDark
            ? "hover:bg-slate-700/30 hover:border-slate-600/50 border border-transparent"
            : "hover:bg-gray-100 hover:border-gray-200 border border-transparent"
      }`}
      onClick={handleUserSelect}
    >
      <div className="flex space-x-3 sm:space-x-4 px-4 sm:px-6 py-3 sm:py-4 relative z-10">
        {/* Avatar Container - WhatsApp/Instagram Style */}
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
            isSelected 
              ? 'border-blue-500 shadow-lg shadow-blue-500/30' 
              : isOnline 
                ? 'border-green-500 shadow-lg shadow-green-500/20' 
                : isDark 
                  ? 'border-gray-600 group-hover:border-gray-500' 
                  : 'border-gray-300 group-hover:border-gray-400'
          }`}>
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.fullname} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center transition-colors duration-300 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <IoPersonCircle className={`text-2xl sm:text-3xl transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            )}
          </div>
          
          {/* Online Status Indicator - WhatsApp Style */}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse">
              <div className="w-full h-full bg-green-500 rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className={`font-bold truncate transition-colors duration-300 text-sm sm:text-base ${
            isDark 
              ? isSelected 
                ? "text-white" 
                : "text-gray-300 group-hover:text-white"
              : isSelected
                ? "text-gray-900"
                : "text-gray-700 group-hover:text-gray-900"
          }`}>
            {user.fullname}
          </h1>
          <span className={`text-xs sm:text-sm truncate block transition-colors duration-300 ${
            isDark 
              ? "text-gray-400 group-hover:text-gray-300"
              : "text-gray-600 group-hover:text-gray-700"
          }`}>
            {user.email}
          </span>
          
          {/* Status indicator - Simplified */}
          <div className="flex items-center mt-1 space-x-2">
            <span className={`text-xs transition-colors duration-300 ${
              isOnline 
                ? "text-green-500 font-medium" 
                : isDark ? "text-gray-500" : "text-gray-600"
            }`}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="flex items-center flex-shrink-0">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
