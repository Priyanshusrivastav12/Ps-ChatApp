import React from "react";

function Message({ message }) {
  const authUser = JSON.parse(localStorage.getItem("ChatApp"));
  const itsMe = message.senderId === authUser.user._id;

  const chatName = itsMe ? "chat-end" : "chat-start";
  const chatColor = itsMe 
    ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25" 
    : "bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg shadow-gray-500/25";

  const createdAt = new Date(message.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="px-4 py-2 relative z-10">
      <div className={`chat ${chatName}`}>
        <div className={`chat-bubble text-white ${chatColor} max-w-xs break-words message-enhanced transition-all duration-300 hover:scale-105 relative overflow-hidden`}>
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Message content */}
          <div className="relative z-10">
            {message.message}
          </div>
          
          {/* Decorative corner accent */}
          <div className={`absolute top-0 right-0 w-3 h-3 ${itsMe ? 'bg-blue-400' : 'bg-gray-400'} opacity-30 transform rotate-45 translate-x-1 -translate-y-1`}></div>
        </div>
        <div className="chat-footer text-xs opacity-70 mt-1 bg-black/20 backdrop-blur-sm rounded px-2 py-1 inline-block">
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export default Message;
