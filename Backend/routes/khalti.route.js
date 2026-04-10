import express from "express";
import { handlePayment, lookupPayment } from "../controllers/khalti.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/initiate-payment", handlePayment);
router.post("/lookup-payment",  lookupPayment);


export default router;
