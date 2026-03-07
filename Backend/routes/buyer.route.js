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
    getOrderById,
    rateTransporterByBuyer,
    rateSellerByBuyer,
    recommendedProducts,
    getBuyerNotifications,
    getTransporterById,
    getMyAllRequests,
    getMyTransportRequestData 

} from "../controllers/buyer.controller.js"

const router = express.Router();

router.route("/register").post(registerBuyer);
router.route("/login").post(loginBuyer);
router.route("/logout").post(isAuthenticated, logoutBuyer);
router.route("/profile").get(isAuthenticated, getBuyerProfile);
router.route("/update-profile").put(isAuthenticated, isBuyer, upload.single("profileImage"), updateBuyerProfile);      
router.route("/change-password").post(isAuthenticated, changeBuyerPassword);          
router.route("/get-all-orders").get(isAuthenticated, getMyOrdersByBuyer);
router.get("/track-order/:id",isAuthenticated,getOrderById);
router.route("/get-veried-products").get(getProductsFromVerifiedSellers);   //  
router.route("/make-order").post(isAuthenticated, createOrderByBuyer);
router.route("/rating-seller").post(isAuthenticated, rateSellerByBuyer);
router.route("/rating-transporter").post(isAuthenticated, rateTransporterByBuyer);
router.get("/recommendations", isAuthenticated, recommendedProducts);
router.get("/notifications",isAuthenticated,getBuyerNotifications); 
router.get("/gettransporter/:id",isAuthenticated, getTransporterById);
router.get("/my-requests",isAuthenticated,getMyAllRequests);
router.get("/get-transport-req/:id",isAuthenticated,getMyTransportRequestData);

export default router;


// getProductsFromVerifiedSellers