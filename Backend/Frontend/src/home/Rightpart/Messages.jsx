import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from "react";
import Message from "./Message";
import useGetMessage from "../../context/useGetMessage.js";
import LoadingDots from "../../components/LoadingDots.jsx";
import useGetSocketMessage from "../../context/useGetSocketMessage.js";
import TypingIndicator from "../../components/TypingIndicator.jsx";
import { useSocketContext } from "../../context/SocketContext.jsx";
import useConversation from "../../zustand/useConversation.js";
import useGetAllUsers from "../../context/useGetAllUsers.jsx";

const Messages = forwardRef((props, ref) => {
  const { loading, messages } = useGetMessage();
  useGetSocketMessage(); // listing incoming messages
  const { typingUsers } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { allUsers } = useGetAllUsers();

  const lastMsgRef = useRef();
  const messagesContainerRef = useRef();
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollTimeoutRef = useRef();
  const lastScrollTop = useRef(0);

  // Check if the selected conversation user is typing
  // Note: typingUsers contains the sender IDs of users who are typing
  const isSelectedUserTyping = selectedConversation && typingUsers.has(selectedConversation._id);
  
  // Get the typing user's name
  const typingUserName = isSelectedUserTyping ? selectedConversation.fullname : null;

  console.log('Messages component state:', {
    messagesLength: messages.length,
    isUserScrolling,
    shouldAutoScroll,
    showScrollButton,
    loading
  });

  // Debounced scroll handler for better performance
  const debouncedScrollHandler = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const isAtBottom = distanceFromBottom < 10;
        const hasScrollableContent = scrollHeight > clientHeight;
        
        // Debug logging
        console.log('Scroll Debug:', {
          scrollTop,
          scrollHeight,
          clientHeight,
          distanceFromBottom,
          isAtBottom,
          hasScrollableContent,
          messagesLength: messages.length
        });
        
        if (hasScrollableContent) {
          setShouldAutoScroll(isAtBottom);
          setIsUserScrolling(!isAtBottom);
          setShowScrollButton(!isAtBottom && messages.length > 5);
        } else {
          // If content doesn't scroll, reset states
          setShouldAutoScroll(true);
          setIsUserScrolling(false);
          setShowScrollButton(false);
        }
        
        lastScrollTop.current = scrollTop;
      }
    }, 100); // Increased debounce time for better stability
  }, [messages.length]);

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
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
        setShouldAutoScroll(true);
        setIsUserScrolling(false);
      }
    }
  }));

  // Detect when user is manually scrolling
  const handleScroll = (e) => {
    console.log('Scroll event triggered!', {
      scrollTop: e.target.scrollTop,
      scrollHeight: e.target.scrollHeight,
      clientHeight: e.target.clientHeight
    });
    debouncedScrollHandler();
  };

  // Auto-scroll to bottom only when appropriate
  useEffect(() => {
    if (shouldAutoScroll && messages.length > 0 && !isUserScrolling) {
      const timer = setTimeout(() => {
        if (messagesContainerRef.current && shouldAutoScroll && !isUserScrolling) {
          const { scrollHeight, clientHeight } = messagesContainerRef.current;
          if (scrollHeight > clientHeight) {
            messagesContainerRef.current.scrollTo({
              top: scrollHeight,
              behavior: 'auto' // Use auto for immediate scroll on new messages
            });
          }
        }
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [messages, shouldAutoScroll, isUserScrolling, isSelectedUserTyping]); // Added isSelectedUserTyping

  // Auto-scroll when typing indicator appears/disappears
  useEffect(() => {
    if (isSelectedUserTyping && shouldAutoScroll && !isUserScrolling) {
      const timer = setTimeout(() => {
        if (messagesContainerRef.current && shouldAutoScroll && !isUserScrolling) {
          messagesContainerRef.current.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isSelectedUserTyping, shouldAutoScroll, isUserScrolling]);

  // Initial scroll to bottom on mount - only for new conversations
  useEffect(() => {
    if (messagesContainerRef.current && messages.length > 0 && !isUserScrolling) {
      const timer = setTimeout(() => {
        if (messagesContainerRef.current && !isUserScrolling) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          setShouldAutoScroll(true);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [messages.length > 0]); // Remove isUserScrolling dependency to prevent conflicts

  // Reset scroll behavior when conversation changes
  useEffect(() => {
    if (loading) {
      setShouldAutoScroll(true);
      setIsUserScrolling(false);
      setShowScrollButton(false);
    }
  }, [loading]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Ensure scroll container is properly set up
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      console.log('Container setup:', {
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
        scrollTop: container.scrollTop,
        hasOverflow: container.scrollHeight > container.clientHeight
      });
    }
  }, [messages.length]);
  
  return (
    <div className="h-full w-full relative" style={{ minHeight: '400px' }}>
      <div
        ref={messagesContainerRef}
        className="h-full overflow-y-auto overflow-x-hidden chat-messages-bg px-3 py-2 message-container custom-scrollbar"
        style={{
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          maxHeight: '100%',
          height: '100%',
          minHeight: '300px' // Ensure minimum height for scrolling
        }}
        onScroll={handleScroll}
      >
        {/* Messages container */}
        <div className="relative z-10 py-4 min-h-full">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="glass-effect p-6 rounded-xl">
                <LoadingDots size="medium" />
                <p className="text-gray-300 text-sm mt-3 text-center">Loading messages...</p>
              </div>
            </div>
          ) : messages.length > 0 ? (
            <>
              {/* Add some top padding for better scrolling */}
              <div className="h-4"></div>
              {messages.map((message, index) => (
                <div 
                  key={message._id} 
                  data-message-id={message._id}
                  className="w-full chat-message-item mb-2"
                >
                  <Message message={message} />
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isSelectedUserTyping && (
                <div className="typing-indicator-container animate-in slide-in-from-bottom-2 duration-300">
                  <TypingIndicator username={typingUserName} />
                </div>
              )}
              
              {/* Bottom spacing */}
              <div className="h-8"></div>
              {/* Invisible element to scroll to */}
              <div ref={lastMsgRef} className="h-1" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
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

      {/* Scroll to bottom button - shows when user scrolls up */}
      {showScrollButton && (
        <div className="absolute bottom-4 right-4 z-40">
          <button
            onClick={() => {
              if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTo({
                  top: messagesContainerRef.current.scrollHeight,
                  behavior: 'smooth'
                });
                setShouldAutoScroll(true);
                setIsUserScrolling(false);
                setShowScrollButton(false);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-white/20 scroll-to-bottom"
            style={{
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            title="Scroll to bottom"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
});

Messages.displayName = 'Messages';

export default Messages;
