import Order from '../models/Order.js';
import { Seller } from '../models/Seller.js'
import { Buyer } from '../models/Buyer.js'
import { TransportProvider } from '../models/TransportProvider.js'
import { Product } from "../models/Product.js";
import { TransportRequestInfo } from "../models/TransportRequestInfo.js"
import Notification from "../models/Notification.js";
import cloudinary from '../utils/cloudinary.js'
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
    },
});

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


export const forgotPassword = async (req, res) => {
    try {
        const { email, role } = req.body;

        let Model;

        if (role === "buyer") {
            Model = Buyer;
        } else if (role === "seller") {
            Model = Seller;
        } else if (role === "transporter") {
            Model = TransportProvider;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });

        }

        const user = await Model.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.resetOtp = hashedOtp;
        user.otpExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // 📧 Send email
        await transporter.sendMail({
            to: user.email,
            subject: "E-Haat Password Reset OTP",
            html: `
  <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:40px 0;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background:linear-gradient(135deg, #10b981, #059669); padding:20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0;">E-Haat Marketplace</h1>
        <p style="color:#d1fae5; margin-top:5px;">Secure Password Reset</p>
      </div>

      <!-- Body -->
      <div style="padding:30px; text-align:center;">
        <h2 style="color:#111827; margin-bottom:10px;">Password Reset Request</h2>
        <p style="color:#6b7280; font-size:14px;">
          We received a request to reset your password. Use the OTP below to proceed.
        </p>

        <!-- OTP Box -->
        <div style="margin:30px 0;">
          <span style="
            display:inline-block;
            padding:15px 30px;
            font-size:28px;
            letter-spacing:6px;
            font-weight:bold;
            color:#059669;
            background:#ecfdf5;
            border:2px dashed #10b981;
            border-radius:10px;
          ">
            ${otp}
          </span>
        </div>

        <p style="color:#6b7280; font-size:14px;">
          This OTP is valid for <b>10 minutes</b>. Do not share it with anyone.
        </p>

        <p style="color:#9ca3af; font-size:12px; margin-top:20px;">
          If you did not request this, please ignore this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#9ca3af;">
        © ${new Date().getFullYear()} E-Haat Marketplace. All rights reserved.
      </div>

    </div>
  </div>
`
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp, role } = req.body;

        let Model;

        if (role === "buyer") {
            Model = Buyer;
        } else if (role === "seller") {
            Model = Seller;
        } else if (role === "transporter") {
            Model = TransportProvider;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });

        }

        const user = await Model.findOne({ email });

        if (!user || !user.resetOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid request",
            });
        }

        const isMatch = await bcrypt.compare(otp, user.resetOtp);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        if (user.otpExpire < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            });
        }

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let Model;
        if (role === "buyer") {
            Model = Buyer;
        } else if (role === "seller") {
            Model = Seller;
        } else if (role === "transporter") {
            Model = TransportProvider;
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });
        }

        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.otpExpire = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

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
            location: buyer.location
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
        const products = await Product.find({ isVerified: true })
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const buyerId = req.user.buyerId;
        const { transporter, products, totalAmount, deliveryCost, totalCost, deliveryLocation } = req.body;

        console.log("hited run :" + req.body);

        if (!transporter || !products || products.length === 0 || !totalAmount || !deliveryCost || !totalCost
            || !deliveryLocation?.pickupLocation || !deliveryLocation?.destinationLocation) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Missing required fields",
                success: false
            });
        }


        const buyer = await Buyer.findById(buyerId).session(session);
        console.log("buyer data : " + buyer);
        if (!buyer) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Buyer not found",
                success: false
            });
        }

        const transporterData = await TransportProvider.findOne({
            _id: transporter,
            isVerified: true,
            isActive: true
        }).session(session);

        console.log(" transporterData " + transporterData);



        if (!transporterData) {
            await session.abortTransaction();
            return res.status(404).json({
                message: "Transporter not found or inactive",
                success: false
            });
        }

        const verifiedProducts = [];
        const sellerSet = new Set();

        // ✅ First validate products (NO stock update yet)
        for (const item of products) {
            const product = await Product.findById(item.product).session(session);

            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({
                    message: "Product not found",
                    success: false
                });
            }

            if (product.stock < item.quantity) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: `${product.name} is out of stock`,
                    success: false
                });
            }

            sellerSet.add(product.seller.toString());

            verifiedProducts.push({
                product: product._id,
                seller: product.seller,
                quantity: item.quantity,
            });
        }

        // ✅ Create Order FIRST
        const newOrder = await Order.create([{
            buyer: buyerId,
            transporter,
            products: verifiedProducts,
            totalAmount,
            deliveryCost,
            totalCost,
            deliveryLocation
        }], { session });


        console.log(" newOrder " + newOrder);

        // ✅ NOW reduce stock (only if order created)
        for (const item of products) {
            const product = await Product.findById(item.product).session(session);
            product.stock -= item.quantity;
            await product.save({ session });
        }

        const sellers = await Seller.find({
            _id: { $in: Array.from(sellerSet) },
            isVerified: true
        }).session(session);

        // ✅ Notifications
        const notifications = [];

        notifications.push({
            user: buyerId,
            role: "buyer",
            type: "order",
            title: "Order Placed",
            message: "You have successfully placed an order.",
            relatedId: newOrder[0]._id,
        });

        sellers.forEach((seller) => {
            notifications.push({
                user: seller._id,
                role: "seller",
                type: "order",
                title: "New Order Received",
                message: "You have received a new order.",
                relatedId: newOrder[0]._id,
            });
        });

        notifications.push({
            user: transporterData._id,
            role: "transporter",
            type: "delivery",
            title: "Delivery Assigned",
            message: "A new delivery has been assigned to you.",
            relatedId: newOrder[0]._id,
        });

        const createdNotifications = await Notification.insertMany(notifications, { session });


        buyer.notifications.push(createdNotifications[0]._id);
        await buyer.save({ session });

        for (let i = 0; i < sellers.length; i++) {
            sellers[i].notifications.push(createdNotifications[i + 1]._id);
            await sellers[i].save({ session });
        }

        transporterData.notifications.push(
            createdNotifications[createdNotifications.length - 1]._id
        );
        await transporterData.save({ session });

        // ✅ COMMIT EVERYTHING
        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Order created successfully",
            success: true,
            orderId: newOrder[0]._id,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

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
            .populate("buyer", "name email")
            .populate("transporter", "name phone vehicle pricePerKm")
            .populate({
                path: "products.product",
                select: "name price image"
            })
            .populate({
                path: "products.seller",
                select: "name shopName"
            })
            .sort({ createdAt: -1 })
            .lean();

        // ✅ FIXED: No 404
        if (!allOrders || allOrders.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                orders: []
            });
        }

        const orders = allOrders.map(order => ({
            orderId: order._id,

            // Buyer
            buyer: {
                id: order.buyer?._id,
                name: order.buyer?.name || "N/A",
                email: order.buyer?.email || "N/A"
            },

            // Transporter
            transporter: {
                id: order.transporter?._id,
                name: order.transporter?.name || "N/A",
                phone: order.transporter?.phone || "N/A",
                vehicle: order.transporter?.vehicle || "N/A",
                pricePerKm: order.transporter?.pricePerKm || 0
            },

            // Order Info
            status: order.status,
            totalAmount: order.totalAmount || 0,
            deliveryCost: order.deliveryCost || 0,
            totalCost: order.totalCost || 0,

            // ✅ IMPORTANT ADD
            isPaymentCompleted: order.isPaymentCompleted,

            // Ratings
            isSellerRated: order.isSellerRated,
            isProductRated: order.isProductRated,
            isTransporterRated: order.isTransporterRated,

            // Location
            pickupLocation: order.deliveryLocation?.pickupLocation,
            destinationLocation: order.deliveryLocation?.destinationLocation,

            // Products
            products: order.products.map(item => ({
                productId: item.product?._id,
                productName: item.product?.name || "Unknown",
                productPrice: item.product?.price || 0,
                productImage: item.product?.image || "",

                quantity: item.quantity,
                totalPrice: (item.product?.price || 0) * item.quantity,

                seller: {
                    id: item.seller?._id,
                    name: item.seller?.name || "Unknown",
                    shopName: item.seller?.shopName || "Unknown"
                }
            })),

            createdAt: order.createdAt
        }));

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("GetMyOrders Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await Order.findById(orderId)
            .populate("buyer", "name email phone")
            .populate("transporter", "name phone vehicle pricePerKm")
            .populate({
                path: "products.product",
                select: "name price image"
            })
            .populate({
                path: "products.seller",
                select: "name shopName"
            })
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // 🔐 Authorization check
        if (order.buyer?._id.toString() !== req.user.buyerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // ✅ FORMAT RESPONSE (IMPORTANT)
        const formattedOrder = {
            orderId: order._id,
            status: order.status,
            totalAmount: order.totalAmount || 0,
            deliveryCost: order.deliveryCost || 0,
            totalCost: order.totalCost || 0,
            isPaymentCompleted: order.isPaymentCompleted,

            transporter: {
                id: order.transporter?._id,
                name: order.transporter?.name,
                phone: order.transporter?.phone,
                vehicle: order.transporter?.vehicle,
                pricePerKm: order.transporter?.pricePerKm
            },

            pickupLocation: order.deliveryLocation?.pickupLocation,
            destinationLocation: order.deliveryLocation?.destinationLocation,

            products: order.products.map(item => ({
                productId: item.product?._id,
                productName: item.product?.name,
                productPrice: item.product?.price,
                productImage: item.product?.image,
                quantity: item.quantity,
                totalPrice: (item.product?.price || 0) * item.quantity,

                seller: {
                    id: item.seller?._id,
                    name: item.seller?.name,
                    shopName: item.seller?.shopName
                }
            })),

            createdAt: order.createdAt
        };

        return res.status(200).json({
            success: true,
            order: formattedOrder
        });

    } catch (error) {
        console.error("Error fetching order:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
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

export const setLocation = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const { location } = req.body;

        if (!location || !location.coordinates) {
            return res.status(400).json({
                message: "Location data required",
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

        buyer.location = {
            type: "Point",
            coordinates: location.coordinates,
            city: location.city
        };

        await buyer.save();

        return res.status(200).json({
            message: "Location set successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


