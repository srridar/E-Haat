import express from 'express'
import upload from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import isBuyer from '../middlewares/isBuyer.js'
import {
    registerBuyer,
    loginBuyer,
    getBuyerProfile,
    logoutBuyer,
    updateBuyerProfile,
    changeBuyerPassword,
    getMyOrdersByBuyer,
    getProductsFromVerifiedSellers,
    createOrderByBuyer,
    rateTransporterByBuyer,
    rateSellerByBuyer,
    recommendedProducts
} from "../controllers/buyer.controller.js"

const router = express.Router();

router.route("/register").post(registerBuyer);
router.route("/login").post(loginBuyer);
router.route("/logout").get(isAuthenticated, logoutBuyer);
router.route("/profile").get(isAuthenticated, getBuyerProfile);
router.route("/update-profile").put(isAuthenticated, isBuyer, upload.single("profileImage"), updateBuyerProfile);       //
router.route("/change-password").post(isAuthenticated, changeBuyerPassword);          
router.route("/get-all-orders").post(isAuthenticated, getMyOrdersByBuyer);
router.route("/get-veried-products").get(isAuthenticated, getProductsFromVerifiedSellers);
router.route("/make-order").post(isAuthenticated, createOrderByBuyer);
router.route("/rating-seller").post(isAuthenticated, rateSellerByBuyer);
router.route("/rating-transporter").post(isAuthenticated, rateTransporterByBuyer);
router.get("/recommendations", isAuthenticated, recommendedProducts);


export default router;
