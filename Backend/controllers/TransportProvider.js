import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TransportProvider } from "../models/TransportProvider.js";
import { Buyer } from "../models/Buyer.js";
import { Seller } from "../models/Seller.js";
import { Notification } from "../models/Notification.js";
import { Order } from "../models/Order.js"
import cloudinary from "cloudinary";
import { SellerOrder } from '../models/SellerOrder.js'
import { deductStock } from "./inventory.controller.js";
import { TransporterAssignment } from "../models/TransporterAssignment.js";
import { transportRequestNotification } from "../controllers/notification.controller.js";
import mongoose from "mongoose";

const generateOTP = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};


export const registerTransportProvider = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "All required fields must be provided",
                success: false
            });
        }

        const existing = await TransportProvider.findOne({ email });
        if (existing) {
            return res.status(400).json({
                message: "User already exists with this email",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const transporter = await TransportProvider.create({
            name,
            email,
            password: hashedPassword,
            phone
        });


        return res.status(201).json({
            success: true,
            message: "Registration successful. Please complete KYC.",
            transporter: {
                id: transporter._id,
                name: transporter.name,
                email: transporter.email,
                phone: transporter.phone
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const loginTransportProvider = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        const transporter = await TransportProvider.findOne({ email }).select("+password");

        if (!transporter) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        if (!transporter.isActive) {
            return res.status(403).json({
                message: "Account has been deactivated",
                success: false
            });
        }

        if (transporter.isBlocked) {
            return res.status(403).json({
                message: "Account is blocked by admin",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, transporter.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        const token = jwt.sign(
            {
                transporterId: transporter._id,
                role: "transporter"
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            .json({
                success: true,
                message: "Login successful",
                transporter: {
                    id: transporter._id,
                    name: transporter.name,
                    email: transporter.email,
                    phone: transporter.phone,
                    role: "transporter",
                    profileImage: transporter?.profileImage?.url,
                    isVerified: transporter?.isVerified,
                    isKycCompleted: transporter?.isKycCompleted,
                    verificationStatus: transporter?.verificationStatus,
                    isKycDataSubmitted: transporter?.isKycDataSubmitted
                }
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const logoutTransporter = async (req, res) => {
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

export const getTransporterProfile = async (req, res) => {

    try {
        const transporterId = req.user.transporterId; // from JWT middleware
        const transporter = await TransportProvider.findById(transporterId).select("-password");

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Transporter profile fetched successfully",
            success: true,
            transporter
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }

}

export const changeTransporterPassword = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const transporter = await TransportProvider.findById(transporterId).select("+password");
        if (!transporter) {
            return res.status(404).json({
                message: "transporter not found",
                success: false
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, transporter.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, transporter.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        transporter.password = hashedNewPassword;
        await transporter.save();

        await Notification.create({
            user: transporterId,
            role: "transporter",
            type: "password_change",
            title: "Password Changed",
            message: "Your password has been updated successfully.",
        });

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const submitTransporterKyc = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;

        const { citizenshipCard, drivingLicense, vehicleRegistration, vehiclePhoto } = req.files || {};
        let { vehicleType, numberPlate, capacityKg, serviceAreas, pricePerKm } = req.body;

        if (!citizenshipCard || !drivingLicense || !vehiclePhoto || !vehicleRegistration || !vehicleType || !numberPlate || !capacityKg || !pricePerKm) {
            return res.status(400).json({
                success: false,
                message: "All KYC, vehicle, and pricing fields are required"
            });
        }


        if (typeof serviceAreas === 'string') {
            serviceAreas = serviceAreas.split(',').map(area => area.trim()).filter(area => area.length > 0);
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transport provider not found"
            });
        }


        if (transporter.isKycCompleted) {
            return res.status(400).json({
                success: false,
                message: "KYC already submitted"
            });
        }

        transporter.documents = {
            citizenshipCard: citizenshipCard[0].path,
            drivingLicense: drivingLicense[0].path,
            vehicleRegistration: vehicleRegistration[0].path,
        };


        transporter.vehicle = {
            type: vehicleType,
            numberPlate,
            capacityKg,
            vehiclePhoto: vehiclePhoto[0].path
        };


        transporter.serviceAreas = serviceAreas || [];
        transporter.pricePerKm = pricePerKm;


        transporter.isKycCompleted = true;
        transporter.verificationStatus = "pending";
        transporter.isVerified = false;
        transporter.isKycDataSubmitted = true;

        await transporter.save();

        return res.status(200).json({
            success: true,
            message: "KYC submitted successfully. Verification pending."
        });

    } catch (error) {
        console.error("KYC Submission Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateTransportProviderProfile = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;

        const { name, email, phone, pricePerKm } = req.body;
        let { serviceAreas, isAvailable } = req.body;

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transport provider not found"
            });
        }

        // Email uniqueness
        if (email && email !== transporter.email) {
            const emailExists = await TransportProvider.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }
            transporter.email = email;
        }

        if (name) transporter.name = name;
        if (phone) transporter.phone = phone;

        // Service Areas
        if (typeof serviceAreas === "string") {
            transporter.serviceAreas = serviceAreas
                .split(",")
                .map(area => area.trim())
                .filter(Boolean);
        }

        // Price
        if (pricePerKm !== undefined) {
            transporter.pricePerKm = Number(pricePerKm);
        }

        // Availability (string → boolean)
        if (isAvailable !== undefined) {
            transporter.isAvailable = isAvailable === "true";
        }

        // Profile Image
        if (req.file) {
            if (transporter.profileImage?.public_id) {
                await cloudinary.v2.uploader.destroy(
                    transporter.profileImage.public_id
                );
            }

            transporter.profileImage = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        await transporter.save();

        await Notification.create({
            user: transporterId,
            role: "transporter",
            type: "profile_update",
            title: "Profile Updated",
            message: "Your profile has been updated successfully."
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            transporter
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateAvailabilityStatus = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const { isAvailable } = req.body;
        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter) {
            return res.status(404).json({
                message: "Transport provider not found",
                success: false
            });
        }

        transporter.isAvailable = isAvailable;
        await transporter.save();
        return res.status(200).json({
            message: "Availability status updated successfully",
            success: true,
            isAvailable: transporter.isAvailable
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const getTransporterDashboard = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transport provider not found"
            });
        }

        const requestedOrders = await Order.countDocuments({
            transporter: transporterId,
            status: "pending"
        });

        const activeOrders = await Order.countDocuments({
            transporter: transporterId,
            status: { $in: ["accepted", "picked"] }
        })


        const completedOrders = await Order.countDocuments({
            transporter: transporterId,
            status: "delivered"
        });

        return res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            dashboard: {
                totalDeliveries: transporter.totalDeliveries || 0,
                rating: transporter.rating || 0,
                isAvailable: transporter.isAvailable,
                verificationStatus: transporter.verificationStatus,
                requestedOrders,
                activeOrders,
                completedOrders
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteTransporterAccount = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                message: "Transport provider not found",
                success: false
            });
        }

        if (transporter.isActive === false) {
            return res.status(400).json({
                message: "Account is already deleted",
                success: false
            });
        }


        transporter.isActive = false;
        transporter.isAvailable = false; // cannot accept deliveries
        await transporter.save();

        return res.status(200).json({
            message: "Transport provider account deleted successfully",
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

export const setLocation = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;

        const { location } = req.body;

        if (!location || !location.coordinates) {
            return res.status(400).json({
                message: "Location data required",
                success: false
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                message: "Transport provider not found",
                success: false
            });
        }

        transporter.location = {
            type: "Point",
            coordinates: location.coordinates,
            address: location.address
        };

        await transporter.save();

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

export const getAssignedOrders = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter || transporter.isActive === false) {
            return res.status(403).json({
                message: "Transport provider not found or inactive",
                success: false
            });
        }

        if (transporter.isBlocked) {
            return res.status(403).json({
                message: "Your account is blocked by admin",
                success: false
            });
        }

        const orders = await Order.find({ transporter: transporterId })
            .populate("buyer", "name phone")
            .populate("seller", "name phone")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Assigned orders fetched successfully",
            success: true,
            totalOrders: orders.length,
            orders
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const getTransporterNotifications = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const transporter = await TransportProvider.findById(transporterId).populate({
            path: "notifications",
            model: "Notification",
            options: { sort: { createdAt: -1 } }
        });

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Notifications fetched successfully",
            success: true,
            notifications: transporter.notifications || [],
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const transporterStatus = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const transporter = await TransportProvider.findById(transporterId).select("verificationStatus isVerified isKycCompleted isKycDataSubmitted");

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found"
            });
        }

        return res.status(200).json({
            success: true,
            sss: {
                verificationStatus: transporter.verificationStatus,
                isVerified: transporter.isVerified,
                isKycCompleted: transporter.isKycCompleted,
                isKycDataSubmitted: transporter.isKycDataSubmitted
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





export const getAvailablePickupAssignedToTransporter = async (req, res) => {
    try {
        const transporterId = req.user?.transporterId;

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized transporter",
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found",
            });
        }

        const now = new Date();

        // 🚚 Get only valid assignments
        const tasks = await TransporterAssignment.find({
            transporter: transporterId, // ✅ FIXED
            status: { $in: ["waiting", "pending"] }, // available tasks
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: now } }, // not expired
            ],
        })
            .populate({
                path: "sellerOrder",
                populate: [
                    { path: "buyer" },
                    { path: "sellerOrders" },
                ],
            })
            .sort({ priority: 1, createdAt: 1 }); // high priority first

        return res.status(200).json({
            success: true,
            total: tasks.length,
            tasks,
        });
    } catch (error) {
        console.error("Error fetching available pickup tasks:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getPickupTaskDetails = async (req, res) => {
    try {
        const transporterId = req.user?.transporterId;
        const { taskId } = req.params;

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized transporter",
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found",
            });
        }

        const task = await TransporterAssignment.findById(taskId)
            .populate({
                path: "sellerOrder",
                populate: [
                    { path: "buyer" },
                    { path: "sellerOrders" },
                ],
            });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Pickup task not found",
            });
        }

        if (task.transporter.toString() !== transporterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to access this task",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        console.log("Error in getPickupTaskDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getYourConfirmedPickupTasks = async (req, res) => {
    try {

        const transporterId = req.user?.transporterId;

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized transporter",
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found", 
            });
        }

        const confirmedTasks = await TransporterAssignment.find({
            transporter: transporterId,
            status: "confirmed",
        })
            .populate({
                path: "sellerOrder",
                populate: [
                    { path: "buyer" },
                    { path: "sellerOrders" },
                ],
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            total: confirmedTasks.length,
            tasks: confirmedTasks,
        });

    } catch (error) {

        console.log("Error in getYourConfirmedPickupTasks:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getSingleConfirmedPickupTask = async (req, res) => {
    try {

        const transporterId = req.user?.transporterId;
        const { taskId } = req.params;

        if (!transporterId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized transporter",
            });
        }

        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                success: false,
                message: "Transporter not found",
            });
        }

        const task = await TransporterAssignment.findOne({
            _id: taskId,
            transporter: transporterId,
            status: "confirmed",
        }).populate({
            path: "sellerOrder",
            populate: [
                { path: "buyer" },
                { path: "sellerOrders" },
            ],
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Confirmed pickup task not found",
            });
        }

        return res.status(200).json({
            success: true,
            task,
        });

    } catch (error) {

        console.log("Error in getSingleConfirmedPickupTask:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const verifyPickup = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const transporterId = req.user.transporterId;
        const { sellerOrderId } = req.params;
        const { otp } = req.body;

        const sellerOrder = await SellerOrder.findById(sellerOrderId).session(session);

        if (!sellerOrder) {
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        if (sellerOrder.transporter.toString() !== transporterId.toString()) {
            await session.abortTransaction();
            session.endSession();

            return res.status(403).json({
                success: false,
                message: "Unauthorized transporter"
            });
        }

        if (sellerOrder.pickupOTP !== otp) {

            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: "Invalid pickup OTP"
            });
        }


        for (const item of sellerOrder.products) {

            await deductStock(
                item.product,
                item.quantity,
                session
            );
        }

        sellerOrder.pickupVerified = true;
        sellerOrder.status = "picked_up";
        sellerOrder.pickedUpAt = new Date();
        sellerOrder.deliveryOTP = generateOTP();
        addStatusHistory(
            sellerOrder,
            "picked_up",
            transporterId
        );

        await sellerOrder.save({ session });
        await session.commitTransaction();
        session.endSession();


        return res.status(200).json({
            success: true,
            message: "Pickup verified successfully"
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const markInTransit = async (req, res) => {

    try {
        const transporterId = req.user.transporterId;
        const { sellerOrderId } = req.params;
        const sellerOrder = await SellerOrder.findById(sellerOrderI);

        if (sellerOrder.status !== "picked_up") {
            return res.status(400).json({
                success: false,
                message: "Order must be picked up first"
            });
        }

        sellerOrder.status = "in_transit";
        sellerOrder.inTransitAt = new Date();
     
        await sellerOrder.save();
        return res.status(200).json({
            success: true,
            message: "Order marked in transit"
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const markOutForDelivery = async (req, res) => {
    try {
        const transporterId = req.user.transporterId;
        const { sellerOrderId } = req.params;
        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (sellerOrder.status !== "in_transit") {
            return res.status(400).json({
                success: false,
                message: "Order must be in transit"
            });
        }

        sellerOrder.status = "out_for_delivery";
        sellerOrder.outForDeliveryAt = new Date();
        await sellerOrder.save();
        return res.status(200).json({
            success: true,
            message: "Order out for delivery"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const uploadDeliveryProof = async (req, res) => {
    try {

        const transporterId = req.user.transporterId;
        const { sellerOrderId } = req.params;
        const files = req.files || [];

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        if (sellerOrder.transporter.toString() !== transporterId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized transporter"
            });
        }

        const proofs = files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));


        sellerOrder.deliveryProofImages.push(...proofs);

        await sellerOrder.save();

        return res.status(200).json({
            success: true,
            message: "Delivery proof uploaded"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const completeDelivery = async (req, res) => {
    try {

        const transporterId = req.user.transporterId;
        const { sellerOrderId } = req.params;
        const { otp } = req.body;

        const sellerOrder = await SellerOrder.findById(sellerOrderId);
        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        if (sellerOrder.deliveryOTP !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery OTP"
            });
        }

        if (sellerOrder.deliveryProofImages.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Upload delivery proof first"
            });
        }

        sellerOrder.status = "delivered";
        sellerOrder.deliveryVerified = true;
        sellerOrder.deliveredAt = new Date();
        addStatusHistory(
            sellerOrder,
            "delivered",
            transporterId
        );

        await sellerOrder.save();

        // TODO:
        // release seller payment
        // enable ratings and reviews
        // send notifications to buyer and seller
        // close logistics task

        return res.status(200).json({
            success: true,
            message: "Order delivered successfully"
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}


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

export const transporterByRecommendationEngine = async (req, res) => {

    try {

        const { sellerOrderId } = req.params;
        const { buyerLocation, sellerLocation } = req.body;

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        if (!buyerLocation?.coordinates || !sellerLocation?.coordinates) {
            return res.status(400).json({
                success: false,
                message: "Buyer and seller location required"
            });
        }

        const transporters = await TransportProvider.find({
            isActive: true,
            isVerified: true,
            isBlocked: false
        });

        if (!transporters.length) {
            return res.status(404).json({
                success: false,
                message: "No transporters found"
            });
        }

        const scoredTransporters = transporters.map((t) => {


            const transporterLat = t.location.coordinates[1];
            const transporterLng = t.location.coordinates[0];

            const sellerLat = sellerLocation.coordinates[1];
            const sellerLng = sellerLocation.coordinates[0];

            const buyerLat = buyerLocation.coordinates[1];
            const buyerLng = buyerLocation.coordinates[0];

            const pickupDistance = haversineDistance(
                transporterLat,
                transporterLng,
                sellerLat,
                sellerLng
            );

            const deliveryDistance = haversineDistance(
                sellerLat,
                sellerLng,
                buyerLat,
                buyerLng
            );

            const totalDistance = pickupDistance + deliveryDistance;
            const distanceScore = Math.exp(-totalDistance / 10);

            const ratingScore = (t.totalRating || 0) / 5;

            const acceptanceRate = t.totalRequest > 0 ? t.acceptedRequests / t.totalRequest : 0;

            const cancellationRate = t.totalRequest > 0 ? t.cancelledRequests / t.totalRequest : 0;

            const workloadScore = 1 / (1 + (t.activeDeliveriesCount || 0));

            const experienceScore = Math.min((t.totalDeliveries || 0) / 100, 1);

            const finalScore =
                0.30 * distanceScore +
                0.25 * ratingScore +
                0.20 * acceptanceRate +
                0.10 * workloadScore +
                0.10 * (1 - cancellationRate) +
                0.05 * experienceScore;

            return {
                transporter: t,
                distanceScore,
                ratingScore,
                finalScore
            };
        });

        const sortedTransporters = scoredTransporters.sort((a, b) => {

            if (b.finalScore !== a.finalScore)
                return b.finalScore - a.finalScore;

            if (a.distanceScore !== b.distanceScore)
                return a.distanceScore - b.distanceScore;

            return b.ratingScore - a.ratingScore;
        });

        const top5 = sortedTransporters.slice(0, 5);

        const assignments = [];


        for (let i = 0; i < top5.length; i++) {

            assignments.push({
                sellerOrder: sellerOrder._id,
                transporter: top5[i].transporter._id,
                priority: i + 1,
                status: i === 0 ? "pending" : "waiting",
                requestedAt: i === 0 ? new Date() : null,
                expiresAt: i === 0 ? new Date(Date.now() + 15 * 60 * 1000) : null
            });
        }

        await TransporterAssignment.insertMany(assignments);

        await transportRequestNotification({
            transporterId: top5[0].transporter._id,
            sellerOrderId: sellerOrder._id
        });

        return res.status(200).json({
            success: true,
            message: "Transporter dispatch started"
        });

    } catch (error) {

        console.error("Transporter Recommendation Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const acceptTransportRequest = async (req, res) => {

    try {

        const transporterId = req.user.transporterId;
        const { sellerOrderId } = req.params;

        const assignment =
            await TransporterAssignment.findOne({
                sellerOrder: sellerOrderId,
                transporter: transporterId,
                status: "pending"
            });

        if (!assignment) {
            return res.status(400).json({
                success: false,
                message: "No pending request"
            });
        }

        // request expired
        if (new Date() > assignment.expiresAt) {

            assignment.status = "expired";

            await assignment.save();

            return res.status(400).json({
                success: false,
                message: "Request expired"
            });
        }

        // accept assignment
        assignment.status = "accepted";
        await assignment.save();

        // expire all other assignments
        await TransporterAssignment.updateMany(
            {
                sellerOrder: sellerOrderId,
                _id: { $ne: assignment._id }
            },
            {
                $set: {
                    status: "expired"
                }
            }
        );

        // assign transporter finally
        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        sellerOrder.transporter = transporterId;
        sellerOrder.status = "pickup_assigned";
        sellerOrder.transporterAssignedAt = new Date();
        sellerOrder.pickupOTP = generateOTP();
        await sellerOrder.save();

        // transporter statistics
        await TransportProvider.findByIdAndUpdate(
            transporterId,
            {
                $inc: {
                    acceptedRequests: 1,
                    activeDeliveriesCount: 1
                }
            }
        );

        // notification
        sendPickupNotification({
            sellerId: sellerOrder.seller,
            transporterId,
            sellerOrderId
        }).catch(err =>
            console.log("Notification Error:", err)
        );

        return res.status(200).json({
            success: true,
            message: "Transport request accepted",
            pickupOTP: sellerOrder.pickupOTP
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const activateNextTransporter = async (sellerOrderId) => {

    const nextAssignment = await TransporterAssignment.findOne({
        sellerOrder: sellerOrderId,
        status: "waiting"
    }).sort({ priority: 1 });   //  this is used to get the next transporter in line based on priority (1 is highest)

    if (!nextAssignment) {
        console.log("No more transporters");
        return;
    }

    nextAssignment.status = "pending";
    nextAssignment.requestedAt = new Date();
    nextAssignment.expiresAt = new Date(Date.now() + 15 * 60 * 1000);           // waits for 15 minutes for the next transporter to accept the request

    await nextAssignment.save();
    await transportRequestNotification({
        transporterId: nextAssignment.transporter,
        sellerOrderId
    });
};

export const rejectTransportRequest = async (req, res) => {
    try {

        const transporterId = req.user.transporterId;
        const { sellerOrderId } = req.params;

        const assignment = await TransporterAssignment.findOne({
            sellerOrder: sellerOrderId,
            transporter: transporterId,
            status: "pending"
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "No pending assignment found"
            });
        }

        assignment.status = "rejected";
        await assignment.save();

        await TransportProvider.findByIdAndUpdate(                       // transporter stats
            transporterId,
            {
                $inc: {
                    cancelledRequests: 1
                }
            }
        );

        await activateNextTransporter(sellerOrderId);          // activate next transporter

        return res.status(200).json({
            success: true,
            message: "Transport request rejected"
        });

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};












