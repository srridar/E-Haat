import Order from '../models/Order.js';
import { Seller } from '../models/Seller.js'
import { Product } from '../models/Product.js'
import getDataUri from "../utils/getDataUri.js";
import mongoose from 'mongoose';
import { Buyer } from "../models/Buyer.js";
import { TransportProvider } from "../models/TransportProvider.js";
import { TransportRequestInfo } from "../models/TransportRequestInfo.js";



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


        if (order.isTransportRated) {
            return res.status(400).json({
                message: "Transporter already rated for this order",
                success: false
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

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

export const HireTransporter = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;

        const {
            transporter,
            pickupLocation,
            destinationLocation,
            itemDescription,
            weightKg,
            deliveryDate,
            offeredPrice,
            estimatedDistanceKm,
        } = req.body;


        if (
            !transporter ||
            !pickupLocation ||
            !destinationLocation ||
            !itemDescription ||
            !weightKg ||
            !deliveryDate ||
            !offeredPrice
        ) {
            return res.status(400).json({
                message: "All required fields must be provided!",
                success: false,
            });
        }


        if (
            !pickupLocation.province ||
            !pickupLocation.district ||
            !pickupLocation.municipality ||
            !pickupLocation.ward ||
            !pickupLocation.landmark
        ) {
            return res.status(400).json({
                message: "All pickup location fields are required!",
                success: false,
            });
        }


        if (
            !destinationLocation.province ||
            !destinationLocation.district ||
            !destinationLocation.municipality ||
            !destinationLocation.ward ||
            !destinationLocation.landmark
        ) {
            return res.status(400).json({
                message: "All destination location fields are required!",
                success: false,
            });
        }


        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({
                message: "Buyer not found",
                success: false,
            });
        }


        const transporterData = await TransportProvider.findById(transporter);
        if (!transporterData) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false,
            });
        }


        const newHireRequest = await TransportRequestInfo.create({
            customer: buyerId,
            transporter: transporter,
            pickupLocation,
            destinationLocation,
            itemDescription,
            weightKg,
            deliveryDate,
            offeredPrice,
            estimatedDistanceKm: estimatedDistanceKm || 0,
        });

        return res.status(201).json({
            message: "Transporter hired successfully!",
            success: true,
            request: newHireRequest,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
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

    const vector1 = allWords.map(word => words1.includes(word) ? 1 : 0);
    const vector2 = allWords.map(word => words2.includes(word) ? 1 : 0);

    const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);

    const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

    if (magnitude1 === 0 || magnitude2 === 0) return 0;

    return dotProduct / (magnitude1 * magnitude2);
};


export const getAllProductsSorted = async (req, res) => {
  try {

    const {
      latitude,
      longitude,
      search = "",
      categories = ""
    } = req.query;

    const selectedCategories = categories ? categories.split(",") : [];
    const user = req.user;

    const hasSearch = search.trim() !== "";
    const hasCategory = selectedCategories.length > 0;


    if (!user) {

      const products = await Product.find({
        isActive: true,
        isVerified: true
      }).populate("seller");

      return res.status(200).json({
        success: true,
        type: "public_products",
        total: products.length,
        products
      });
    }



    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Buyer location required"
      });
    }

    const buyerLat = parseFloat(latitude);
    const buyerLon = parseFloat(longitude);

    const products = await Product.find({
      isActive: true,
      isVerified: true
    }).populate("seller");



    if (hasSearch || hasCategory) {

      const processedProducts = products
        .filter(product => {
          if (!hasCategory) return true;
            return selectedCategories.includes(product.category);
        })
        .map(product => {

          const sellerLon = product.seller.location.coordinates[0];
          const sellerLat = product.seller.location.coordinates[1];

          const distance = haversineDistance(
            buyerLat,
            buyerLon,
            sellerLat,
            sellerLon
          );

          const similarity = hasSearch
            ? cosineSimilarity(
                search,
                `${product.name} ${product.category} ${product.description}`
              )
            : 0;

          return {
            ...product._doc,
            distance,
            similarity
          };

        });

      processedProducts.sort((a, b) => {

        if (b.similarity !== a.similarity) {
          return b.similarity - a.similarity;
        }

        return a.distance - b.distance;

      });

      return res.status(200).json({
        success: true,
        type: "search_products",
        total: processedProducts.length,
        products: processedProducts
      });
    }

    // ------------------------------------------------
    // CASE 4 : LOGGED IN BUT NO INPUT
    // LOCATION + BEHAVIOR BASED
    // ------------------------------------------------

    const processedProducts = products.map(product => {

      const sellerLon = product.seller.location.coordinates[0];
      const sellerLat = product.seller.location.coordinates[1];

      const distance = haversineDistance(
        buyerLat,
        buyerLon,
        sellerLat,
        sellerLon
      );

   
      const popularityScore = (product.rating * product.totalRatings) / 100;

      const finalScore = (0.6 * (1 / (distance + 1))) + (0.4 * popularityScore);

      return {
        ...product._doc,
        distance,
        score: finalScore
      };

    });

    processedProducts.sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      type: "recommended_products",
      total: processedProducts.length,
      products: processedProducts
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};