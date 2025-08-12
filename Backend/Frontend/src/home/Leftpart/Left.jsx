import React from "react";
import Search from "./Search";
import Users from "./Users";
import Logout from "./Logout";

function Left() {
  return (
    <div className="w-full h-full bg-black text-gray-300 flex flex-col">
      {/* Mobile header */}
      <div className="lg:hidden p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-center bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          ChatApp
        </h1>
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
    </div>
  );
}

export default Left;
