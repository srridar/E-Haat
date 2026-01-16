import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  registerAdmin,
  verifyUser,
  getAllProducts,
  getAllUsers,
  removeProduct
} from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/register", registerAdmin);

router.post("/verify-user/:id", isAuthenticated, verifyUser);

router.get("/products", isAuthenticated, getAllProducts);

router.get("/users", isAuthenticated, getAllUsers);

router.delete("/product/:id", isAuthenticated, removeProduct);

export default router;
