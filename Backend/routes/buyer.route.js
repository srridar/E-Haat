import express from 'express'
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import isBuyer from '../middlewares/isBuyer.js'
import { rateSeller, rateProduct,  rateTransporter} from "../controllers/rating.controller.js";
import {
    registerBuyer,
    loginBuyer,
    getBuyerProfile,
    logoutBuyer,
    updateBuyerProfile,
    changeBuyerPassword,
    getMyOrdersByBuyer,
    createOrderByBuyer,
    getOrderById,
    getBuyerNotifications,
    setLocation,
    forgotPassword,
    verifyOtp,
    resetPassword,
    registerMultipleBuyers,



} from "../controllers/buyer.controller.js"
import { getComplaintHistory, raiseComplaint, uploadComplaintProof } from '../controllers/complaint.controller.js';
import { trackBuyerOrder, trackMainBuyerOrder } from '../controllers/tracking.controller.js';

const router = express.Router();

router.route("/register").post(registerBuyer);
router.route("/login").post(loginBuyer);
router.route("/logout").post(logoutBuyer);
router.route("/profile").get(isAuthenticated, isBuyer, getBuyerProfile);
router.route("/update-profile").put(isAuthenticated, isBuyer, upload.single("profileImage"), updateBuyerProfile);
router.route("/change-password").post(isAuthenticated, isBuyer, changeBuyerPassword);
router.route("/setlocation").put(isAuthenticated, isBuyer, setLocation);
router.route("/get-all-orders").get(isAuthenticated, isBuyer, getMyOrdersByBuyer);
router.get("/get-order/:orderId", isAuthenticated, isBuyer, getOrderById);
router.route("/make-order").post(isAuthenticated, isBuyer, createOrderByBuyer);
router.get("/notifications", isAuthenticated, isBuyer, getBuyerNotifications);

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/register-multiple", registerMultipleBuyers);

router.post("/seller-rate", isAuthenticated, rateSeller);
router.post("/product-rate", isAuthenticated, rateProduct);
router.post("/transporter-rate", isAuthenticated, rateTransporter);

router.post("/raise-complaint", isAuthenticated, isBuyer, raiseComplaint);
router.get("/get-complaint-history", isAuthenticated, isBuyer, getComplaintHistory);
router.post("/upload-proof", isAuthenticated, isBuyer, upload.single("complaintProof"), uploadComplaintProof);


router.get("/track-order/:orderId", isAuthenticated, isBuyer, trackBuyerOrder );
router.get("/track-main-order/:orderId", isAuthenticated, isBuyer, trackMainBuyerOrder );

export default router;

