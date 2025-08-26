import React, { useEffect, useState, useRef } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import Typesend from "./Typesend";
import MessageSearch from "../../components/MessageSearch";
import useConversation from "../../zustand/useConversation.js";
import { useAuth } from "../../context/AuthProvider.jsx";
import { useTheme } from "../../context/ThemeProvider.jsx";
import { getComponentClasses, getThemeClasses } from "../../utils/theme";
import { CiMenuFries } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";

function Right() {
  const { selectedConversation, setSelectedConversation, messages } = useConversation();
  const [showSearch, setShowSearch] = useState(false);
  const messagesRef = useRef(null);
  const { isDark } = useTheme();
  const componentClasses = getComponentClasses(isDark);
  const themeClasses = getThemeClasses(isDark);
  
  useEffect(() => {
    return setSelectedConversation(null);
  }, [setSelectedConversation]);

  const handleSearchResult = (message) => {
    // Scroll to the message in the chat
    if (messagesRef.current) {
      messagesRef.current.scrollToMessage(message._id);
    }
    setShowSearch(false);
  };

  return (
    <div className={`w-full h-screen relative overflow-hidden flex flex-col ${componentClasses.chat} transition-colors duration-200`}>
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Chat Header with Search - Sticky/Fixed */}
          <div className={`relative sticky top-0 z-30 backdrop-blur-sm border-b transition-colors duration-200 ${
            isDark 
              ? 'bg-slate-900/95 border-white/10' 
              : 'bg-white/95 border-gray-200'
          }`}>
            <Chatuser />
            {selectedConversation && (
              <>
                {/* Desktop search button */}
                <button
                  onClick={() => setShowSearch(true)}
                  className={`absolute right-20 sm:right-28 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors hidden lg:block z-20 ${themeClasses.button.ghost}`}
                  title="Search messages"
                >
                  <IoSearch className="text-lg" />
                </button>
                
                {/* Mobile search button - positioned to avoid overlap */}
                <button
                  onClick={() => setShowSearch(true)}
                  className={`absolute right-16 sm:right-24 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors lg:hidden z-20 w-10 h-10 flex items-center justify-center ${themeClasses.button.ghost}`}
                  title="Search messages"
                >
                  <IoSearch className="text-base" />
                </button>
              </>
            )}
          </div>
          
          {/* Message Search Overlay */}
          <MessageSearch
            messages={messages}
            onResultClick={handleSearchResult}
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
          />
          
          {/* Messages Area - Flex-1 to take remaining space */}
          <div className="flex-1 min-h-0 overflow-hidden messages-container">
            <Messages ref={messagesRef} />
          </div>
          
          {/* Message Input - Sticky/Fixed at bottom */}
          <div className={`sticky bottom-0 z-30 backdrop-blur-sm border-t transition-colors duration-200 ${
            isDark 
              ? 'bg-slate-900/95 border-white/10' 
              : 'bg-white/95 border-gray-200'
          }`}>
            <Typesend />
          </div>
        </>
      )}
    </div>
  );
}

export default Right;

const NoChatSelected = () => {
  const [authUser] = useAuth();
  const { isDark } = useTheme();
  const componentClasses = getComponentClasses(isDark);
  const themeClasses = getThemeClasses(isDark);
  
  console.log(authUser);
  return (
    <div className="relative h-full overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 animated-grid"></div>
      <div className="floating-particles absolute inset-0"></div>
      
      {/* Mobile header with menu button - Sticky/Fixed */}
      <div className={`lg:hidden sticky top-0 z-30 backdrop-blur-sm relative h-[8vh] flex items-center px-4 transition-colors duration-200 ${componentClasses.header}`}>
        <label
          htmlFor="my-drawer-2"
          className={`btn btn-ghost drawer-button glass-effect ${themeClasses.text.primary}`}
        >
          <CiMenuFries className="text-xl" />
        </label>
        <div className="ml-4">
          <h1 className={`text-lg font-semibold ${themeClasses.text.primary} transition-colors duration-200`}>ChatApp</h1>
        </div>
      </div>
      
      {/* Welcome content */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4">
        <div className="text-center glass-effect p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl max-w-sm sm:max-w-md mx-auto animated-border">
          {/* Animated welcome text */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent animate-pulse">
              Welcome
            </h1>
            <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold mt-2 ${themeClasses.text.primary} transition-colors duration-200`}>
              {authUser.user.fullname}
            </h2>
          </div>
          
          {/* Decorative elements */}
          <div className="flex justify-center space-x-4 mb-4 sm:mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          {/* Main message */}
          <div className="space-y-3 sm:space-y-4">
            <p className={`text-sm sm:text-base lg:text-lg leading-relaxed ${themeClasses.text.secondary} transition-colors duration-200`}>
              No chat selected, please start conversation by selecting anyone from your contacts
            </p>
            <p className={`text-xs sm:text-sm ${themeClasses.text.tertiary} transition-colors duration-200`}>
              Experience beautiful animations and enhanced UI while chatting
            </p>
          </div>
          
          {/* Mobile instruction */}
          <div className={`lg:hidden mt-6 p-3 rounded-lg border transition-colors duration-200 ${
            isDark 
              ? 'bg-blue-500/20 border-blue-500/30' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm transition-colors duration-200 ${
              isDark ? 'text-blue-300' : 'text-blue-700'
            }`}>
              📱 Tap the menu button above to view your contacts
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-xs">
            <div className="glass-effect p-2 sm:p-3 rounded-lg">
              <div className="text-blue-400 mb-1">✨</div>
              <div className={`text-xs ${themeClasses.text.secondary} transition-colors duration-200`}>Animated Backgrounds</div>
            </div>
            <div className="glass-effect p-2 sm:p-3 rounded-lg">
              <div className="text-purple-400 mb-1">💬</div>
              <div className={`text-xs ${themeClasses.text.secondary} transition-colors duration-200`}>Real-time Chat</div>
            </div>
            <div className="glass-effect p-2 sm:p-3 rounded-lg">
              <div className="text-green-400 mb-1">🎨</div>
              <div className={`text-xs ${themeClasses.text.secondary} transition-colors duration-200`}>Beautiful UI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
