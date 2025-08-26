import React from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";
import LoadingDots from "../../components/LoadingDots";

function Users() {
  const [allUsers, loading] = useGetAllUsers();
  console.log(allUsers);
  return (
    <div className="relative h-full">
      {/* Users list content */}
      <div className="py-2 space-y-1">
        {allUsers.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
      
      {/* Loading state with small loading dots */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-sm">
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
  );
}

export default Users;
