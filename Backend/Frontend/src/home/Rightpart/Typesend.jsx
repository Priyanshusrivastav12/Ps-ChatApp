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
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-1 h-[8vh] bg-gray-800">
          {/* Input container with emoji picker */}
          <div className="w-[70%] mx-4 relative">
            <input
              ref={inputRef}
              id="message-input"
              name="message"
              type="text"
              placeholder="Type here"
              value={message}
              onChange={handleChange}
              className="border border-gray-700 rounded-xl outline-none mt-1 px-4 py-3 pr-12 w-full text-white bg-gray-700 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Action buttons container */}
          <div className="flex items-center space-x-2 mr-4">
            {/* Emoji button */}
            <button
              type="button"
              onClick={toggleEmojiPicker}
              className="text-yellow-400 hover:text-yellow-300 transition-colors p-2 rounded-lg hover:bg-gray-700"
              title="Add emoji"
            >
              <BsEmojiSmile className="text-2xl" />
            </button>

            {/* Undo button */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className={`p-2 rounded-lg transition-colors ${
                historyIndex === 0 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-blue-400 hover:text-blue-300 hover:bg-gray-700'
              }`}
              title="Undo"
            >
              <MdUndo className="text-2xl" />
            </button>

            {/* Clear button */}
            <button
              type="button"
              onClick={handleClear}
              disabled={!message.trim()}
              className={`p-2 rounded-lg transition-colors ${
                !message.trim() 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-red-400 hover:text-red-300 hover:bg-gray-700'
              }`}
              title="Clear"
            >
              <MdClear className="text-2xl" />
            </button>

            {/* Send button */}
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className={`p-2 rounded-lg transition-colors ${
                !message.trim() || loading
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-green-400 hover:text-green-300 hover:bg-gray-700'
              }`}
              title="Send message"
            >
              <IoSend className="text-2xl" />
            </button>
          </div>
        </div>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-full right-4 mb-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-4 max-w-md z-50"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Emojis</h3>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-10 gap-2 max-h-64 overflow-y-auto">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-gray-700 rounded p-1 transition-colors focus:outline-none focus:bg-gray-600"
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
