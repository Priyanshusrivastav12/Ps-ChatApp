import React from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";
import LoadingDots from "../../components/LoadingDots";

function Users() {
  const [allUsers, loading] = useGetAllUsers();
  console.log(allUsers);
  return (
    <div className="relative h-full">
      <h1 className="px-8 py-2 text-white font-semibold bg-gradient-to-r from-slate-800 to-slate-700 rounded-md shadow-lg border border-slate-600 relative overflow-hidden mx-2 mb-2">
        <span className="relative z-10">Messages</span>
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </h1>
      <div className="py-2 flex-1 overflow-y-auto animated-grid relative h-full">
        {/* Content container with higher z-index */}
        <div className="relative z-10">
          {allUsers.map((user, index) => (
            <User key={index} user={user} />
          ))}
        </div>
        
        {/* Loading state with small loading dots */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="glass-effect p-4 rounded-xl">
              <LoadingDots size="medium" />
              <p className="text-gray-300 text-xs mt-2 text-center">Loading users...</p>
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && allUsers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="glass-effect p-8 rounded-xl text-center">
              <p className="text-gray-300">No users found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Users;
