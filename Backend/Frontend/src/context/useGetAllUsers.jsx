import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import apiClient from "../utils/axios.js";
import { API_CONFIG } from "../config/api.js";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        // Try multiple ways to get the token
        const cookieToken = Cookies.get("jwt");
        const localStorageToken = localStorage.getItem("jwt");
        const userDataRaw = localStorage.getItem("ChatApp");
        
        console.log(`👥 Fetching users from: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.ALL_USERS}`);
        console.log(`🍪 JWT Cookie Token exists: ${!!cookieToken}`);
        console.log(`💾 JWT LocalStorage Token exists: ${!!localStorageToken}`);
        console.log(`👤 User data exists: ${!!userDataRaw}`);
        
        // Use the configured apiClient which will automatically handle authentication
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.USER.ALL_USERS);
        
        setAllUsers(response.data);
        setLoading(false);
        console.log(`✅ Fetched ${response.data.length} users`);
      } catch (error) {
        console.error("❌ Error in useGetAllUsers:", error);
        console.error("❌ Error response:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        setLoading(false);
        // Error handling is now done by the axios interceptor
      }
    };
    getUsers();
  }, []);
  
  return [allUsers, loading];
}

export default useGetAllUsers;
