import React, { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  // Try to get user data from localStorage first, then check for JWT tokens
  const getUserData = () => {
    const userData = localStorage.getItem("ChatApp");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("ChatApp");
      }
    }
    
    // Check for JWT tokens as fallback
    const cookieToken = Cookies.get("jwt");
    const localStorageToken = localStorage.getItem("jwt");
    
    if (cookieToken || localStorageToken) {
      console.log("🔑 JWT token found but no user data - may need to fetch user profile");
      // You could make an API call here to get user profile using the token
      return null; // For now, return null and let the app handle it
    }
    
    return null;
  };

  const [authUser, setAuthUser] = useState(getUserData());
  
  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
