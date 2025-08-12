import React, { useState } from "react";
import Search from "./Search";
import Users from "./Users";
import Logout from "./Logout";
import UserProfile from "../../components/UserProfile";
import { useAuth } from "../../context/AuthProvider";
import { IoPersonCircle, IoSettings } from "react-icons/io5";

function Left() {
  const [authUser] = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="w-full h-full bg-black text-gray-300 flex flex-col">
      {/* Header with Profile */}
      <div className="flex-shrink-0 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {/* App title for mobile */}
          <h1 className="lg:hidden text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            ChatApp
          </h1>
          
          {/* Desktop profile section */}
          <div className="hidden lg:flex items-center space-x-3 flex-1">
            <div 
              className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 cursor-pointer hover:ring-2 hover:ring-blue-400/50 transition-all"
              onClick={() => setShowProfile(true)}
            >
              {authUser?.user?.avatar ? (
                <img
                  src={authUser.user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <IoPersonCircle className="text-gray-400 text-3xl" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-medium truncate">
                {authUser?.user?.fullname}
              </h2>
              <p className="text-xs text-gray-400 truncate">
                {authUser?.user?.bio || 'Hey there! I am using ChatApp.'}
              </p>
            </div>
          </div>
          
          {/* Settings button */}
          <button
            onClick={() => setShowProfile(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Profile Settings"
          >
            <IoSettings className="text-lg" />
          </button>
        </div>
      </div>
      
      {/* Search component */}
      <div className="flex-shrink-0">
        <Search />
      </div>
      
      {/* Users list - scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <Users />
      </div>
      
      {/* Logout - fixed at bottom */}
      <div className="flex-shrink-0">
        <Logout />
      </div>
      
      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}

export default Left;
