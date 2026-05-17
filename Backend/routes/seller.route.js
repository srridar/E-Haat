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
    getSellerVerifiedProducts,
    getSellerNotifications,
    setLocation,
    editProduct,
    sellerStatus,
    sellerKYC,
    getSellerOrders,
    acceptSellerOrder,
    rejectSellerOrder,
    markPreparing,
    markReadyForPickup,
    uploadPackingProof,
    getSellerOrderDetails
} from "../controllers/seller.controller.js";

import { restockProduct } from "../controllers/inventory.controller.js";

const router = express.Router();

router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.post("/logout", logoutSeller);
router.get("/profile", isAuthenticated, isSeller, getSellerProfile);
router.route("/setlocation").put(isAuthenticated, isSeller, setLocation);
router.put("/update-profile", isAuthenticated, isSeller, upload.single("profileImage"), updateSellerProfile);
router.post("/change-password", isAuthenticated, isSeller, changeSellerPassword);
router.delete("/delete", isAuthenticated, isSeller, deleteSellerAccount);
router.get("/products", isAuthenticated, isSeller, getSellerProducts);
router.get("/verified-products", isAuthenticated, isSeller, getSellerVerifiedProducts);
router.get("/notifications", isAuthenticated, isSeller, getSellerNotifications)
router.put("/edit-product/:productId", isAuthenticated, isSeller, upload.array("images", 5), editProduct);
router.get("/verification-status", isAuthenticated, isSeller, sellerStatus);
router.post(  "/submitkyc",isAuthenticated,
    isSeller,
    (req, res, next) => {
        upload.fields([
            { name: "citizenshipCard", maxCount: 1 },
            { name: "NationalIDCard", maxCount: 1 },
            { name: "businessRegistration", maxCount: 1 },
            { name: "PANcard", maxCount: 1 }
        ])(req, res, (err) => {

            if (err) {
                console.error("MULTER ERROR FIELD:", err.field);

                return res.status(400).json({
                    success: false,
                    error: err.message
                });
            }
            next();
        });
    },

    sellerKYC
);


router.get("/orders", isAuthenticated, isSeller, getSellerOrders);
router.patch("/order/:sellerOrderId/accept", isAuthenticated, isSeller, acceptSellerOrder);
router.patch("/order/:sellerOrderId/reject", isAuthenticated, isSeller, rejectSellerOrder);
router.patch("/order/:sellerOrderId/markpreparing", isAuthenticated, isSeller, markPreparing);
router.patch("/order/:sellerOrderId/markreadyforpickup", isAuthenticated, isSeller, markReadyForPickup);
router.post("/order/:sellerOrderId/upload-proof", isAuthenticated, isSeller, upload.array("proofImages", 5), uploadPackingProof);
router.patch("/products/:productId/restock", isAuthenticated, isSeller, restockProduct);

router.get("/order-details/:sellerOrderId",isAuthenticated, isSeller, getSellerOrderDetails);


export default router;   // done
