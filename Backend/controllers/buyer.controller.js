import Order from '../models/Order.js';
import { Seller } from '../models/Seller.js'
import { Buyer } from '../models/Buyer.js'
import { TransportProvider } from '../models/TransportProvider.js'
import { Product } from "../models/Product.js";
import { TransportRequestInfo } from "../models/TransportRequestInfo.js"

import MAX_DISTANCE from '../config/distance.config.js'
import Notification from "../models/Notification.js";
import cloudinary from '../utils/cloudinary.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";


export const registerBuyer = async (req, res) => {
    try {
        const { name, email, password, phone, latitude, longitude, city } = req.body;
        if (!name || !email || !password || !phone || !latitude || !longitude || !city) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(400).json({ message: "Buyer with this email already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newBuyer = new Buyer({
            name,
            email,
            password: hashedPassword,
            phone,
            location: {
                type: "Point",
                coordinates: [longitude, latitude], // IMPORTANT ORDER
                city
            }
        });

        await newBuyer.save();
        return res.status(201).json({ message: "Buyer registered successfully", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const loginBuyer = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        const buyer = await Buyer.findOne({ email }).select('+password');
        if (!buyer) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, buyer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }

        if (buyer.isBlocked) {
            return res.status(403).json({
                message: "Account is blocked",
                success: false
            });
        }
        // Generate JWT Token
        const token = jwt.sign(
            { buyerId: buyer._id, role: 'buyer' },          //  id is obtained from buyer._id it is object id of mongodb . it will be used to identify the buyer in future requests
            process.env.JWT_SECRET,                         // secret key from environment variables USED to sign the token
            { expiresIn: '7d' }
        );

        const buyerData = {
            id: buyer._id,
            name: buyer.name,
            email: buyer.email,
            phone: buyer.phone,
            role: "buyer",
            profileImage: buyer.profileImage?.url,
            location:buyer.location
        }


        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json({
            message: "Login successful",
            success: true,
            buyer: buyerData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const logoutBuyer = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,  // Expire the cookie immediately
            httpOnly: true,  // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production',  // Only set secure cookies in production (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
        }).json({
            message: "Logged out successfully!",
            success: true  // Corrected typo from 'sucess' to 'success'
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const getBuyerProfile = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const buyer = await Buyer.findById(buyerId).select('-password');
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found", success: false });
        }
        return res.status(200).json({ data: buyer, success: true });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const updateBuyerProfile = async (req, res) => {
    try {
        const { name, phone, email, latitude, longitude, city } = req.body;
        const buyerId = req.user.buyerId;

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({
                message: "Buyer not found",
                success: false,
            });
        }

        if (email && email !== buyer.email) {
            const emailExists = await Buyer.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email already in use",
                    success: false,
                });
            }
            buyer.email = email;
        }


        if (name) buyer.name = name;
        if (city) buyer.location.city = city;
        if (phone) buyer.phone = phone;

        if (!buyer.location) {
            buyer.location = { type: "Point", coordinates: [0, 0] };
        }

        if (longitude !== undefined)
            buyer.location.coordinates[0] = Number(longitude);

        if (latitude !== undefined)
            buyer.location.coordinates[1] = Number(latitude);

        if (req.file) {
            if (buyer.profileImage?.public_id) {
                await cloudinary.uploader.destroy(
                    buyer.profileImage.public_id
                );
            }

            buyer.profileImage = {
                url: req.file.path,        // Cloudinary secure_url
                public_id: req.file.filename, // Cloudinary public_id
            };
        }


        const notification = await Notification.create({
            user: buyerId,
            role: "buyer",
            type: "profile_update",
            title: "Profile Updated",
            message: "Your profile has been updated successfully.",
        });

        buyer.notifications.push(notification._id);
        await buyer.save();

        return res.status(200).json({
            message: "Buyer Profile Updated Successfully!",
            success: true,
            updatedBuyer: {
                _id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                city: buyer.location.city,
                phone: buyer.phone,
                profileImage: buyer.profileImage?.url,
            },
        });
    } catch (error) {
        console.error("UpdateBuyerProfile Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const changeBuyerPassword = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const buyer = await Buyer.findById(buyerId).select("+password");
        if (!buyer) {
            return res.status(404).json({
                message: "Buyer not found",
                success: false
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, buyer.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, buyer.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        buyer.password = hashedNewPassword;


        // Create notification
        const notification = await Notification.create({
            user: buyerId,
            role: "buyer",
            type: "password_change",
            title: "Password Changed",
            message: "Your password has been updated successfully.",
        });

        buyer.notifications.push(notification._id);
        await buyer.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const getProductsFromVerifiedSellers = async (req, res) => {
    try {
        const products = await Product.find({isVerified : true})
            .populate({
                path: "seller",
                match: { isVerified: true },   
                select: "name email phone location"
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

export const createOrderByBuyer = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
         const { transporter,  products,   totalAmount,   deliveryCost, totalCost,    deliveryLocation } = req.body;
    
        if ( !transporter || !products || products.length === 0 || !totalAmount || !deliveryCost || !totalCost || !deliveryLocation?.pickupLocation || !deliveryLocation?.destinationLocation ) {
            return res.status(400).json({
                message: "Missing required fields",
                success: false
            });
        }

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({
                message: "Buyer not found",
                success: false
            });
        }

        const transporterData = await TransportProvider.findOne({
            _id: transporter,
            isVerified: true,
            isActive: true
        });

        if (!transporterData) {
            return res.status(404).json({
                message: "Transporter not found or inactive",
                success: false
            });
        }

        const verifiedProducts = [];
        const sellerSet = new Set();

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: "Product not found",
                    success: false
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} is out of stock`,
                    success: false
                });
            }

            product.stock -= item.quantity;
            await product.save();
            sellerSet.add(product.seller.toString());
            verifiedProducts.push({
                product: product._id,
                seller: product.seller,
                quantity: item.quantity,
            });
        }

        const newOrder = await Order.create({
            buyer: buyerId,
            transporter,
            products: verifiedProducts,
            totalAmount,
            deliveryCost,
            totalCost,
            deliveryLocation
        });

        const sellers = await Seller.find({
            _id: { $in: Array.from(sellerSet) },
            isVerified: true
        });

        const notifications = [];
        notifications.push({
            user: buyerId,
            role: "buyer",
            type: "order",
            title: "Order Placed",
            message: "You have successfully placed an order.",
            relatedId: newOrder._id,
        });

        sellers.forEach((seller) => {
            notifications.push({
                user: seller._id,
                role: "seller",
                type: "order",
                title: "New Order Received",
                message: "You have received a new order.",
                relatedId: newOrder._id,
            });
        });

        notifications.push({
            user: transporterData._id,
            role: "transporter",
            type: "delivery",
            title: "Delivery Assigned",
            message: "A new delivery has been assigned to you.",
            relatedId: newOrder._id,
        });

        const createdNotifications = await Notification.insertMany(notifications);
        buyer.notifications.push(createdNotifications[0]._id);
        await buyer.save();

        for (let i = 0; i < sellers.length; i++) {
            sellers[i].notifications.push(createdNotifications[i + 1]._id);
            await sellers[i].save();
        }

        transporterData.notifications.push(
            createdNotifications[createdNotifications.length - 1]._id
        );
        await transporterData.save();

        return res.status(201).json({
            message: "Order created successfully",
            success: true,
            orderId: newOrder._id,
        });

    } catch (error) {
        console.error("CreateOrder Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const getMyOrdersByBuyer = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;           
        const allOrders = await Order.find({ buyer: buyerId })         
            .populate("products.product", "name price");


        if (!allOrders || allOrders.length === 0) {
            return res.status(404).json({
                message: "You have not ordered any products yet",
                success: false
            });
        }

        const orderedProducts = [];
        allOrders.forEach(order => {
            order.products.forEach(item => {
                orderedProducts.push({
                    orderId: order._id,
                    productId: item.product._id,
                    productName: item.product.name,
                    productPrice: item.product.price,
                    quantity: item.quantity,
                    totalPrice: item.product.price * item.quantity,
                    seller: order.seller,
                    orderStatus: order.status,
                    isSellerRated: order.isSellerRated,
                    isTransportRated: order.isTransporterRated
                })
            })
        })

        return res.status(200).json({
            success: true,
            orderedProducts
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params; 
        const order = await Order.findById(id).populate("products.product", "name price");
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        if (order.buyer.toString() !== req.user.buyerId.toString()) {
            return res.status(403).json({
                message: "Unauthorized access to this order",
                success: false
            });
        }

        const formattedOrder = {
            orderId: order._id,
            productName: order.products[0]?.product?.name, 
            productPrice: order.products[0]?.product?.price,
            quantity: order.products[0]?.quantity,
            totalPrice: order.products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0),
            orderStatus: order.status,
            seller: order.seller,
            isSellerRated: order.isSellerRated,
            isTransportRated: order.isTransporterRated,
            createdAt: order.createdAt,
            shippingDetails: order.deliveryLocation
        };

        return res.status(200).json({
            success: true,
            order: formattedOrder
        });

    } catch (error) {
        console.error("Error fetching single order:", error);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            success: false 
        });
    }
};

export const rateTransporterByBuyer = async (req, res) => {
    try {
        const { rating, transporterId, orderId } = req.body;
        const buyerId = req.user.buyerId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
        }

        const order = await Order.findOne({
            _id: orderId,
            buyer: buyerId,
            transporter: transporterId
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

        if (order.isTransporterRated) {
            return res.status(400).json({
                message: "Transporter already rated for this order",
                success: false
            });
        }

        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter) {
            return res.status(404).json({ message: "Transporter not found", success: false });
        }

        const newTotalRatings = transporter.totalRatings + 1;
        const newRating = ((transporter.rating * transporter.totalRatings) + rating) / newTotalRatings;

        transporter.rating = Number(newRating.toFixed(1));
        transporter.totalRatings = newTotalRatings;

        order.isTransporterRated = true;

        await transporter.save();
        await order.save();

        return res.status(200).json({
            message: "Transporter rated successfully",
            success: true,
            rating: transporter.rating
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const rateSellerByBuyer = async (req, res) => {
    try {
        const { rating, sellerId, orderId } = req.body;
        const buyerId = req.user.buyerId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
        }
  
        const order = await Order.findOne({
            _id: orderId,
            buyer: buyerId,
            seller: sellerId
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        if (order.status !== "DELIVERED") {
            return res.status(400).json({
                message: "You can rate seller only after delivery",
                success: false
            });
        }


        if (order.isSellerRated) {
            return res.status(400).json({
                message: "Seller already rated for this order",
                success: false
            });
        }

        if (order.seller.toString() !== sellerId) {
            return res.status(403).json({
                message: "You are not allowed to rate this seller",
                success: false
            });
        }

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found", success: false });
        }

        const newTotalRatings = seller.totalRatings + 1;
        const newRating = ((seller.rating * seller.totalRatings) + rating) / newTotalRatings;

        seller.rating = Number(newRating.toFixed(1));
        seller.totalRatings = newTotalRatings;

        order.isSellerRated = true;

        await seller.save();
        await order.save();

        return res.status(200).json({
            message: "Seller rated successfully",
            success: true,
            rating: seller.rating
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const rateProductByBuyer = async (req, res) => {
    try {
        const { rating, productId, orderId } = req.body;
        const buyerId = req.user.buyerId;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.buyer.toString() !== buyerId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to rate this order",
            });
        }

        if (order.status !== "delivered") {
            return res.status(400).json({
                success: false,
                message: "You can rate product only after delivery",
            });
        }

        if (order.isProductRated) {
            return res.status(400).json({
                success: false,
                message: "Product already rated for this order",
            });
        }

        const productInOrder = order.products.find(
            (item) => item.product.toString() === productId
        );

        if (!productInOrder) {
            return res.status(400).json({
                success: false,
                message: "This product is not part of the order",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const newTotalRatings = product.totalRatings + 1;
        const newRating =
            (product.rating * product.totalRatings + rating) / newTotalRatings;

        product.rating = newRating;
        product.totalRatings = newTotalRatings;

        await product.save();

        // 9️⃣ Mark order as product rated
        order.isProductRated = true;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Product rated successfully",
            rating: product.rating,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}

export const recommendedProducts = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const { category } = req.query;

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }

        const maxDistance = MAX_DISTANCE[category] || 20000;

        const nearbySellers = await Seller.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: buyer.location.coordinates
                    },
                    $maxDistance: maxDistance
                }
            },
            isActive: true
        })

        const sellerIds = nearbySellers.map(s => s._id);
        const products = await Product.find({
            seller: { $in: sellerIds },
            category,
            isActive: true
        }).sort({ rating: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getBuyerNotifications = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const buyer = await Buyer.findById(buyerId).populate({
            path: "notifications",
            model: "Notification",
            options: { sort: { createdAt: -1 } }
        });
 
        if (!buyer) {
            return res.status(404).json({
                message: "Buyer not found ",
                success: false
            })
        }

        const notifications = buyer.notifications || [];

        return res.status(200).json({
            message: "Notifications fetched successfully",
            success: true,
            notifications
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const getTransporterById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Transporter ID",
            });
        }

        const transporter = await TransportProvider.findById(id);
        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "transporter not found",
            });
        }

        return res.status(200).json({
            success: true,
            transporter,
        });
    } catch (error) {
        console.error("Get product by ID error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getMyAllRequests = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const allmyrequest = await TransportRequestInfo.find({ customer: buyerId }).populate("transporter")

        if (!allmyrequest || allmyrequest.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No requests found",
            });
        }
        return res.status(200).json({
            success: true,
            allmyrequest
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
}

export const getMyTransportRequestData = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const requestId = req.params.id;

        const buyerData = await Buyer.findById(buyerId);
        if (!buyerData) {
            return res.status(404).json({
                message: "Buyer not found in database",
                success: false
            });
        }

        const transportRequest = await TransportRequestInfo
            .findOne({
                _id: requestId,
                customer: buyerId
            })
            .populate("transporter", "name email phone").populate("transporter");

        if (!transportRequest) {
            return res.status(404).json({
                message: "Transport request not found or unauthorized access",
                success: false
            });
        }

        return res.status(200).json({
            message: "Transport request fetched successfully",
            success: true,
            request: transportRequest
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};
