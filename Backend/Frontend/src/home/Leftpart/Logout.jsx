import React, { useState } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeProvider";
import { API_CONFIG } from "../../config/api.js";

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = API_CONFIG.AXIOS_CONFIG.timeout;

function Logout() {
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      console.log(`🚪 Attempting logout to: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.LOGOUT}`);
      
      const res = await axios.post(API_CONFIG.ENDPOINTS.USER.LOGOUT);
      localStorage.removeItem("ChatApp");
      Cookies.remove("jwt");
      setLoading(false);
      toast.success("✅ Logged out successfully");
      window.location.reload();
    } catch (error) {
      console.error("❌ Logout error:", error);
      setLoading(false);
      if (error.response) {
        toast.error("Error: " + error.response.data.error);
      } else if (error.request) {
        toast.error("Network error: Unable to connect to server");
      } else {
        toast.error("Logout failed: " + error.message);
      }
    }
  };
  
  return (
    <div className={`p-4 border-t transition-colors duration-200 ${
      isDark ? 'border-slate-700' : 'border-gray-200'
    }`}>
      <button
        onClick={handleLogout}
        disabled={loading}
        className={`w-full flex items-center justify-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
          isDark 
            ? 'text-gray-300 hover:text-white hover:bg-slate-700/50' 
            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Logout"
      >
        <BiLogOutCircle className={`text-xl transition-transform duration-200 ${
          loading ? 'animate-spin' : 'group-hover:scale-110'
        }`} />
        <span className="font-medium text-sm">
          {loading ? 'Logging out...' : 'Logout'}
        </span>
      </button>
    </div>
  );
}

export default Logout;
