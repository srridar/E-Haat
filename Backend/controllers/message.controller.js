import { Message } from '../models/Chat.js';
import mongoose from 'mongoose';
import { io, getReceiverSocketId } from '../index.js';


const getSenderModel = (role) => {
  if (role === "admin" || role === "superadmin") return "Admin";
  if (role === "seller") return "Seller";
  if (role === "buyer") return "Buyer";
  if (role === "transporter") return "TransportProvider";
  return "";
};


const getUserId = (user) => {
  return user.adminId || user.sellerId || user.transporterId || user._id;
};


export const sendMessage = async (req, res) => {
  try {
    const { receiver, receiverModel, text } = req.body;
 
    if (!text || !receiver || !receiverModel) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    let senderModell = "";

    if (req.user.role === "admin" || req.user.role === "superadmin") {
      senderModell = "Admin";
    } else if (req.user.role === "seller") {
      senderModell = "Seller";
    } else if (req.user.role === "buyer") {
      senderModell = "Buyer";
    } else if (req.user.role === "transporter") {
      senderModell = "TransportProvider";
    }

    const newMessage = await Message.create({
      sender: req.user.adminId || req.user.sellerId || req.user.transporterId || req.user.buyerId,
      senderModel: senderModell,
      receiver,
      receiverModel,
      text,
    });


    if (receiverModel === "Admin") {
      adminSockets.forEach((socketId) => {
        io.to(socketId).emit("newMessage", newMessage);
      });
    } else {
      const receiverSocketId = getReceiverSocketId(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "error occur !",
      success: false
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id, Model } = req.params;
    let currentUserModel = "";
    if (req.user.role === "admin" || req.user.role === "superadmin") {
      currentUserModel = "Admin";
    } else if (req.user.role === "seller") {
      currentUserModel = "Seller";
    } else if (req.user.role === "buyer") {
      currentUserModel = "Buyer";
    } else if (req.user.role === "transporter") {
      currentUserModel = "TransportProvider";
    }

    const currentUserId =
      req.user.adminId ||
      req.user.sellerId ||
      req.user.transporterId ||
      req.user.buyerId;

    let query = {};

    // ✅ ADMIN LOGIC (IMPORTANT)
    if (req.user.role === "admin" || req.user.role === "superadmin") {
      query = {
        $or: [
          { sender: id, senderModel: Model },
          { receiver: id, receiverModel: Model },
        ],
      };
    } else {
      // ✅ NORMAL USER LOGIC
      query = {
        $or: [
          {
            sender: currentUserId,
            senderModel: currentUserModel,
            receiver: id,
            receiverModel: Model,
          },
          {
            sender: id,
            senderModel: Model,
            receiver: currentUserId,
            receiverModel: currentUserModel,
          },
        ],
      };
    }

    const messages = await Message.find(query).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const currentUserId = getUserId(req.user);
    const currentUserModel = getSenderModel(req.user.role);

    if (message.sender.toString() !== currentUserId.toString() || message.senderModel !== currentUserModel) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own messages",
      });
    }

    message.text = text;
    message.edited = true;
    await message.save();

    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error("Edit Message Error:", error);
    res.status(500).json({ success: false });
  }
};


export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const currentUserId = getUserId(req.user);
    const currentUserModel = getSenderModel(req.user.role);

    if (message.sender.toString() !== currentUserId.toString() || message.senderModel !== currentUserModel) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    await message.deleteOne();
    res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ success: false });
  }
};


export const getChatContacts = async (req, res) => {
  try {


    const myId = req.user.adminId || req.user.sellerId || req.user.buyerId || req.user.transporterId;

    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }]
    }).sort({ createdAt: -1 });

    const contactMap = new Map();


    for (const msg of messages) {
      const isMeSender = String(msg.sender) === String(myId);

      const contactId = isMeSender ? msg.receiver : msg.sender;
      const contactModel = isMeSender ? msg.receiverModel : msg.senderModel;

      if (!contactMap.has(String(contactId))) {
        const userModel = mongoose.model(contactModel);
        const userDetails = await userModel.findById(contactId).select("name");

        contactMap.set(String(contactId), {
          _id: contactId,
          name: userDetails?.name || "Unknown User",
          role: contactModel.toLowerCase(),
          lastMessage: msg.text,
          time: msg.createdAt
        });
      }
    }

    const contacts = Array.from(contactMap.values());

    return res.status(200).json({
      success: true,
      users: contacts
    });

  } catch (error) {
    console.error("Contact Fetch Error:", error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};