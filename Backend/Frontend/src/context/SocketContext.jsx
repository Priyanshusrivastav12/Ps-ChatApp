import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";
import { API_CONFIG } from "../config/api.js";

const socketContext = createContext();

// it is a hook.
export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();

  useEffect(() => {
    if (authUser) {
      console.log(`🔌 Connecting to Socket.IO server: ${API_CONFIG.SOCKET_URL}`);
      
      const socketInstance = io(API_CONFIG.SOCKET_URL, {
        query: {
          userId: authUser.user._id,
        },
        transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
        timeout: 20000,
        forceNew: true,
      });

      // Connection event handlers
      socketInstance.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
      });

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from Socket.IO server:', reason);
      });
      
      setSocket(socketInstance);
      
      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
        console.log(`👥 Online users updated: ${users.length} users`);
      });
      
      return () => {
        console.log('🔌 Closing Socket.IO connection');
        socketInstance.close();
      };
    } else {
      if (socket) {
        console.log('🔌 Closing Socket.IO connection (user logged out)');
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
