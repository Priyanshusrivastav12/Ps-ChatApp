import React, { useState } from "react";
import useConversation from "../zustand/useConversation.js";
import apiClient from "../utils/axios.js";
import { API_CONFIG } from "../config/api.js";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();
  
  const sendMessages = async (messageData) => {
    setLoading(true);
    try {
      const endpoint = API_CONFIG.ENDPOINTS.MESSAGE.SEND(selectedConversation._id);
      console.log(`📤 Sending message to: ${API_CONFIG.BASE_URL}${endpoint}`);
      
      const res = await apiClient.post(endpoint, messageData);
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
