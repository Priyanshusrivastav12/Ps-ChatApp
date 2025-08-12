import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { API_CONFIG } from "../../config/api.js";

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = API_CONFIG.AXIOS_CONFIG.timeout;

function Logout() {
  const [loading, setLoading] = useState(false);
  
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
    <>
      <hr />
      <div className=" h-[10vh] bg-transparent">
        <div>
          <BiLogOutCircle
            className="text-5xl text-white hover:bg-slate-700 duration-300 cursor-pointer rounded-full p-2 ml-2 mt-1"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
}

export default Logout;
