import React, { useState } from "react";
import useConversation from "../zustand/useConversation.js";
import axios from "axios";
import { API_CONFIG } from "../config/api.js";

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.timeout = API_CONFIG.AXIOS_CONFIG.timeout;

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();
  
  const sendMessages = async (message) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.MESSAGE.SEND(selectedConversation._id);
      console.log(`📤 Sending message to: ${API_CONFIG.BASE_URL}${endpoint}`);
      
      const res = await axios.post(endpoint, { message });
      setMessage([...messages, res.data]);
      setLoading(false);
      console.log("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Error in send messages:", error);
      setLoading(false);
      if (error.response?.status === 401) {
        console.log("🔐 Authentication required for sending messages");
      }
    }
  };
  
  return { loading, sendMessages };
};

export default useSendMessage;
