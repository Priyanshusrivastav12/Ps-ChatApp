import React, { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import { MdUndo, MdClear } from "react-icons/md";
import useSendMessage from "../../context/useSendMessage.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import useConversation from "../../zustand/useConversation.js";

function Typesend() {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([""]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { loading, sendMessages } = useSendMessage();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const [typingTimeout, setTypingTimeout] = useState(null);
  const emojiPickerRef = useRef(null);
  const inputRef = useRef(null);

  // Common emojis for quick access
  const emojis = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
    "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
    "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
    "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
    "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
    "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
    "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
    "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
    "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈",
    "👍", "👎", "👌", "🤞", "✌️", "🤟", "🤘", "🤙", "👈", "👉",
    "👆", "🖕", "👇", "☝️", "👋", "🤚", "🖐️", "✋", "🖖", "👏",
    "🙌", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶",
    "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
    "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
    "✨", "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🌟", "⭐", "💫"
  ];

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update message history when message changes
  useEffect(() => {
    if (historyIndex === messageHistory.length - 1) {
      const newHistory = [...messageHistory.slice(0, -1), message];
      setMessageHistory(newHistory);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket?.emit("stopTyping", { recipientId: selectedConversation._id });
      await sendMessages(message);
      
      // Add sent message to history and reset
      const newHistory = [...messageHistory, ""];
      setMessageHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setMessage("");
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // If the user is typing, emit typing event
    socket?.emit("typing", { recipientId: selectedConversation._id });
    
    // Clear existing timeout
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Set new timeout
    const timeout = setTimeout(() => {
      socket?.emit("stopTyping", { recipientId: selectedConversation._id });
    }, 1000);
    
    setTypingTimeout(timeout);
  };

  const handleEmojiClick = (emoji) => {
    const cursorPosition = inputRef.current.selectionStart;
    const textBeforeCursor = message.slice(0, cursorPosition);
    const textAfterCursor = message.slice(cursorPosition);
    const newMessage = textBeforeCursor + emoji + textAfterCursor;
    
    setMessage(newMessage);
    
    // Set cursor position after emoji
    setTimeout(() => {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
    }, 0);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setMessage(messageHistory[newIndex]);
    }
  };

  const handleClear = () => {
    setMessage("");
    const newHistory = [...messageHistory, ""];
    setMessageHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    inputRef.current.focus();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  return (
    <div className="relative">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 glass-effect border-t border-white/10"></div>
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex space-x-3 h-[8vh] px-4 py-2">
          {/* Input container with enhanced styling */}
          <div className="flex-1 relative">
            <div className="relative group">
              <input
                ref={inputRef}
                id="message-input"
                name="message"
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={handleChange}
                className="w-full px-6 py-3 pr-16 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-2xl outline-none text-white placeholder-gray-400 transition-all duration-300 focus:border-blue-500/70 focus:shadow-lg focus:shadow-blue-500/25 group-hover:border-slate-500/70"
              />
              
              {/* Input glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Character count indicator */}
              {message.length > 0 && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {message.length}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons container */}
          <div className="flex items-center space-x-2">
            {/* Emoji button */}
            <button
              type="button"
              onClick={toggleEmojiPicker}
              className="p-3 rounded-xl bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 text-yellow-400 hover:text-yellow-300 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 group"
              title="Add emoji"
            >
              <BsEmojiSmile className="text-xl group-hover:scale-110 transition-transform duration-300" />
            </button>

            {/* Undo button */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                historyIndex === 0 
                  ? 'bg-slate-800/50 border-slate-600/30 text-gray-500 cursor-not-allowed' 
                  : 'bg-slate-800/80 border-slate-600/50 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/25'
              }`}
              title="Undo"
            >
              <MdUndo className="text-xl" />
            </button>

            {/* Clear button */}
            <button
              type="button"
              onClick={handleClear}
              disabled={!message.trim()}
              className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                !message.trim() 
                  ? 'bg-slate-800/50 border-slate-600/30 text-gray-500 cursor-not-allowed' 
                  : 'bg-slate-800/80 border-slate-600/50 text-red-400 hover:text-red-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/25'
              }`}
              title="Clear"
            >
              <MdClear className="text-xl" />
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                !message.trim() || loading
                  ? 'bg-slate-800/50 border-slate-600/30 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-500 border-green-500/50 text-white hover:from-green-500 hover:to-green-400 hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105'
              }`}
              title="Send message"
            >
              <IoSend className={`text-xl ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
      </form>

      {/* Enhanced Emoji Picker */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-full right-4 mb-2 glass-effect border border-white/20 rounded-2xl shadow-2xl p-6 max-w-md z-50 animate-fadeInUp"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium flex items-center">
              <span className="mr-2">😊</span>
              Emojis
            </h3>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-10 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-white/10 rounded-lg p-2 transition-all duration-200 focus:outline-none focus:bg-white/20 hover:scale-110 transform"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Typesend;
