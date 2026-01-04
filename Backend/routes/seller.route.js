import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated";
import {
    registerSeller,
    loginSeller,
    getSellerProfile,
    logoutSeller,
    updateSellerProfile,
    changeSellerPassword,
    getSellerProducts,
    deleteSellerAccount,
    blockOrUnblockSeller
} from "../controllers/seller.controller";

const router = express.Router();


router.route("/register").post(registerSeller);               
router.route("/login").post(loginSeller);                    
router.route("/logout").get(isAuthenticated, logoutSeller);  
router.route("/profile").get(isAuthenticated, getSellerProfile);          
router.route("/profile/update").post(isAuthenticated, updateSellerProfile); 
router.route("/profile/changepassword").post(isAuthenticated, changeSellerPassword); 
router.route("/delete").delete(isAuthenticated, deleteSellerAccount);      
router.route("/products").get(isAuthenticated, getSellerProducts);         
router.route("/block-unblock/:id").post(isAuthenticated, blockOrUnblockSeller); 

export default router;
