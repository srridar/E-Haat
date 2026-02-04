import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerSuperAdmin,
  loginAdmin,
  createAdmin,
  verifyUser,
  getAllProducts,
  getAllUsers,
  removeProduct,
  blockOrUnblockSeller,
  getAdminProfile,
  getAdminNotifications

} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/superadmin/register", registerSuperAdmin);
router.get("/profile-receiver", isAuthenticated, getAdminProfile);
router.post("/create-admin", createAdmin);
router.post("/enter-admin", loginAdmin);
router.post("/verify-user/:id", isAuthenticated, verifyUser);
router.get("/products", isAuthenticated, getAllProducts);
router.get("/users", isAuthenticated, getAllUsers);
router.delete("/product/:id", isAuthenticated, removeProduct);
router.route("/block-unblock/:id").post(isAuthenticated, blockOrUnblockSeller); 
router.get("/admin-notification",isAuthenticated,getAdminNotifications);

export default router;
