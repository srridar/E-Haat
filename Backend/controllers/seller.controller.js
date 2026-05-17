import { Seller } from '../models/Seller.js';
import {Notification }from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import cloudinary from '../utils/cloudinary.js'
import { Product } from '../models/Product.js';
import mongoose from 'mongoose';
import { SellerOrder } from "../models/SellerOrder.js";
import { assignTransporterUsingAI } from "../services/transporterAssignment.service.js";

// done 



export const registerSeller = async (req, res) => {
    try {
        const { name, email, password, phone, latitude, longitude, city } = req.body;
        if (!name || !email || !password || !phone || !latitude || !longitude || !city) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: "Seller with this email already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newSeller = new Seller({
            name,
            email,
            password: hashedPassword,
            phone,
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
                city
            }
        });

        await newSeller.save();
        return res.status(201).json({ message: "Seller registered successfully", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        const seller = await Seller.findOne({ email }).select('+password');
        if (!seller) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, seller.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }



        if (seller.isBlocked) {
            return res.status(403).json({
                message: "Account is blocked",
                success: false
            });
        }

        console.log("ddddfdkljsad");
        const token = jwt.sign(
            { sellerId: seller._id, role: 'seller' },        //  id is obtained from buyer._id it is object id of mongodb . it will be used to identify the buyer in future requests
            process.env.JWT_SECRET,                         // secret key from environment variables USED to sign the token
            { expiresIn: '7d' }
        );

        const sellerData = {
            id: seller._id,
            name: seller.name,
            email: seller.email,
            city: seller.location.city,
            phone: seller.phone,
            role: "seller",
            profileImage: seller.profileImage?.url,
        }


        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json({
            message: "Login successful",
            success: true,
            seller: sellerData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const logoutSeller = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax',
            path: "/"   // IMPORTANT: must match
        });

        return res.status(200).json({
            message: "Logged out successfully!",
            success: true
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const getSellerProfile = async (req, res) => {
    try {

        const sellerId = req.user.sellerId;
        const seller = await Seller.findById(sellerId).select("-password");

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Seller profile fetched successfully",
            success: true,
            data: seller
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const updateSellerProfile = async (req, res) => {
    try {
        const { name, email, phone, latitude, longitude, city } = req.body;
        const sellerId = req.user.sellerId;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false,
            });
        }

        if (email && email !== seller.email) {
            const emailExists = await Seller.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email already in use",
                    success: false,
                });
            }
            seller.email = email;
        }

        if (name) seller.name = name;
        if (city) seller.location.city = city;
        if (phone) seller.phone = phone;

        if (!seller.location) {
            seller.location = { type: "Point", coordinates: [0, 0] };
        }

        if (longitude !== undefined)
            seller.location.coordinates[0] = Number(longitude);

        if (latitude !== undefined)
            seller.location.coordinates[1] = Number(latitude);


        if (req.file) {
            if (seller.profileImage?.public_id) {
                await cloudinary.uploader.destroy(
                    seller.profileImage.public_id
                );
            }

            seller.profileImage = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        // Create notification
        const notification = await Notification.create({
            user: sellerId,
            role: "seller",
            type: "profile_update",
            title: "Profile Updated",
            message: "Your profile has been updated successfully.",
        });

        seller.notifications.push(notification._id);
        await seller.save();

        return res.status(200).json({
            message: "Seller Profile Updated Successfully!",
            updatedSeller: {
                _id: seller._id,
                name: seller.name,
                city: seller.city,
                phone: seller.phone,
                profileImage: seller.profileImage?.url,
            },
            success: true,
        });
    } catch (error) {
        console.error("UpdateSellerProfile Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const changeSellerPassword = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const seller = await Seller.findById(sellerId).select("+password");
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, seller.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, seller.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        seller.password = hashedNewPassword;
        await seller.save();

        const notification = await Notification.create({
            user: sellerId,
            role: "seller",
            type: "password_change",
            title: "Password Changed",
            message: "Your password has been updated successfully.",
        });


        seller.notifications.push(notification._id);
        await seller.save();


        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid seller ID",
            });
        }
        const seller = await Seller.findById(sellerId).select("isBlocked");
        if (!seller) {
            return res.status(404).json({
                message: "seller does not exist 1",
                success: false
            })
        }

        if (seller.isBlocked) {
            return res.status(403).json({
                message: "Seller account is blocked",
                success: false
            });
        }

        const sellerProducts = await Product.find({ seller: sellerId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: " SellerProducts are fetched successfully !",
            success: true,
            totalProducts: sellerProducts.length,
            sellerProducts
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const getSellerVerifiedProducts = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;

        if (!mongoose.Types.ObjectId.isValid(sellerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid seller ID",
            });
        }
        const seller = await Seller.findById(sellerId).select("isBlocked");
        if (!seller) {
            return res.status(404).json({
                message: "seller does not exist 1",
                success: false
            })
        }

        if (seller.isBlocked) {
            return res.status(403).json({
                message: "Seller account is blocked",
                success: false
            });
        }

        const sellerVerifiedProducts = await Product.find({ seller: sellerId, isVerified: true }).sort({ createdAt: -1 });
        return res.status(200).json({
            message: " SellerVerifiedProducts are fetched successfully !",
            success: true,
            totalProducts: sellerVerifiedProducts.length,
            sellerVerifiedProducts
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const deleteSellerAccount = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(400).json({
                message: " the seller is not found !",
                success: false
            })
        }

        seller.isBlocked = true;
        await seller.save();

        await Product.updateMany(
            { seller: sellerId },
            { $set: { isActive: false } }
        );

        res.clearCookie("token");

        return res.status(200).json({
            message: "Seller account deleted successfully",
            success: true
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const getAllUnVerifiedSellerProfile = async (req, res) => {
    try {
        const unverifiedSellers = await Seller.find({ isVerified: false }).select("-password -isBlocked -createdAt -updatedAt -notifications -verificationStatus");

        if (!unverifiedSellers || unverifiedSellers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No verified sellers found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Verified seller profile fetched successfully",
            unverifiedSellers,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const getSellerNotifications = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const seller = await Seller.findById(sellerId).populate({
            path: "notifications",
            model: "Notification",
            options: { sort: { createdAt: -1 } }
        });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false,
            });
        }

        const notifications = seller.notifications || [];

        return res.status(200).json({
            message: "Notifications fetched successfully",
            success: true,
            notifications
        });

    } catch (error) {
        console.error("GetSellerNotifications Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const setLocation = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const { location } = req.body;

        if (!location || !location.coordinates) {
            return res.status(400).json({
                message: "Location data required",
                success: false
            });
        }

        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        seller.location = {
            type: "Point",
            coordinates: location.coordinates,
            city: location.city
        };

        await seller.save();

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

export const editProduct = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const { productId } = req.params;

        console.log(" edit is hitted");
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID",
                success: false,
            });
        }

        const {
            name,
            description,
            price,
            category,
            stock,
            unit,
            brand,
            isActive
        } = req.body;

        const product = await Product.findOne({
            _id: productId,
            seller: sellerId,
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }

        // ✅ Update fields safely
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category;
        if (stock !== undefined) product.stock = stock;
        if (unit !== undefined) product.unit = unit;
        if (brand !== undefined) product.brand = brand;
        if (isActive !== undefined) product.isActive = isActive;

        // Optional: update images (if you send new ones)
        if (req.body.images) {
            product.images = req.body.images;
        }

        await product.save();

        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product,
        });

    } catch (error) {
        console.error(error);

        // Handle validation errors properly
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
                success: false,
            });
        }

        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};


