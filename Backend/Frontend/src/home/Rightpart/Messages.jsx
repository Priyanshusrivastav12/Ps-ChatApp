import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Message from "./Message";
import useGetMessage from "../../context/useGetMessage.js";
import Loading from "../../components/Loading.jsx";
import useGetSocketMessage from "../../context/useGetSocketMessage.js";

const Messages = forwardRef((props, ref) => {
  const { loading, messages } = useGetMessage();
  useGetSocketMessage(); // listing incoming messages
  console.log(messages);

  const lastMsgRef = useRef();
  const messagesContainerRef = useRef();

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
      }
    }
  }));

  useEffect(() => {
    setTimeout(() => {
      if (lastMsgRef.current) {
        lastMsgRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }, 100);
  }, [messages]);
  
  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto chat-messages-bg relative"
      style={{ minHeight: "calc(92vh - 8vh)" }}
    >
      {/* Floating particles overlay */}
      <div className="floating-particles absolute inset-0 pointer-events-none"></div>
      
      {/* Content container with higher z-index */}
      <div className="relative z-10">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loading />
          </div>
        ) : (
          messages.length > 0 &&
          messages.map((message) => (
            <div key={message._id} ref={lastMsgRef} data-message-id={message._id}>
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
  );
});

Messages.displayName = 'Messages';

export default Messages;
