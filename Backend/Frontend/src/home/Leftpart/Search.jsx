import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useGetAllUsers from "../../context/useGetAllUsers";
import useConversation from "../../zustand/useConversation";
import { useTheme } from "../../context/ThemeProvider";
import toast from "react-hot-toast";

function Search() {
  const [search, setSearch] = useState("");
  const [allUsers] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();
  const { isDark } = useTheme();
  console.log(allUsers);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    const conversation = allUsers.find((user) =>
      user.fullname?.toLowerCase().includes(search.toLowerCase())
    );
    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
      // Close mobile drawer when user is selected
      const drawerToggle = document.getElementById("my-drawer-2");
      if (drawerToggle && window.innerWidth < 1024) {
        drawerToggle.checked = false;
      }
    } else {
      toast.error("User not found");
    }
  };
  
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-2">
          <label className={`border rounded-xl p-3 flex items-center gap-2 flex-1 transition-colors duration-300 ${
            isDark 
              ? 'border-slate-700 bg-slate-800/60 focus-within:border-blue-500/50' 
              : 'border-gray-300 bg-gray-50 focus-within:border-blue-500'
          }`}>
            <input
              id="search-users"
              name="search"
              type="text"
              className={`grow outline-none bg-transparent text-sm transition-colors duration-200 ${
                isDark 
                  ? 'text-white placeholder-gray-400' 
                  : 'text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className={`transition-colors duration-300 rounded-xl p-3 flex items-center justify-center min-w-[48px] ${
              isDark 
                ? 'bg-blue-600/80 hover:bg-blue-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <FaSearch className="text-lg" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default Search;
