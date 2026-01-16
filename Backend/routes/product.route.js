import express from 'express'
import isAuthenticated from "../middlewares/isAuthenticated.js"
import  upload  from "../middlewares/multer.js";
import {CreateProduct, 
    GetAllProduct, 
    GetProductById, 
    UpdateProduct, 
    deleteProduct, 
    SearchFilterProduct, 
    RateAndReviewProduct} from "../controllers/product.controller.js"

const router=express.Router();

router.route("/create-product").post(isAuthenticated,upload.array("images", 5),  CreateProduct);
router.route("/get-all-product").post(GetAllProduct);
router.route("/get-productbyid").get(isAuthenticated,GetProductById);
router.route("/update-product").get(isAuthenticated,upload.array("images", 5), UpdateProduct);
router.route("/delete-product").post(isAuthenticated, deleteProduct);
router.route("/searchfilterproduct").post(isAuthenticated,SearchFilterProduct);
router.route("/rateandreviewproduct").post(isAuthenticated,RateAndReviewProduct);


export default router;
