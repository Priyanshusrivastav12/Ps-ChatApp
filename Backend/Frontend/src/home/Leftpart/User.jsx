import React from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import profile from "../../assets/user.jpg";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { socket, onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(user._id);
  
  return (
    <div
      className={`relative transition-all duration-300 mx-2 mb-2 rounded-xl overflow-hidden group cursor-pointer ${
        isSelected 
          ? "glass-effect border-blue-500/50 shadow-lg shadow-blue-500/25 transform scale-105" 
          : "hover:glass-effect hover:border-white/20 hover:transform hover:scale-102"
      }`}
      onClick={() => setSelectedConversation(user)}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-300 ${
        isSelected 
          ? "from-blue-600/20 to-purple-600/20 opacity-100" 
          : "from-slate-600/10 to-slate-700/10 opacity-0 group-hover:opacity-100"
      }`}></div>
      
      {/* Animated border on hover */}
      {!isSelected && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      )}
      
      <div className="flex space-x-4 px-6 py-4 relative z-10">
        <div className={`avatar ${isOnline ? "online" : ""} relative`}>
          <div className="w-12 rounded-full ring-2 ring-offset-2 ring-offset-transparent transition-all duration-300 group-hover:ring-blue-400/50">
            <img src={profile} alt={user.fullname} className="rounded-full" />
          </div>
          {/* Online status glow */}
          {isOnline && (
            <div className="absolute inset-0 rounded-full bg-green-400/20 blur-sm animate-pulse"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-white truncate group-hover:text-blue-300 transition-colors duration-300">
            {user.fullname}
          </h1>
          <span className="text-sm text-gray-400 truncate block group-hover:text-gray-300 transition-colors duration-300">
            {user.email}
          </span>
          
          {/* Status indicator */}
          <div className="flex items-center mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 transition-all duration-300 ${
              isOnline 
                ? "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" 
                : "bg-gray-500"
            }`}></div>
            <span className="text-xs text-gray-500">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default User;
