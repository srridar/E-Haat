import express from 'express'
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
router.route("/getbuyerprofile").get(isAuthenticated, getBuyerProfile);
router.route("/updatebuyerprofile").post(isAuthenticated, updateBuyerProfile);
router.route("/changepassword").post(isAuthenticated, changeBuyerPassword);
router.route("/getallorders").post(isAuthenticated, getMyOrdersByBuyer);
router.route("/getveriedproducts").get(isAuthenticated, getProductsFromVerifiedSellers);
router.route("/makeorder").post(isAuthenticated, createOrderByBuyer);
router.route("/ratingseller").post(isAuthenticated, rateSellerByBuyer);
router.route("/ratingtransporter").post(isAuthenticated, rateTransporterByBuyer);
router.get("/recommendations", isAuthenticated, recommendProducts);



