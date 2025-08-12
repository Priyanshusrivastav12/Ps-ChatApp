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
    <div className="w-full bg-slate-900 text-gray-300 relative overflow-hidden">
      <div>
        {!selectedConversation ? (
          <NoChatSelected />
        ) : (
          <>
            <Chatuser />
            <div
              className="flex-1 overflow-y-auto"
              style={{ maxHeight: "calc(92vh - 8vh)" }}
            >
              <Messages />
            </div>
            <Typesend />
          </>
        )}
      </div>
    </div>
  );
}

export default Right;

const NoChatSelected = () => {
  const [authUser] = useAuth();
  console.log(authUser);
  return (
    <>
      <div className="relative h-screen overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 animated-grid"></div>
        <div className="floating-particles absolute inset-0"></div>
        
        {/* Mobile menu button */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-ghost drawer-button lg:hidden absolute left-5 top-5 z-20 glass-effect"
        >
          <CiMenuFries className="text-white text-xl" />
        </label>
        
        {/* Welcome content */}
        <div className="flex h-screen items-center justify-center relative z-10">
          <div className="text-center glass-effect p-12 rounded-3xl shadow-2xl max-w-md mx-4 animated-border">
            {/* Animated welcome text */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent animate-pulse">
                Welcome
              </h1>
              <h2 className="text-2xl font-semibold text-white mt-2">
                {authUser.user.fullname}
              </h2>
            </div>
            
            {/* Decorative elements */}
            <div className="flex justify-center space-x-4 mb-6">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            {/* Main message */}
            <div className="space-y-4">
              <p className="text-lg text-gray-300 leading-relaxed">
                No chat selected, please start conversation by selecting anyone from your contacts
              </p>
              <p className="text-sm text-gray-400">
                Experience beautiful animations and enhanced UI while chatting
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="mt-8 grid grid-cols-3 gap-4 text-xs">
              <div className="glass-effect p-3 rounded-lg">
                <div className="text-blue-400 mb-1">✨</div>
                <div>Animated Backgrounds</div>
              </div>
              <div className="glass-effect p-3 rounded-lg">
                <div className="text-purple-400 mb-1">💬</div>
                <div>Real-time Chat</div>
              </div>
              <div className="glass-effect p-3 rounded-lg">
                <div className="text-green-400 mb-1">🎨</div>
                <div>Beautiful UI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
