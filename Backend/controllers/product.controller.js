import {Order }from '../models/Order.js';
import { Seller } from '../models/Seller.js'
import { Product } from '../models/Product.js'
import getDataUri from "../utils/getDataUri.js";
import mongoose from 'mongoose';
import { Buyer } from "../models/Buyer.js";
import { TransportProvider } from "../models/TransportProvider.js";
import SearchHistory from "../models/SearchHistory.js";


export const CreateProduct = async (req, res) => {
    try {
        const { name, description, category, price, stock, brand, unit } = req.body;
        const sellerId = req.user.sellerId;

        if (!name || !description || !category || !price || !stock || !brand || !unit) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            });
        }

        if (!seller.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Only verified sellers can create products",
            });
        }

        let images = [];
        if (req.files?.length) {
            images = req.files.map(file => ({
                url: file.path,
                public_id: file.filename,
            }));
        }

        const product = await Product.create({
            name,
            description,
            category,
            price,
            stock,
            unit,
            brand,
            seller: sellerId,
            images,
        });


        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const GetAllProduct = async (req, res) => {
    try {

        const products = await Product.find()
            .populate({
                path: "seller",
                match: { isVerified: true },
                select: "name email phone city"
            });


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
        const product = await Product.findById(productId).populate('seller', 'name email phone location');
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

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

const cosineSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;

    const words1 = text1.toLowerCase().split(" ");
    const words2 = text2.toLowerCase().split(" ");

    const allWords = [...new Set([...words1, ...words2])];

    const vector1 = allWords.map(
        word => words1.filter(w => w === word).length
    );

    const vector2 = allWords.map(
        word => words2.filter(w => w === word).length
    );

    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);

    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
};

export const GetAllProductOfSeller = async (req, res) => {
    try {
        const { search = "", categories = "" } = req.query;
        const { id } = req.params;

        const selectedCategories = categories ? categories.split(",") : [];
        const hasSearch = search.trim() !== "";
        const hasCategory = selectedCategories.length > 0;

        const seller = await Seller.findById(id).select("name email phone city isVerified");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (!seller.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Seller is not verified"
            });
        }

        let query = { seller: id };

        if (hasSearch) {
            query.name = { $regex: search, $options: "i" };
        }

        if (hasCategory) {
            query.category = { $in: selectedCategories };
        }

        const products = await Product.find(query).populate({
            path: "seller",
            select: "name email phone city"
        });

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No products found"
            });
        }

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const saveSearchHistory = async (req, res) => {
    try {

        const buyerId = req.user?.buyerId;
        const { search, categories } = req.body;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized buyer",
            });
        }

        if (!search || search.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }


        const normalizedSearch = search.trim().toLowerCase();

        const history = await SearchHistory.findOneAndUpdate(
            {
                buyer: buyerId,
                searchQuery: normalizedSearch,
            },
            {
                $set: {
                    category: categories || null,
                    updatedAt: new Date(),
                },

                // Only used during insertion
                $setOnInsert: {
                    buyer: buyerId,
                    searchQuery: normalizedSearch,
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        // Get latest 20 searches (based on updatedAt)
        const latestSearches = await SearchHistory.find({ buyer: buyerId })
            .sort({ updatedAt: -1 })   // latest first
            .limit(20)
            .select("_id");

        const latestIds = latestSearches.map(item => item._id);

        // 3    Delete old searches
        await SearchHistory.deleteMany({
            buyer: buyerId,
            _id: { $nin: latestIds }
        });

        return res.status(200).json({
            success: true,
            message: "Search saved & cleaned successfully",
            data: history,
        });

    } catch (error) {
        console.error("Save Search Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getProductBysearchAndRecommendation = async (req, res) => {
    try {
        const buyerId = req.user?.buyerId;
        const {
            search = "",
            category,
            minPrice,
            maxPrice,
            inStock,
            sortBy = "recommended"
        } = req.query;


        let filterQuery = {
            isActive: true,
            isVerified: true
        };

        if (search && search.trim()) {
            filterQuery.name = { $regex: search, $options: "i" };
        }

        if (category) {
            filterQuery.category = { $in: category.split(",") };
        }

        if (minPrice || maxPrice) {
            filterQuery.price = {};
            if (minPrice) filterQuery.price.$gte = Number(minPrice);
            if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
        }

        if (inStock === "true") {
            filterQuery.stock = { $gt: 0 };
        }


        // 2. BUYER DATA (LOCATION + INTEREST)

        let buyer = null;
        let buyerLat = null;
        let buyerLon = null;

        if (buyerId) {
            buyer = await Buyer.findById(buyerId);
            if (buyer?.location?.coordinates) {
                buyerLon = buyer.location.coordinates[0];
                buyerLat = buyer.location.coordinates[1];
            }
        }


        // 3. USER INTEREST


        let searchText = "";
        let purchaseText = "";

        if (buyer) {
            const searchHistory = await SearchHistory.find({ buyer: buyerId }).sort({ createdAt: -1 }).limit(10);

            searchHistory.forEach(item => {
                searchText += item.searchQuery + " ";
            });

            const orders = await Order.find({ buyer: buyerId }).populate({
                path: "products.product",
                select: "name category description"
            });

            orders.forEach(order => {
                order.products.forEach(item => {
                    if (item.product) {
                        purchaseText += `${item.product.name} ${item.product.category} ${item.product.description} `;
                    }
                });
            });
        }


        // 4. FETCH FILTERED PRODUCTS

        const products = await Product.find(filterQuery).populate("seller", "name phone location rating totalRatings").lean();


        // 5. SCORE PRODUCTS (RECOMMENDATION)


        const categoryDistanceFactors = {
            Dairy: 15,
            Vegetables: 25,
            Fruits: 200,
            Food: 20,
            Grains: 160,
            Clothing: 220,
            Electronics: 350,
            Furniture: 100,
            Other: 90
        };

        const scoredProducts = products.map(product => {
            let distance = Infinity;
            let distanceScore = 0;

            if (buyerLat && buyerLon && product.seller?.location?.coordinates) {
                const sellerLon = product.seller.location.coordinates[0];
                const sellerLat = product.seller.location.coordinates[1];

                distance = haversineDistance(
                    buyerLat,
                    buyerLon,
                    sellerLat,
                    sellerLon
                );

                const decayFactor = categoryDistanceFactors[product.category] || 100;

                distanceScore = Math.max(Math.exp(-distance / decayFactor), 0.07); // 0.07 is the minimum score for very far products);
            }

            const searchScore = searchText ? cosineSimilarity(searchText, `${product.name} ${product.category} ${product.description}`) : 0;

            const purchaseScore = purchaseText ? cosineSimilarity(purchaseText, `${product.name} ${product.category} ${product.description}`) : 0;

            const popularityScore = (product.rating * product.totalRatings) / 100 || 0;

            const finalScore =
                0.3 * searchScore +
                0.25 * purchaseScore +
                0.35 * distanceScore +
                0.1 * popularityScore;

            return {
                ...product,
                distance,
                score: finalScore
            };
        });


        // 6.                   SORTING

        let sortedProducts;

        if (sortBy === "price-low") {
            sortedProducts = scoredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price-high") {
            sortedProducts = scoredProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === "newest") {
            sortedProducts = scoredProducts.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        } else {
            //                    DEFAULT: RECOMMENDED
            sortedProducts = scoredProducts.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                if (a.distance !== b.distance) return a.distance - b.distance;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        }

        return res.status(200).json({
            success: true,
            count: sortedProducts.length,
            products: sortedProducts
        });

    } catch (error) {
        console.error("Product Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


