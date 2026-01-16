import express from "express";
import {
  storeContact,
  getAllContacts,
  getContactById,
  deleteContact,
  markAsRead,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/create", storeContact);
router.get("/all", getAllContacts);
router.get("/:id", getContactById);
router.delete("/:id", deleteContact);
router.patch("/read/:id", markAsRead);


export default router;
