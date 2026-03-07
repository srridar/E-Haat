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
  blockOrUnblockSeller,
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
  getProductById,
  getSellerById,
  getTransporterById,
  getUserById,
  updateAdminProfile,
  changeAdminPassword,
  getAllOrders,
  updateOrderStatusByAdmin,
  getOrderById 
} from "../controllers/admin.controller.js";
import  upload  from "../middlewares/multer.js";

const router = express.Router();

router.post("/superadmin/register", registerSuperAdmin);
router.get("/profile-receiver", isAuthenticated, getAdminProfile);
router.post("/create-admin", createAdmin);
router.post("/enter-admin", loginAdmin);
router.post("/logout",isAuthenticated,logoutAdmin);
router.put("/update-profile",isAuthenticated, upload.single("profileImage"),updateAdminProfile);
router.route("/change-password").post(isAuthenticated, changeAdminPassword);
router.post("/verify-user", isAuthenticated, verifyUser);
router.get("/products", isAuthenticated, getAllProducts);
router.get("/all-users", isAuthenticated, getAllUsers);
router.delete("/product/:id", isAuthenticated, removeProduct);
router.route("/block-unblock/:id").post(isAuthenticated, blockOrUnblockSeller);
router.get("/admin-notification", isAuthenticated, getAdminNotifications);
router.get("/get-all-contact-request", isAuthenticated, getAllContactRequest);
router.get("/products-approval-req", isAuthenticated, getAllUnVerifiedProducts);
router.get("/sellers-approval-req", isAuthenticated, getAllUnVerifiedSellers)
router.get("/transporters-approval-req", isAuthenticated, getAllUnVerifiedTransporters)
router.get("/verified-transporters", isAuthenticated, getAllVerifiedTransporters)
router.get("/product-approval/:id", isAuthenticated, getProductById);
router.get("/seller-approval/:id", isAuthenticated, getSellerById);
router.get("/transporter-approval/:id", isAuthenticated, getTransporterById);
router.get("/gettransporter/:id", getTransporterById);

router.get("/get-all-orders",isAuthenticated,getAllOrders);
router.get("/order/:id", isAuthenticated, getOrderById);
router.put(
  "/update-order-status/:id",
  isAuthenticated,
  updateOrderStatusByAdmin
);

router.get("/contact-request-by/:id", isAuthenticated, getContactById);
router.delete("/delete-request/:id", isAuthenticated, deleteContact);
router.patch("/contact/read/:id", isAuthenticated, markAsRead);
router.post("/get-user-profile", isAuthenticated, getUserById);
router.post("/verify-product", isAuthenticated, verifyProduct );

export default router;
