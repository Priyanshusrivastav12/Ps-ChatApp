import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import Message from "./Message";
import useGetMessage from "../../context/useGetMessage.js";
import LoadingDots from "../../components/LoadingDots.jsx";
import useGetSocketMessage from "../../context/useGetSocketMessage.js";

const Messages = forwardRef((props, ref) => {
  const { loading, messages } = useGetMessage();
  useGetSocketMessage(); // listing incoming messages
  console.log(messages);

  const lastMsgRef = useRef();
  const messagesContainerRef = useRef();
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    scrollToMessage: (messageId) => {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        // Highlight the message briefly
        messageElement.classList.add('search-highlight');
        setTimeout(() => {
          messageElement.classList.remove('search-highlight');
        }, 2000);
      }
    },
    scrollToBottom: () => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
        });
        setShouldAutoScroll(true);
      }
    }
  }));

  // Detect when user is manually scrolling
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50; // 50px threshold
      
      setShouldAutoScroll(isAtBottom);
      setIsUserScrolling(!isAtBottom);
    }
  };

  // Auto-scroll to bottom only if user is at bottom or it's a new conversation
  useEffect(() => {
    if (shouldAutoScroll && lastMsgRef.current) {
      setTimeout(() => {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [messages, shouldAutoScroll]);

  // Reset scroll behavior when conversation changes
  useEffect(() => {
    setShouldAutoScroll(true);
    setIsUserScrolling(false);
  }, [messages.length === 0]);
  
  return (
    <div className="relative">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto chat-messages-bg relative px-2 py-4 scroll-smooth"
        style={{ 
          height: "calc(100vh - 16vh)", // Account for header (8vh) and input (8vh)
          minHeight: "calc(100vh - 16vh)"
        }}
        onScroll={handleScroll}
      >
        {/* Floating particles overlay */}
        <div className="floating-particles absolute inset-0 pointer-events-none"></div>
        
        {/* Content container with higher z-index */}
        <div className="relative z-10 min-h-full">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="glass-effect p-6 rounded-xl">
                <LoadingDots size="medium" />
                <p className="text-gray-300 text-sm mt-3 text-center">Loading messages...</p>
              </div>
            </div>
          ) : (
            messages.length > 0 &&
            messages.map((message, index) => (
              <div 
                key={message._id} 
                ref={index === messages.length - 1 ? lastMsgRef : null} 
                data-message-id={message._id}
              >
                <Message message={message} />
              </div>
            ))
          )}

          {!loading && messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="glass-effect p-8 rounded-2xl text-center animated-border">
                <p className="text-lg font-medium text-gray-300">
                  Say! Hi to start the conversation
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Your messages will appear here with beautiful animations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button - appears when user scrolls up */}
      {isUserScrolling && messages.length > 0 && (
        <button
          onClick={() => {
            if (lastMsgRef.current) {
              lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
              setShouldAutoScroll(true);
              setIsUserScrolling(false);
            }
          }}
          className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-20"
          title="Scroll to bottom"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </button>
      )}
    </div>
  );
});

Messages.displayName = 'Messages';

export default Messages;
