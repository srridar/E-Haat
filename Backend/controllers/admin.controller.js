import { Admin } from '../models/Admin.js'
import { Seller } from '../models/Seller.js'
import { Buyer } from '../models/Buyer.js'
import { TransportProvider } from '../models/TransportProvider.js'
import { Product } from '../models/Product.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/getDataUri.js";
import cloudinary from "../utils/cloudinary.js";
import Notification from "../models/Notification.js"; 



export const registerSuperAdmin = async (req, res) => {
    try {
        const existingSuperAdmin = await Admin.findOne({ role: "superadmin" });

        if (existingSuperAdmin) {
            return res.status(403).json({
                message: "Super Admin already exists",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash("supraa-ehaat", 10);

        const newAdmin = new Admin({
            name: "SuperAdmin",
            email: "supraadmin@ehaat.com",
            password: hashedPassword,
            role: "superadmin",
            phone: "9867782172",
        });


        await newAdmin.save();

        return res.status(201).json({
            message: "Super Admin registered successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};








export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");

        if (!admin) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                message: "Account is deactivated",
                success: false,
            });
        }


        if (admin.lockUntil && admin.lockUntil > Date.now()) {
            return res.status(423).json({
                message: "Account is temporarily locked. Try again later.",
                success: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            admin.loginAttempts += 1;

            // Lock account after 5 failed attempts
            if (admin.loginAttempts >= 5) {
                admin.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
            }

            await admin.save();

            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        // 6️⃣ Reset login attempts on success
        admin.loginAttempts = 0;
        admin.lockUntil = undefined;
        admin.lastLogin = new Date();
        await admin.save();

        // 7️⃣ Generate JWT
        const token = jwt.sign(
            {
                adminId: admin._id,
                role: admin.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );


        const adminData = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
        };

        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: "Login successful",
                success: true,
                admin: adminData,
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};








export const createAdmin = async (req, res) => {
    try {

        if (req.user.role !== "superadmin") {
            return res.status(403).json({
                message: "Access denied. Only Super Admin can create admins.",
                success: false,
            });
        }

        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                message: "All required fields must be provided",
                success: false,
            });
        }


        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json({
                message: "Admin with this email already exists",
                success: false,
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const newAdmin = new Admin({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            role: "admin",
            isActive: true,
            createdBy: req.user._id,
        });

        await newAdmin.save();

        return res.status(201).json({
            message: "Admin created successfully",
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};








export const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const admin = await Admin.findById(adminId).select('-password'); // Exclude password field

        if (!admin) {
            return res.status(404).json({ message: "Admin not found", success: false });
        }
        return res.status(200).json({ success: true, admin });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const getAllUsers = async (req, res) => {
    try {
        const sellers = await Seller.find().select('-password');               // Never send passwords to frontend
        const transporters = await TransportProvider.find().select("-password");

        return res.status(200).json({
            success: true,
            data: {
                sellers,
                transporters
            }
        });

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email phone');  // Populate seller details means only name, email and phone of seller will be populated
        return res.status(200).json({ success: true, products });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find().select('-password');
        return res.status(200).json({ success: true, sellers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const getAllVerifiedSellers = async (req, res) => {
    try {
        const sellers = await Seller.find({ isVerified: true }).select('-password');
        return res.status(200).json({ success: true, sellers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const getAllUnVerifiedSellers = async (req, res) => {
    try {
        const sellers = await Seller.find({ isVerified: false }).select('-password');
        return res.status(200).json({ success: true, sellers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const getAllTransporters = async (req, res) => {
    try {
        const transporters = await TransportProvider.find().select('-password');
        return res.status(200).json({ success: true, transporters });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const getAllVerifiedTransporters = async (req, res) => {
    try {
        const transporters = await TransportProvider.find({ isVerified: true }).select('-password');
        return res.status(200).json({ success: true, transporters });
    } catch (error) {

        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}








export const getAllUnVerifiedTransporters = async (req, res) => {
    try {
        const transporters = await TransportProvider.find({ isVerified: false }).select('-password');
        return res.status(200).json({ success: true, transporters });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const removeProduct = async (req, res) => {
    try {
        const { productId } = req.params;       // Get productId from request parameters . id is defined in route and Frontend sends request to that route with productId
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found", success: false });
        }

        return res.status(200).json({ message: "Product removed successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}








export const verifyUser = async (req, res) => {
  try {
    const { userId, role, action } = req.body;
    let Model;

    if (role === "seller") {
      Model = Seller;
    } else if (role === "transporter") {
      Model = TransportProvider;
    } else {
      return res.status(400).json({
        message: "Invalid role provided",
        success: false,
      });
    }

    // Find account
    const account = await Model.findById(userId);
    if (!account) {
      return res.status(404).json({
        message: "Account not found",
        success: false,
      });
    }

    let notificationMessage = "";
    if (action === "approve") {
      account.isVerified = true;
      account.verificationStatus = "approved";
      account.verifiedAt = new Date();
      notificationMessage = "Your account has been approved by the admin.";
    } else if (action === "reject") {
      account.isVerified = false;
      account.verificationStatus = "rejected";
      account.verifiedAt = new Date();
      notificationMessage = "Your account verification has been rejected by the admin.";
    } else {
      return res.status(400).json({
        message: "Invalid action",
        success: false,
      });
    }

    await account.save();

    // Create a notification document
    const notification = new Notification({
      user: account._id,
      role: role,
      type: "verification",
      title: `Account ${action}d`,
      message: notificationMessage,
      relatedId: null, // optional, could be userId if needed
    });

    await notification.save();

    return res.status(200).json({
      message: `Account has been ${action}d successfully`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};








export const blockOrUnblockSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const { action } = req.body; // "block" | "unblock"

    if (!["block", "unblock"].includes(action)) {
      return res.status(400).json({
        message: "Invalid action",
        success: false,
      });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
        success: false,
      });
    }

    let notificationMessage = "";
    if (action === "block") {
      if (seller.isBlocked) {
        return res.status(400).json({
          message: "Seller is already blocked",
          success: false,
        });
      }
      seller.isBlocked = true;
      notificationMessage = "Your account has been blocked by the admin.";
    }

    if (action === "unblock") {
      if (!seller.isBlocked) {
        return res.status(400).json({
          message: "Seller is already unblocked",
          success: false,
        });
      }
      seller.isBlocked = false;
      notificationMessage = "Your account has been unblocked by the admin.";
    }

    // Save seller first
    await seller.save();

    // Create notification
    const notification = new Notification({
      user: seller._id,
      role: "seller",
      type: "system", // could also be "verification" or "account" type
      title: `Account ${action}ed`,
      message: notificationMessage,
      relatedId: seller._id, // optional, can reference sellerId
    });

    await notification.save();

    // Optionally, push notification id into seller's notifications array
    if (!seller.notifications) {
      seller.notifications = [];
    }
    seller.notifications.push(notification._id);
    await seller.save();

    return res.status(200).json({
      message: `Seller ${action}ed successfully`,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};








export const getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.user.adminId;
    const admin = await Admin.findById(adminId).populate({
      path: "notifications",
      model: "Notification",
      options: { sort: { createdAt: -1 } } // latest notifications first
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
        success: false,
      });
    }

    const notifications = admin.notifications || [];

    return res.status(200).json({
      message: "Notifications fetched successfully",
      success: true,
      notifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


