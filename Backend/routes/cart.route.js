import express from 'express'
import isAuthenticated from "../middlewares/isAuthenticated.js"
import isBuyer from '../middlewares/isBuyer.js'
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} from "../controllers/cart.controller.js"
const router = express.Router();


router.route("/add-to-cart").post(isAuthenticated, isBuyer, addToCart);
router.route("/get-cart").get(isAuthenticated, isBuyer, getCart);
router.route("/update-cart-item").post(isAuthenticated, isBuyer, updateCartItem);
router.route("/remove-from-cart").post(isAuthenticated, isBuyer, removeCartItem);



export default router;
