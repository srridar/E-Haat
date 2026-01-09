import express from 'express'
import { upload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated"
import { registerBuyer, 
    loginBuyer, 
    getBuyerProfile, 
    logoutBuyer, 
    recommendProducts, 
    updateBuyerProfile, 
    changeBuyerPassword, 
    getMyOrdersByBuyer, 
    getProductsFromVerifiedSellers, 
    createOrderByBuyer, 
    rateTransporterByBuyer, 
    rateSellerByBuyer } from "../controllers/buyer.controller"

const router = express.Router();

router.route("/register").post(registerBuyer);
router.route("/login").post(loginBuyer);
router.route("/logout").get(isAuthenticated, logoutBuyer);
router.route("/buyerprofile").get(isAuthenticated, getBuyerProfile);
router.route("/update-profile").put(isAuthenticated,upload.single("profileImage"), updateBuyerProfile);
router.route("/change-password").post(isAuthenticated, changeBuyerPassword);
router.route("/get-all-orders").post(isAuthenticated, getMyOrdersByBuyer);
router.route("/get-veried-products").get(isAuthenticated, getProductsFromVerifiedSellers);
router.route("/make-order").post(isAuthenticated, createOrderByBuyer);
router.route("/rating-seller").post(isAuthenticated, rateSellerByBuyer);
router.route("/rating-transporter").post(isAuthenticated, rateTransporterByBuyer);
router.get("/recommendations", isAuthenticated, recommendProducts);



