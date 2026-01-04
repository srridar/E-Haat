/*

getMyRatings
applyForVerification
getVerificationStatus

*/

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TransportProvider } from "../models/TransportProvider.js";
import { Order } from "../models/Order.js"


export const registerTransportProvider = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            vehicle,
            serviceAreas,
            pricePerKm
        } = req.body;

        /* Validate input */
        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !vehicle?.type ||
            !vehicle?.numberPlate ||
            !vehicle?.capacityKg ||
            !pricePerKm
        ) {
            return res.status(400).json({
                message: "All required fields must be provided",
                success: false
            });
        }

        /* Check existing transporter */
        const existing = await TransportProvider.findOne({ email });
        if (existing) {
            return res.status(400).json({
                message: "Transport provider already exists",
                success: false
            });
        }

        /* 3️⃣ Hash password */
        const hashedPassword = await bcrypt.hash(password, 10);

        /* 4️⃣ Create transporter */
        const transporter = await TransportProvider.create({
            name,
            email,
            password: hashedPassword,
            phone,
            vehicle,
            serviceAreas,
            pricePerKm
        });

        /* 5️⃣ Response */
        return res.status(201).json({
            success: true,
            message:
                "Transport provider registered successfully. Verification pending.",
            transporter: {
                id: transporter._id,
                name: transporter.name,
                email: transporter.email,
                phone: transporter.phone,
                vehicle: transporter.vehicle,
                serviceAreas: transporter.serviceAreas,
                pricePerKm: transporter.pricePerKm,
                verificationStatus: transporter.verificationStatus
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

        /* 1️⃣ Validate input */
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        /* 2️⃣ Find transporter */
        const transporter = await TransportProvider
            .findOne({ email })
            .select("+password");

        if (!transporter) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        /* 3️⃣ Check if account is active */
        if (!transporter.isActive) {
            return res.status(403).json({
                message: "Account has been deactivated",
                success: false
            });
        }

        /* 4️⃣ Check if blocked */
        if (transporter.isBlocked) {
            return res.status(403).json({
                message: "Account is blocked by admin",
                success: false
            });
        }

        /* 5️⃣ Compare password */
        const isMatch = await bcrypt.compare(password, transporter.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            });
        }

        /* 6️⃣ Generate JWT */
        const token = jwt.sign(
            {
                id: transporter._id,
                role: "transporter"
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        /* 7️⃣ Response */
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
                    vehicle: transporter.vehicle,
                    isVerified: transporter.isVerified,
                    verificationStatus: transporter.verificationStatus,
                    isAvailable: transporter.isAvailable,
                    rating: transporter.rating
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

export const getTransporterProfile = async (req, res) => {

    try {
        const transporterId = req.user.id; // from JWT middleware
        const transporter = await TransportProvider.findById(transporterId).select("-password");

        if (!transporter) {
            return res.status(404).json({
                message: "Transporter not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Seller profile fetched successfully",
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
        const transporterId = req.user.id;
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

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const updateTransportProviderProfile = async (req, res) => {
    try {
        const transporterId = req.user.id;

        const {
            name,
            email,
            phone,
            serviceAreas,
            pricePerKm,
            isAvailable,
            vehicle
        } = req.body;

        /* 1️⃣ Find transporter */
        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                message: "Transport provider not found",
                success: false
            });
        }

        /* 2️⃣ Check email uniqueness (if updating email) */
        if (email && email !== transporter.email) {
            const emailExists = await TransportProvider.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email already in use",
                    success: false
                });
            }
            transporter.email = email;
        }

        /* 3️⃣ Update allowed fields */
        if (name) transporter.name = name;
        if (phone) transporter.phone = phone;
        if (Array.isArray(serviceAreas)) transporter.serviceAreas = serviceAreas;
        if (pricePerKm) transporter.pricePerKm = pricePerKm;
        if (typeof isAvailable === "boolean") transporter.isAvailable = isAvailable;

        /* 4️⃣ Update vehicle info (optional) */
        if (vehicle) {
            transporter.vehicle = {
                ...transporter.vehicle,
                ...vehicle
            };
        }

        await transporter.save();

        /* 5️⃣ Response */
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            transporter: {
                _id: transporter._id,
                name: transporter.name,
                email: transporter.email,
                phone: transporter.phone,
                serviceAreas: transporter.serviceAreas,
                vehicle: transporter.vehicle,
                pricePerKm: transporter.pricePerKm,
                isAvailable: transporter.isAvailable
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

export const deleteTransporterAccount = async (req, res) => {
    try {
        const transporterId = req.user.id;
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

export const getAssignedOrders = async (req, res) => {
    try {
        const transporterId = req.user.id;
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

        /* 4️⃣ Response */
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

export const acceptOrder = async (req, res) => {
    try {
        const transporterId = req.user.id;
        const orderId = req.params.id;

        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter || transporter.isBlocked || !transporter.isActive) {
            return res.status(403).json({
                message: "Transporter not authorized",
                success: false
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }



        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }


        if (order.status !== "pending") {
            return res.status(400).json({
                message: `Order already ${order.status}`,
                success: false
            });
        }

        order.status = "accepted";
        await order.save();

        return res.status(200).json({
            message: "Order accepted successfully",
            success: true,
            order
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const rejectOrder = async (req, res) => {
    try {
        const transporterId = req.user.id;
        const orderId = req.params.id;

        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter || transporter.isBlocked || !transporter.isActive) {
            return res.status(403).json({
                message: "Transporter not authorized",
                success: false
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        if (order.transporter.toString() !== transporterId) {
            return res.status(403).json({
                message: "You are not assigned to this order",
                success: false
            });
        }


        if (order.status !== "pending") {
            return res.status(400).json({
                message: `Order already ${order.status}`,
                success: false
            });
        }

        order.status = "rejected";
        order.transporter = null;
        await order.save();

        return res.status(200).json({
            message: "Order accepted successfully",
            success: true,
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const transporterId = req.user.id;
        const orderId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = ["picked", "delivered"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status update",
                success: false
            });
        }

        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter || transporter.isBlocked || !transporter.isActive) {
            return res.status(403).json({
                message: "Transporter not authorized",
                success: false
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false
            });
        }

        if (order.transporter.toString() !== transporterId) {
            return res.status(403).json({
                message: "You are not assigned to this order",
                success: false
            });
        }

        if (status === "picked" && order.status !== "accepted") {
            return res.status(400).json({
                message: "Order must be accepted before pickup",
                success: false
            });
        }

        if (status === "delivered" && order.status !== "picked") {
            return res.status(400).json({
                message: "Order must be picked before delivery",
                success: false
            });
        }

        order.status = status;
   
        if (status === "delivered") {
            transporter.totalDeliveries += 1;
            transporter.isAvailable = true;
            await transporter.save();
        }

        await order.save();

        return res.status(200).json({
            message: `Order marked as ${status}`,
            success: true,
            order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};









