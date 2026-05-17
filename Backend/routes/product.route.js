import express from 'express'
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js";
import {
    CreateProduct,
    GetAllProduct,
    GetProductById,
    UpdateProduct,
    deleteProduct,
    GetAllProductOfSeller,
    saveSearchHistory,
    getProductBysearchAndRecommendation
    
} from "../controllers/product.controller.js"



const router = express.Router();

router.route("/create-product").post(isAuthenticated, upload.array("images", 5), CreateProduct);
router.route("/get-all-product").get(GetAllProduct);
router.route("/get-product/:id").get(GetProductById);
router.route("/update-product").get(isAuthenticated, upload.array("images", 5), UpdateProduct);
router.route("/delete-product").post(isAuthenticated, deleteProduct);
router.get("/seller/:id/products", GetAllProductOfSeller);
router.post("/search-history/save",isAuthenticated, saveSearchHistory);
router.get("/products", getProductBysearchAndRecommendation); 

 


export default router;
