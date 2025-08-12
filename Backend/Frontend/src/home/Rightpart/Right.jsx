import React, { useEffect } from "react";
import Chatuser from "./Chatuser";
import Messages from "./Messages";
import Typesend from "./Typesend";
import useConversation from "../../zustand/useConversation.js";
import { useAuth } from "../../context/AuthProvider.jsx";
import { CiMenuFries } from "react-icons/ci";

function Right() {
  const { selectedConversation, setSelectedConversation } = useConversation();
  useEffect(() => {
    return setSelectedConversation(null);
  }, [setSelectedConversation]);
  return (
    <div className="w-full h-screen bg-slate-900 text-gray-300 relative overflow-hidden flex flex-col">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <Chatuser />
          <div className="flex-1 overflow-y-auto">
            <Messages />
          </div>
          <Typesend />
        </>
      )}
    </div>
  );
}

export default Right;

const NoChatSelected = () => {
  const [authUser] = useAuth();
  console.log(authUser);
  return (
    <div className="relative h-full overflow-hidden flex flex-col">
      {/* Animated background */}
      <div className="absolute inset-0 animated-grid"></div>
      <div className="floating-particles absolute inset-0"></div>
      
      {/* Mobile header with menu button */}
      <div className="lg:hidden relative z-20 p-4 flex items-center">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button glass-effect"
        >
          <CiMenuFries className="text-white text-xl" />
        </label>
        <div className="ml-4">
          <h1 className="text-lg font-semibold text-white">ChatApp</h1>
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
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mt-2">
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
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
              No chat selected, please start conversation by selecting anyone from your contacts
            </p>
            <p className="text-xs sm:text-sm text-gray-400">
              Experience beautiful animations and enhanced UI while chatting
            </p>
          </div>
          
          {/* Mobile instruction */}
          <div className="lg:hidden mt-6 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
            <p className="text-sm text-blue-300">
              📱 Tap the menu button above to view your contacts
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4 text-xs">
            <div className="glass-effect p-2 sm:p-3 rounded-lg">
              <div className="text-blue-400 mb-1">✨</div>
              <div className="text-xs">Animated Backgrounds</div>
            </div>
            <div className="glass-effect p-2 sm:p-3 rounded-lg">
              <div className="text-purple-400 mb-1">💬</div>
              <div className="text-xs">Real-time Chat</div>
            </div>
            <div className="glass-effect p-2 sm:p-3 rounded-lg">
              <div className="text-green-400 mb-1">🎨</div>
              <div className="text-xs">Beautiful UI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
