import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js"
import isBuyer from "../middlewares/isBuyer.js"

import {
     placeOrder,
     getBuyerOrders,
     getSingleOrder,
     cancelOrder
} from '../controllers/sellerOrder.controller.js';

const router = express.Router();

router.route("/place-order").post(isAuthenticated,isBuyer,placeOrder);
router.route("/all-orders").get(isAuthenticated,isBuyer,getBuyerOrders);
router.route("/order/:orderId").get(isAuthenticated,isBuyer,getSingleOrder);
router.route("/order/:orderId/cancel").post(isAuthenticated,isBuyer,cancelOrder); 


export default router;


//   done