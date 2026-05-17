import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerSuperAdmin,
  loginAdmin,
  createAdmin,
  logoutAdmin,
  verifyUser,
  verifyProduct,
  getAllProducts,
  getAllUsers,
  removeProduct,
  getAdminProfile,
  getAdminNotifications,
  markAsRead,
  deleteContact,
  getContactById,
  getAllContactRequest,
  getAllUnVerifiedTransporters,
  getAllUnVerifiedSellers,
  getAllUnVerifiedProducts,
  getAllVerifiedTransporters,
  blockOrUnblockProduct,
  getProductById,
  getSellerById,
  getTransporterById,
  getUserById,
  updateAdminProfile,
  changeAdminPassword,
  getAllOrders,
  updateOrderStatusByAdmin,
  blockOrUnblockUser,
  getOrderById,
  assignTransporter
} from "../controllers/admin.controller.js";
import upload from "../middlewares/multer.js";
import { resolveComplaint } from '../controllers/complaint.controller.js';

const router = express.Router();

router.post("/superadmin/register", registerSuperAdmin);                      //  to register super admin 
router.post("/create-admin", isAuthenticated, createAdmin);
router.post("/enter-admin", loginAdmin);
router.post("/logout", logoutAdmin);
router.get("/profile-receiver", isAuthenticated, getAdminProfile);
router.put("/update-profile", isAuthenticated, upload.single("profileImage"), updateAdminProfile);
router.route("/change-password").post(isAuthenticated, changeAdminPassword);
router.get("/all-users", isAuthenticated, getAllUsers);
router.get("/products", isAuthenticated, getAllProducts);
router.get("/product/:id", isAuthenticated, getProductById);
router.get("/products-approval-req", isAuthenticated, getAllUnVerifiedProducts);           // used
router.delete("/product/:id", isAuthenticated, removeProduct);
router.put("/block-unblock-product", isAuthenticated, blockOrUnblockProduct);
router.post("/verify-product", isAuthenticated, verifyProduct);
router.post("/verify-user", isAuthenticated, verifyUser);
router.put("/block-unblock", isAuthenticated, blockOrUnblockUser);
router.get("/admin-notification", isAuthenticated, getAdminNotifications);
router.get("/get-all-contact-request", isAuthenticated, getAllContactRequest);
router.get("/sellers-approval-req", isAuthenticated, getAllUnVerifiedSellers)
router.get("/transporters-approval-req", isAuthenticated, getAllUnVerifiedTransporters)
router.get("/verified-transporters", isAuthenticated, getAllVerifiedTransporters)
router.get("/seller/:id", isAuthenticated, getSellerById);
router.get("/transporter/:id", isAuthenticated, getTransporterById);

router.get("/get-all-orders", isAuthenticated, getAllOrders);
router.get("/order/:id", isAuthenticated, getOrderById);
router.put("/update-order-status/:id", isAuthenticated, updateOrderStatusByAdmin);
router.get("/contact/:id", isAuthenticated, getContactById);
router.delete("/delete-contact/:id", isAuthenticated, deleteContact);
router.patch("/contact/read/:id", isAuthenticated, markAsRead);
router.post("/get-user-profile", isAuthenticated, getUserById);

router.post("/assign-transporter", isAuthenticated, assignTransporter);
router.post("/resolve-complaint", isAuthenticated, resolveComplaint);



export default router;
