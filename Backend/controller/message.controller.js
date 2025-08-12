import { getReceiverSocketId, io } from "../SocketIO/server.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, messageType = 'text', fileUrl, fileName, fileSize, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; // current logged in user
    
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    
    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }
    
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      messageType,
      fileUrl,
      fileName,
      fileSize,
      replyTo,
      status: 'sent'
    });
    
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    
    // Save both in parallel
    await Promise.all([conversation.save(), newMessage.save()]);
    
    // Populate the reply message if it exists
    await newMessage.populate('replyTo', 'message senderId createdAt');
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Send the new message to receiver
      io.to(receiverSocketId).emit("newMessage", newMessage);
      
      // Update message status to delivered
      newMessage.status = 'delivered';
      await newMessage.save();
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id; // current logged in user
    
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate({
      path: "messages",
      populate: {
        path: "replyTo",
        select: "message senderId createdAt",
        model: "Message"
      }
    });
    
    if (!conversation) {
      return res.status(201).json([]);
    }
    
    // Mark messages as read for the current user
    await Message.updateMany(
      { 
        receiverId: senderId, 
        senderId: chatUser, 
        status: { $ne: 'read' } 
      },
      { 
        status: 'read', 
        readAt: new Date() 
      }
    );
    
    const messages = conversation.messages;
    res.status(201).json(messages);
  } catch (error) {
    console.log("Error in getMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;
    
    await Message.updateMany(
      { 
        senderId, 
        receiverId, 
        status: { $ne: 'read' } 
      },
      { 
        status: 'read', 
        readAt: new Date() 
      }
    );
    
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesRead", { readBy: receiverId });
    }
    
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.log("Error in markMessagesAsRead", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      reaction => reaction.userId.toString() === userId.toString() && reaction.emoji === emoji
    );
    
    if (existingReaction) {
      // Remove the reaction
      message.reactions = message.reactions.filter(
        reaction => !(reaction.userId.toString() === userId.toString() && reaction.emoji === emoji)
      );
    } else {
      // Add new reaction
      message.reactions.push({
        userId,
        emoji,
        createdAt: new Date()
      });
    }
    
    await message.save();
    
    // Emit to both sender and receiver
    const senderSocketId = getReceiverSocketId(message.senderId);
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    
    const reactionData = {
      messageId,
      userId,
      emoji,
      isAdded: !existingReaction
    };
    
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageReaction", reactionData);
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageReaction", reactionData);
    }
    
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in addReaction", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message: newMessage } = req.body;
    const userId = req.user._id;
    
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    
    // Check if user is the sender
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to edit this message" });
    }
    
    // Update message
    message.message = newMessage;
    message.isEdited = true;
    message.editedAt = new Date();
    
    await message.save();
    
    // Emit to both sender and receiver
    const senderSocketId = getReceiverSocketId(message.senderId);
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageEdited", message);
    }
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageEdited", message);
    }
    
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in editMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
