import React, { useState, useEffect } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { CiMenuFries } from "react-icons/ci";
import profile from "../../assets/user.jpg";

function Chatuser() {
  const { selectedConversation } = useConversation();
  const { onlineUsers, socket } = useSocketContext();
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
    <div className="relative glass-effect border-b border-white/10 shadow-lg">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden absolute left-5 top-1/2 transform -translate-y-1/2 z-20 glass-effect"
      >
        <CiMenuFries className="text-white text-xl" />
      </label>
      
      <div className="flex items-center justify-center h-[8vh] px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/50 via-slate-700/50 to-slate-800/50"></div>
        
        {/* Animated accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
        
        <div className="flex items-center space-x-4 relative z-10">
          {/* Avatar with enhanced styling */}
          <div className="relative">
            <div className={`avatar ${isOnline ? "online" : ""}`}>
              <div className="w-14 rounded-full ring-2 ring-blue-400/30 ring-offset-2 ring-offset-transparent transition-all duration-300">
                <img src={profile} alt={selectedConversation.fullname} className="rounded-full" />
              </div>
            </div>
            
            {/* Online status glow */}
            {isOnline && (
              <div className="absolute inset-0 rounded-full bg-green-400/20 blur-sm animate-pulse"></div>
            )}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* User info */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text">
              {selectedConversation.fullname}
            </h1>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isOnline 
                  ? "bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" 
                  : "bg-gray-500"
              }`}></div>
              <span className={`text-sm transition-colors duration-300 ${
                isTyping 
                  ? "text-blue-400 animate-pulse" 
                  : isOnline 
                    ? "text-green-400" 
                    : "text-gray-400"
              }`}>
                {getOnlineUsersStatus(selectedConversation._id)}
              </span>
            </div>
          </div>
          
          {/* Activity indicator */}
          <div className="flex flex-col items-center space-y-1">
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              isOnline ? "bg-green-400 animate-pulse" : "bg-gray-500"
            }`}></div>
            <div className="text-xs text-gray-400">
              {isOnline ? "●" : "○"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatuser;
