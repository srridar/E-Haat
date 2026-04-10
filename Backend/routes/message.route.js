import express from "express";
import {
  sendMessage,
  getMessages,
  editMessage,
  deleteMessage,
  getChatContacts
} from "../controllers/message.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendMessage);
router.get("/get/:id/:Model", isAuthenticated, getMessages);
router.put("/edit/:messageId", isAuthenticated, editMessage);
router.delete("/delete/:messageId", isAuthenticated, deleteMessage);
router.get("/contacts", isAuthenticated, getChatContacts);


export default router;