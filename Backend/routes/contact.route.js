import express from "express";
import { storeContact } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/create", storeContact);


export default router;
