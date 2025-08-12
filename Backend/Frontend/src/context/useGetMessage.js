import React, { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation.js";
import axios from "axios";
import { API_CONFIG } from "../config/api.js";

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = API_CONFIG.AXIOS_CONFIG.timeout;

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      if (selectedConversation && selectedConversation._id) {
        try {
          const endpoint = API_CONFIG.ENDPOINTS.MESSAGE.GET(selectedConversation._id);
          console.log(`💬 Fetching messages from: ${API_CONFIG.BASE_URL}${endpoint}`);
          
          const res = await axios.get(endpoint);
          setMessage(res.data);
          setLoading(false);
          console.log(`✅ Fetched ${res.data.length} messages`);
        } catch (error) {
          console.error("❌ Error in getting messages:", error);
          setLoading(false);
          if (error.response?.status === 401) {
            console.log("🔐 Authentication required for messages");
          }
        }
      }
    };
    getMessages();
  }, [selectedConversation, setMessage]);
  
  return { loading, messages };
};

export default useGetMessage;
