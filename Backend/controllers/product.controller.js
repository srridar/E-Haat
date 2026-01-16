
import Order from '../models/Order.js';
import { Seller } from '../models/Seller.js'
import { Buyer } from '../models/Buyer.js'
import { Product } from '../models/Product.js'
import getDataUri from "../utils/getDataUri.js";


export const CreateProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock } = req.body;
        const sellerId = req.user.id;

        if (!name || !description || !category || !price || !stock) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        // verifying the seller

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            })
        }

        if (!seller.isVerified) {
            return res.status(403).json({
                message: "Only verified sellers can create products",
                success: false
            });
        }

        let images = [];

        if (req.files?.length) {
            for (const file of req.files) {
                const fileUri = getDataUri(file);

                const uploadResult = await cloudinary.v2.uploader.upload(fileUri.content, {
                    folder: "products",
                    resource_type: "image", // remove extra space
                });

                images.push({
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id,
                });
            }
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            seller: sellerId,
            images
        });

        seller.productsOwned.push(newProduct._id);
        await seller.save();

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product: newProduct
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}



export const GetAllProduct = async (req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: "seller",
                match: { isVerified: true },   // only verified sellers
                select: "name email phone"
            });     // verifiedSellers contains list of all verified sellers along with their products


        const verifiedProducts = products.filter(product => product.seller !== null);

        if (verifiedProducts.length === 0) {
            return res.status(404).json({ message: "No products found from verified sellers", success: false });
        }

        return res.status(200).json({
            success: true,
            products: verifiedProducts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}



export const GetProductById = async (req, res) => {
    try {

        const productId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
                success: false
            });
        }
        const product = await Product.findById(productId).populate('seller', 'name email phone address');
        if (!product) {
            return res.status(404).json({
                message: "No Product found with given id",
                success: false
            })
        }

        return res.status(200).json({
            message: "Product is found successfully !",
            success: true,
            product
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}



export const UpdateProduct = async (req, res) => {
    try {

        const { name, description, category, price, stock } = req.body;
        const sellerId = req.user.id;
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(400).json({
                message: "Product not found",
                sucess: false
            })
        }

        if (product.seller.toString() != requestedId) {
            return res.status(403).json({
                message: " your are not authorized to update product",
                success: false
            })
        }

        if (name) {
            product.name = name;
        }
        if (description) {
            product.description = description;
        }
        if (category) {
            product.category = category;
        }
        if (price) {
            product.price = price
        }
        if (stock) {
            product.stock = stock
        }

        if (req.files && req.files.length > 0) {
            for (let img of product.images) {
                await cloudinary.v2.uploader.destroy(img.public_id);
            }

            let images = [];
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const uploadResult = await cloudinary.v2.uploader.upload(fileUri.content, { folder: "products", resource_type: " images" });

                images.push({
                    url: uploadResult.secure_url,
                    public_id: uploadResult.public_id
                });
            }
            product.images = images;
        }

        await product.save();

        return res.status(200).json({
            message: "Product Updated Successfully !",           // shows that the 
            updatedProduct: product,
            success: true
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}



export const deleteProduct = async (req, res) => {
    try {
        const requestedId = req.user.id;   // Seller ID from authentication middleware
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        // Ensure only the owner can delete
        if (product.seller.toString() !== requestedId) {
            return res.status(403).json({
                message: "You are not authorized to delete this product",
                success: false
            });
        }

        // Remove product from Seller's productsOwned array
        await Seller.findByIdAndUpdate(requestedId, {
            $pull: { productsOwned: productId }
        });

        // Delete the product
        await Product.findByIdAndDelete(productId);

        return res.status(200).json({
            message: "Product deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


export const SearchFilterProduct = async (req, res) => {
    try {

        const { search, category, minPrice, maxPrice, inStock } = req.query;
        const query = {}

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);   // $gte means 
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (inStock == "true") {
            query.stock = { $gt: 0 };                            //  only those which are in stock
        }

        const products = await Product.find(query)
            .populate("seller", "name phone")
            .sort({ createdAt: -1 });


        if (products.length === 0) {
            return res.status(404).json({
                message: "No products found",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const RateAndReviewProduct = async (req, res) => {
    try {

        const { rating, productId, orderId } = req.body;
        const buyerId = req.user.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
        }

        // check if order exists and belongs to buyer
        const order = await Order.findOne({
            _id: orderId,
            buyer: buyerId,
            product: productId
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        if (order.status !== "DELIVERED") {
            return res.status(400).json({
                message: "You can rate transporter only after delivery",
                success: false
            });
        }

        // 4️⃣ Prevent double rating
        if (order.isTransportRated) {
            return res.status(400).json({
                message: "Transporter already rated for this order",
                success: false
            });
        }


        // check if transporter exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }


        // update transporter's rating
        const newTotalRatings = product.totalRatings + 1;
        const newRating = ((product.rating * product.totalRatings) + rating) / newTotalRatings;

        product.rating = Number(newRating.toFixed(1));
        product.totalRatings = newTotalRatings;

        order.isTransportRated = true;

        await product.save();
        await order.save();

        return res.status(200).json({
            message: "Product rated successfully",
            success: true,
            rating: product.rating
        });


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}