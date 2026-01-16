import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TransportProvider } from "../models/TransportProvider.js";
import Order from "../models/Order.js"


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

        const transporter = await TransportProvider
            .findOne({ email })
            .select("+password");

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

        if (!transporter.isKycCompleted) {
            return res.status(403).json({
                success: false,
                message: "KYC not completed",
                kycRequired: true
            });
        }

        const token = jwt.sign(
            {
                id: transporter._id,
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



export const submitTransporterKyc = async (req, res) => {
    try {
        const transporterId = req.user.id;

        const { citizenshipId, drivingLicense, vehicleRegistration, vehicleType, numberPlate, capacityKg, serviceAreas, pricePerKm } = req.body;

      
        if (!citizenshipId || !drivingLicense || !vehicleRegistration || !vehicleType || !numberPlate || !capacityKg || !pricePerKm) {
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
            citizenshipId,
            drivingLicense,
            vehicleRegistration
        };

        transporter.vehicle = {
            type: vehicleType,
            numberPlate,
            capacityKg
        };

     
        transporter.serviceAreas = serviceAreas || [];
        transporter.pricePerKm = pricePerKm;


        transporter.isKycCompleted = true;
        transporter.verificationStatus = "pending";
        transporter.isVerified = false;

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




export const updateTransportProviderProfile = async (req, res) => {
    try {
        const transporterId = req.user.id;

        const { name, email, phone, serviceAreas, pricePerKm, isAvailable, vehicle } = req.body;
        const transporter = await TransportProvider.findById(transporterId);

        if (!transporter) {
            return res.status(404).json({
                message: "Transport provider not found",
                success: false
            });
        }

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

        if (name) transporter.name = name;
        if (phone) transporter.phone = phone;
        if (Array.isArray(serviceAreas)) transporter.serviceAreas = serviceAreas;
        if (pricePerKm) transporter.pricePerKm = pricePerKm;
        if (typeof isAvailable === "boolean") transporter.isAvailable = isAvailable;

        if (vehicle) {
            transporter.vehicle = {
                ...transporter.vehicle,
                ...vehicle
            };
        }

        await transporter.save();

        await Notification.create({
            user: transporterId,
            role: "trasporter",
            type: "profile_update",
            title: "Profile Updated",
            message: "Your profile has been updated successfully.",
        });

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




export const updateAvailabilityStatus = async (req, res) => {
    try {
        const transporterId = req.user.id;
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
        const transporterId = req.user.id;

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

        const activeOrders = await Order.countDocument({
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
// 




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

        const buyerId = order.buyer;
        const sellerId = order.seller;

        order.status = "accepted";
        await order.save();

        const notifications = [
            {
                user: buyerId,
                role: "buyer",
                type: "order",
                title: "Order Accepted",
                message: "Your order has been accepted by the transporter.",
                relatedId: order._id,
            },
            {
                user: sellerId,
                role: "seller",
                type: "order",
                title: "Order Accepted",
                message: "The transporter has accepted your order for delivery.",
                relatedId: order._id,
            },
            {
                user: transporterId,
                role: "transporter",
                type: "delivery",
                title: "Order Accepted",
                message: "You have accepted this order for delivery.",
                relatedId: order._id,
            },
            {
                user: null, // adminId if you have a specific admin
                role: "admin",
                type: "system",
                title: "Order Accepted",
                message: `Order #${order._id} has been accepted by the transporter.`,
                relatedId: order._id,
            },
        ];


        await Notification.insertMany(notifications);

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

        // Check transporter
        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter || transporter.isBlocked || !transporter.isActive) {
            return res.status(403).json({
                message: "Transporter not authorized",
                success: false,
            });
        }

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }

        // Ensure transporter is assigned to this order
        if (order.transporter.toString() !== transporterId) {
            return res.status(403).json({
                message: "You are not assigned to this order",
                success: false,
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: `Order already ${order.status}`,
                success: false,
            });
        }

        // Update order status
        order.status = "rejected";
        order.transporter = null; // unassign transporter
        await order.save();

        const buyerId = order.buyer;
        const sellerId = order.seller;

        // Notifications
        const notifications = [
            {
                user: buyerId,
                role: "buyer",
                type: "order",
                title: "Order Rejected",
                message: "Your order delivery has been rejected by the transporter.",
                relatedId: order._id,
            },
            {
                user: sellerId,
                role: "seller",
                type: "order",
                title: "Order Rejected",
                message: "The transporter has rejected the delivery for your order.",
                relatedId: order._id,
            },
            {
                user: transporterId,
                role: "transporter",
                type: "delivery",
                title: "Order Rejected",
                message: "You have rejected this order for delivery.",
                relatedId: order._id,
            },
            {
                user: null, // adminId or all admins
                role: "admin",
                type: "system",
                title: "Order Rejected",
                message: `Order #${order._id} has been rejected by the transporter.`,
                relatedId: order._id,
            },
        ];

        await Notification.insertMany(notifications);

        return res.status(200).json({
            message: "Order rejected successfully",
            success: true,
            order,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};





export const updateOrderStatus = async (req, res) => {
    try {
        const transporterId = req.user.id;
        const orderId = req.params.id;
        const { status } = req.body;

        const allowedStatuses = ["picked", "delivered"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status update",
                success: false,
            });
        }

        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter || transporter.isBlocked || !transporter.isActive) {
            return res.status(403).json({
                message: "Transporter not authorized",
                success: false,
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }

        if (order.transporter.toString() !== transporterId) {
            return res.status(403).json({
                message: "You are not assigned to this order",
                success: false,
            });
        }

        if (status === "picked" && order.status !== "accepted") {
            return res.status(400).json({
                message: "Order must be accepted before pickup",
                success: false,
            });
        }

        if (status === "delivered" && order.status !== "picked") {
            return res.status(400).json({
                message: "Order must be picked before delivery",
                success: false,
            });
        }

        // Update order status
        order.status = status;

        if (status === "delivered") {
            transporter.totalDeliveries = (transporter.totalDeliveries || 0) + 1;
            transporter.isAvailable = true;
            await transporter.save();
        }

        await order.save();

        // Create notifications dynamically based on status
        const notifications = [
            {
                user: order.buyer,
                role: "buyer",
                type: "order",
                title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                message:
                    status === "picked"
                        ? "Your order has been picked up by the transporter."
                        : "Your order has been delivered successfully.",
                relatedId: order._id,
            },
            {
                user: order.seller,
                role: "seller",
                type: "order",
                title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                message:
                    status === "picked"
                        ? "Your order has been picked up by the transporter."
                        : "Your order has been delivered to the buyer.",
                relatedId: order._id,
            },
            {
                user: transporterId,
                role: "transporter",
                type: "delivery",
                title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                message:
                    status === "picked"
                        ? "You have picked up the order for delivery."
                        : "You have successfully delivered the order.",
                relatedId: order._id,
            },
            {
                user: null, // optional adminId or all admins
                role: "admin",
                type: "system",
                title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                message: `Order #${order._id} status updated to ${status} by transporter.`,
                relatedId: order._id,
            },
        ];

        await Notification.insertMany(notifications);

        return res.status(200).json({
            message: `Order marked as ${status}`,
            success: true,
            order,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};






