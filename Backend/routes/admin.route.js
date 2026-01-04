import express from 'express'
import isAuthenticated from "../middlewares/isAuthenticated"
import {registerAdmin, 
        verifyUser , 
        getAllProducts , 
        getAllUsers , 
        removeProduct} from "../controllers/admin.controller"

const router=express.Router();

router.route("/register").post(registerAdmin);
router.route("/verifyUser/:id").post(verifyUser);
router.route("/getallproducts").get(getAllProducts);
router.route("/getallusers").get(getAllUsers);
router.route("/removeproduct").post(removeProduct);

