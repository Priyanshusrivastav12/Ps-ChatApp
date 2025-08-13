import React from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import profile from "../../assets/user.jpg";

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
        <div className={`avatar ${isOnline ? "online" : ""} relative flex-shrink-0`}>
          <div className="w-10 sm:w-12 rounded-full ring-2 ring-offset-2 ring-offset-transparent transition-all duration-300 group-hover:ring-blue-400/50">
            <img src={profile} alt={user.fullname} className="rounded-full" />
          </div>
          {/* Online status glow */}
          {isOnline && (
            <div className="absolute inset-0 rounded-full bg-green-400/20 blur-sm animate-pulse"></div>
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
          
          {/* Status indicator */}
          <div className="flex items-center mt-1">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-2 transition-all duration-300 ${
              isOnline 
                ? "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" 
                : "bg-gray-500"
            }`}></div>
            <span className={`text-xs transition-colors duration-300 ${
              isDark ? "text-gray-500" : "text-gray-600"
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
