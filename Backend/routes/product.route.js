import express from 'express'
import isAuthenticated from "../middlewares/isAuthenticated"
import {CreateProduct, 
    GetAllProduct, 
    GetProductById, 
    UpdateProduct, 
    deleteProduct, 
    SearchFilterProduct, 
    RateAndReviewProduct} from "../controllers/product.controller"

const router=express.Router();

router.route("/createproduct").post(isAuthenticated, CreateProduct);
router.route("/getallproduct").post(GetAllProduct);
router.route("/getproductbyid").get(isAuthenticated,GetProductById);
router.route("/updateproduct").get(isAuthenticated,UpdateProduct);
router.route("/deleteproduct").post(isAuthenticated, deleteProduct);
router.route("/searchfilterproduct").post(isAuthenticated,SearchFilterProduct);
router.route("/rateandreviewproduct").post(isAuthenticated,RateAndReviewProduct);



