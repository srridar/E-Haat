import express from 'express';
import upload  from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isSeller from '../middlewares/isSeller.js'
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
} from "../controllers/seller.controller.js";

const router = express.Router();


router.route("/register").post(registerSeller);               
router.route("/login").post(loginSeller);                    
router.route("/logout").get(isAuthenticated, logoutSeller);  
router.route("/profile").get(isAuthenticated, getSellerProfile);          
router.route("/update-profile").put(isAuthenticated,isSeller,upload.single("profileImage"), updateSellerProfile); 
router.route("/change-password").post(isAuthenticated, changeSellerPassword); 
router.route("/delete").delete(isAuthenticated, deleteSellerAccount);      
router.route("/products").get(isAuthenticated, getSellerProducts);         
router.route("/block-unblock/:id").post(isAuthenticated, blockOrUnblockSeller); 

export default router;
