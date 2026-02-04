import express from 'express';
import upload from "../middlewares/multer.js";
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
    getAllVerifiedSellerProfiles,
    getVerifiedSellerProfile,
    getSellerVerifiedProducts,
    getSellerNotifications
    // verifySeller 
} from "../controllers/seller.controller.js";

const router = express.Router();


router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/logout", isAuthenticated, logoutSeller);
router.get("/profile", isAuthenticated, getSellerProfile);
router.put("/update-profile", isAuthenticated, isSeller, upload.single("profileImage"), updateSellerProfile);
router.post("/change-password", isAuthenticated, changeSellerPassword);
router.delete("/delete", isAuthenticated, isSeller, deleteSellerAccount);
router.get("/products", isAuthenticated, isSeller, getSellerProducts);
router.get("/verified-products", isAuthenticated, isSeller, getSellerVerifiedProducts);
router.get("/all", getAllVerifiedSellerProfiles);
router.get("/:id", getVerifiedSellerProfile);
router.get("/notifications",isAuthenticated,getSellerNotifications)


export default router;