export const sellerKYC = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;

        const {
            citizenshipCard,
            NationalIDCard,
            businessRegistration,
            PANcard
        } = req.files || {};

        const {
            accountHolderName,
            bankName,
            accountNumber,
            branchName,
            isRegisteredBusiness,

            //     NEW Khalti fields
            khaltiPhone,
            khaltiTransactionId
        } = req.body;

        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        if (seller.isKycDataSubmitted) {
            return res.status(400).json({
                success: false,
                message: "KYC already submitted"
            });
        }

        //      Validation
        if (!citizenshipCard || !NationalIDCard || !accountHolderName || !bankName || !accountNumber || !branchName) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        //  KYC Documents
        seller.documents = {
            citizenshipCard: {
                url: citizenshipCard?.[0]?.path,
                public_id: citizenshipCard?.[0]?.filename
            },
            NationalIDCard: {
                url: NationalIDCard?.[0]?.path,
                public_id: NationalIDCard?.[0]?.filename
            },
            businessRegistration: {
                url: businessRegistration?.[0]?.path || "",
                public_id: businessRegistration?.[0]?.filename || ""
            },
            PANcard: {
                url: PANcard?.[0]?.path || "",
                public_id: PANcard?.[0]?.filename || ""
            }
        };

        //  Bank details
        seller.bankDetails = {
            accountHolderName,
            bankName,
            accountNumber,
            branchName
        };

        //  Khalti payment details (IMPORTANT FIX)
        seller.paymentMethod = "khalti";

        seller.paymentDetails = {
            khalti: {
                phone: khaltiPhone,
                transactionId: khaltiTransactionId,
                pidx: ""
            }
        };

        seller.isRegisteredBusiness = isRegisteredBusiness === "true";
        seller.verificationStatus = "pending";
        seller.isKycDataSubmitted = true;
        seller.isVerified = false;

        await seller.save();

        return res.status(200).json({
            success: true,
            message: "KYC submitted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



export const sellerStatus = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const seller = await Seller.findById(sellerId).select("verificationStatus isVerified isKycCompleted isKycDataSubmitted");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        return res.status(200).json({
            success: true,
            sss: {
                verificationStatus: seller.verificationStatus,
                isVerified: seller.isVerified,
                isKycCompleted: seller.isKycCompleted,
                isKycDataSubmitted: seller.isKycDataSubmitted
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}


export const getSellerOrders = async (req, res) => {

    try {

        const sellerId = req.user.sellerId;

        const {
            status,        //  optional status filter (pending, accepted, rejected, delivered) from query parameters
            page = 1,      // default to page 1 if not provided
            limit = 10
        } = req.query;

        const query = {
            seller: sellerId
        };

        if (status) {
            query.status = status;
        }

        const orders = await SellerOrder.find(query).populate("buyer", "name email").populate("products.product").sort({ createdAt: -1 })
            .skip((page - 1) * limit).limit(Number(limit));

        const total = await SellerOrder.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            orders
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const getSellerOrderDetails = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const { sellerOrderId } = req.params;

        const sellerOrder = await SellerOrder.findById(sellerOrderId)
            .populate("buyer", "name email phone")
            .populate("seller", "name email phone")
            .populate("transporter", "name phone rating")
            .populate("products.product", "name price images");


        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

       if (sellerOrder.seller._id.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this order"
            });
        }

        return res.status(200).json({
            success: true,
            sellerOrder: {
                _id: sellerOrder._id,
                mainOrder: sellerOrder.mainOrder,
                buyer: sellerOrder.buyer,
                seller: sellerOrder.seller,
                transporter: sellerOrder.transporter,

                products: sellerOrder.products,

                pickupLocation: sellerOrder.pickupLocation,
                deliveryLocation: sellerOrder.deliveryLocation,

                deliveryCost: sellerOrder.deliveryCost,
                totalAmount: sellerOrder.totalAmount,

                status: sellerOrder.status,

                sellerPacked: sellerOrder.sellerPacked,
                transporterPicked: sellerOrder.transporterPicked,
                delivered: sellerOrder.delivered,

                verificationCode: sellerOrder.verificationCode,

                sellerProofImages: sellerOrder.sellerProofImages,
                pickupProofImages: sellerOrder.pickupProofImages,
                deliveryProofImages: sellerOrder.deliveryProofImages,

                complaintRaised: sellerOrder.complaintRaised,
                paymentReleasedToSeller: sellerOrder.paymentReleasedToSeller,

                pickupOTP: sellerOrder.pickupOTP,
                deliveryOTP: sellerOrder.deliveryOTP,

                pickupVerified: sellerOrder.pickupVerified,
                deliveryVerified: sellerOrder.deliveryVerified,

                assignedByAdmin: sellerOrder.assignedByAdmin,

                transporterAssignedAt: sellerOrder.transporterAssignedAt,
                pickedUpAt: sellerOrder.pickedUpAt,
                inTransitAt: sellerOrder.inTransitAt,
                outForDeliveryAt: sellerOrder.outForDeliveryAt,
                deliveredAt: sellerOrder.deliveredAt,

                transporterNotes: sellerOrder.transporterNotes,

                createdAt: sellerOrder.createdAt,
                updatedAt: sellerOrder.updatedAt
            }
        });

    } catch (error) {
        console.log("getSellerOrderDetails error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const acceptSellerOrder = async (req, res) => {  // this controller is used to accept the order by the seller. only pending orders can be accepted. 

    try {

        const sellerId = req.user.sellerId;
        const { sellerOrderId } = req.params;

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        // Ownership check
        if (sellerOrder.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Status validation
        if (sellerOrder.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending orders can be accepted"
            });
        }

        sellerOrder.status = "accepted";

      
        await sellerOrder.save();

        return res.status(200).json({
            success: true,
            message:
                "Order accepted successfully",
            sellerOrder
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};


export const rejectSellerOrder = async (req, res) => {

    try {
        const sellerId = req.user.sellerId;
        const { sellerOrderId } = req.params;
        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message:"Seller order not found"
            });
        }

        if (
            sellerOrder.seller.toString()
            !== sellerId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (
            sellerOrder.status !== "pending"
        ) {
            return res.status(400).json({
                success: false,
                message:"Only pending orders can be rejected"
            });
        }

        sellerOrder.status = "rejected";


        // TODO:          
        // release reserved stock       this means we need to implement stock reservation when the order is placed. when the order is rejected we need to release the reserved stock back to the available stock.
        // notify buyer
        // refund partial payment

        await sellerOrder.save();

        return res.status(200).json({
            success: true,
            message: "Order rejected successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const markPreparing = async (req, res) => {

    try {

        const sellerId = req.user.sellerId;
        const { sellerOrderId } = req.params;

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message:"Seller order not found"
            });
        }

        if (sellerOrder.status !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Order must be accepted first"
            });
        }

        sellerOrder.status = "preparing";

        sellerOrder.packingStartedAt = new Date();

    

        await sellerOrder.save();

        return res.status(200).json({
            success: true,
            message: "Order marked as preparing"
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};


export const markReadyForPickup = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const { sellerOrderId } = req.params;

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        if (sellerOrder.status !== "preparing") {
            return res.status(400).json({
                success: false,
                message: "Order must be in preparing status"
            });
        }


        if (sellerOrder.sellerProofImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Upload packing proof first"
            });
        }

        sellerOrder.status = "ready_for_pickup";
        sellerOrder.readyForPickupAt = new Date();
        sellerOrder.sellerPacked = true;

        await sellerOrder.save();
        await assignTransporterUsingAI({ sellerOrderId: sellerOrder._id });

         return res.status(200).json({
            success: true,
            message: "Order marked as ready for pickup and transporter dispatch started"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}  



export const uploadPackingProof = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const { sellerOrderId } = req.params;

        const files = req.files || [];

        if (files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload packing proof images"
            });
        }

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        // Ownership validation
        if (sellerOrder.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        // Prevent upload after shipment
        const blockedStatuses = [
            "picked_up",
            "in_transit",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ];

        if (blockedStatuses.includes(sellerOrder.status)) {
            return res.status(400).json({
                success: false,
                message: "Cannot upload proof now"
            });
        }

        // Convert uploaded files
        const proofImages =
            files.map(file => ({
                url: file.path,
                public_id:
                    file.filename ||
                    file.public_id
            }));

        // Push new proofs
        sellerOrder.sellerProofImages.push(
            ...proofImages
        );

        // Auto update status
        if (sellerOrder.status === "preparing") {
            sellerOrder.status = "ready_for_pickup";
        }

        sellerOrder.packingCompletedAt = new Date();

        await sellerOrder.save();
        return res.status(200).json({
            success: true,
            message: "Packing proof uploaded successfully",
            sellerProofImages: sellerOrder.sellerProofImages
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Internal Server Error"
        });
    }
};





 