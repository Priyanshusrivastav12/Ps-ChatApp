import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_CONFIG } from "../config/api.js";

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = API_CONFIG.AXIOS_CONFIG.timeout;

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwt");
        console.log(`👥 Fetching users from: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.ALL_USERS}`);
        console.log(`🍪 JWT Token exists: ${!!token}`);
        
        const response = await axios.get(API_CONFIG.ENDPOINTS.USER.ALL_USERS, {
          headers: {
            ...API_CONFIG.AXIOS_CONFIG.headers,
          },
          // Don't send Authorization header, rely on cookies only
        });
        
        setAllUsers(response.data);
        setLoading(false);
        console.log(`✅ Fetched ${response.data.length} users`);
      } catch (error) {
        console.error("❌ Error in useGetAllUsers:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        setLoading(false);
        if (error.response?.status === 401) {
          console.log("🔐 Authentication required - redirecting to login");
          // Handle authentication error (could redirect to login)
        }
      }
    };
    getUsers();
  }, []);
  
  return [allUsers, loading];
}

export default useGetAllUsers;
