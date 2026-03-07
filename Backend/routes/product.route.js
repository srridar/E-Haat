import express from 'express'
import isAuthenticated from "../middlewares/isAuthenticated.js"
import  upload  from "../middlewares/multer.js";
import {CreateProduct, 
    GetAllProduct, 
    GetProductById, 
    UpdateProduct, 
    deleteProduct, 
    HireTransporter,
    SearchFilterProduct, 
    getAllProductsSorted,
    RateAndReviewProduct} from "../controllers/product.controller.js"

const router=express.Router();

router.route("/create-product").post(isAuthenticated,upload.array("images", 5),  CreateProduct);
router.route("/get-all-product").get(GetAllProduct);
router.get("/get-recommended-products", getAllProductsSorted);
router.route("/get-product/:id").get(GetProductById);
router.route("/update-product").get(isAuthenticated,upload.array("images", 5), UpdateProduct);
router.route("/delete-product").post(isAuthenticated, deleteProduct);
router.route("/searchfilterproduct").post(isAuthenticated,SearchFilterProduct);
router.route("/rateandreviewproduct").post(isAuthenticated,RateAndReviewProduct);
router.post("/hiretransporter", isAuthenticated, HireTransporter);


export default router;
