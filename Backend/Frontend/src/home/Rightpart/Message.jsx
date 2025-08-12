import React, { useState } from "react";
import { MdEdit, MdReply, MdMoreVert } from "react-icons/md";
import { BsCheck, BsCheckAll } from "react-icons/bs";

function Message({ message, onReact, onReply, onEdit }) {
  const authUser = JSON.parse(localStorage.getItem("ChatApp"));
  const itsMe = message.senderId === authUser.user._id;
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const chatName = itsMe ? "chat-end" : "chat-start";
  const chatColor = itsMe 
    ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-500/25" 
    : "bg-gradient-to-r from-gray-700 to-gray-600 shadow-lg shadow-gray-500/25";

  const createdAt = new Date(message.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getStatusIcon = () => {
    if (!itsMe) return null;
    
    switch (message.status) {
      case 'sent':
        return <BsCheck className="text-gray-400 text-sm" />;
      case 'delivered':
        return <BsCheckAll className="text-gray-400 text-sm" />;
      case 'read':
        return <BsCheckAll className="text-blue-400 text-sm" />;
      default:
        return null;
    }
  };

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  const handleReaction = (emoji) => {
    onReact && onReact(message._id, emoji);
    setShowReactions(false);
  };

  return (
    <div className="px-4 py-2 relative z-10 group">
      <div className={`chat ${chatName}`}>
        {/* Reply indicator */}
        {message.replyTo && (
          <div className="chat-bubble bg-gray-800/50 border-l-4 border-blue-500 p-2 mb-1 text-xs text-gray-300">
            <div className="font-semibold">Replying to:</div>
            <div className="truncate">{message.replyTo.message}</div>
          </div>
        )}

        <div 
          className={`chat-bubble text-white ${chatColor} max-w-xs break-words message-enhanced transition-all duration-300 hover:scale-105 relative overflow-hidden`}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Message content */}
          <div className="relative z-10">
            {message.isEdited && (
              <span className="text-xs opacity-70 italic">(edited)</span>
            )}
            <div>{message.message}</div>
            
            {/* File/Media preview for future implementation */}
            {message.messageType !== 'text' && message.fileUrl && (
              <div className="mt-2 p-2 bg-black/20 rounded">
                {message.messageType === 'image' ? (
                  <img src={message.fileUrl} alt="Shared image" className="max-w-full rounded" />
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{message.fileName}</span>
                    <span className="text-xs opacity-70">({(message.fileSize / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Message actions */}
          {showActions && (
            <div className={`absolute top-0 ${itsMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} flex space-x-1 p-1`}>
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                title="React"
              >
                😊
              </button>
              <button
                onClick={() => onReply && onReply(message)}
                className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                title="Reply"
              >
                <MdReply className="text-sm" />
              </button>
              {itsMe && (
                <button
                  onClick={() => onEdit && onEdit(message)}
                  className="p-1 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  title="Edit"
                >
                  <MdEdit className="text-sm" />
                </button>
              )}
            </div>
          )}

          {/* Quick reactions panel */}
          {showReactions && (
            <div className={`absolute ${itsMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-8 bg-gray-800 rounded-lg p-2 flex space-x-1 shadow-lg z-20`}>
              {quickReactions.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleReaction(emoji)}
                  className="hover:bg-gray-700 rounded p-1 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          
          {/* Decorative corner accent */}
          <div className={`absolute top-0 right-0 w-3 h-3 ${itsMe ? 'bg-blue-400' : 'bg-gray-400'} opacity-30 transform rotate-45 translate-x-1 -translate-y-1`}></div>
        </div>

        {/* Message reactions display */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex space-x-1 mt-1">
            {message.reactions.reduce((acc, reaction) => {
              const existing = acc.find(r => r.emoji === reaction.emoji);
              if (existing) {
                existing.count++;
              } else {
                acc.push({ emoji: reaction.emoji, count: 1 });
              }
              return acc;
            }, []).map((reaction, index) => (
              <span key={index} className="bg-gray-800/50 text-xs px-2 py-1 rounded-full">
                {reaction.emoji} {reaction.count}
              </span>
            ))}
          </div>
        )}
        
        <div className="chat-footer text-xs opacity-70 mt-1 bg-black/20 backdrop-blur-sm rounded px-2 py-1 inline-block flex items-center space-x-1">
          <span>{formattedTime}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}

export default Message;
