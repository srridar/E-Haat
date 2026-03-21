import { Admin } from '../models/Admin.js'
import { Seller } from '../models/Seller.js'
import { ContactData } from '../models/Contact.js'
import { TransportProvider } from '../models/TransportProvider.js'
import { Product } from '../models/Product.js'
import Order from '../models/Order.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import Notification from "../models/Notification.js";
import mongoose from 'mongoose'
import { v2 as cloudinary } from 'cloudinary';


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
            if (admin.loginAttempts >= 5) {
                admin.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
            }

            await admin.save();

            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        admin.loginAttempts = 0;
        admin.lockUntil = undefined;
        admin.lastLogin = new Date();
        await admin.save();


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
            profileImage: admin.profileImage
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

export const logoutAdmin = async (req, res) => {
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

export const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { name, phone } = req.body;

        // 1. Find the admin first
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // 2. Update text fields if provided
        if (name) admin.name = name.trim();
        if (phone) admin.phone = phone.trim();

        // 3. Handle File Upload (Cloudinary)
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (admin.profileImage?.public_id) {
                try {
                    await cloudinary.uploader.destroy(admin.profileImage.public_id);
                } catch (err) {
                    console.error("Cloudinary Delete Error:", err);
                    // We continue even if delete fails to avoid blocking the update
                }
            }

            // Update with new image details
            // Note: Cloudinary storage via Multer usually provides 'path' and 'filename'
            admin.profileImage = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        // 4. Save changes
        await admin.save();

        // 5. Create notification (Non-blocking)
        Notification.create({
            user: adminId,
            role: "admin",
            type: "profile_update",
            title: "Profile Updated",
            message: "Your profile has been updated successfully."
        }).catch(err => console.error("Notification Error:", err));

        // 6. Return response (excluding sensitive data)
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            admin: {
                _id: admin._id,
                name: admin.name,
                phone: admin.phone,
                profileImage: admin.profileImage
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const changeAdminPassword = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const admin = await Admin.findById(adminId).select("+password");
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, admin.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;


        // Create notification
        const notification = await Notification.create({
            user: adminId,
            role: "admin",
            type: "password_change",
            title: "Password Changed",
            message: "Your password has been updated successfully.",
        });

        admin.notifications.push(notification._id);
        await admin.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}

export const getAllUsers = async (req, res) => {
    try {
        const sellers = await Seller.find().select('-password');
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

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(id).populate("seller", "name email phone");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Get product by ID error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const getAllUnVerifiedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isVerified: false }).populate("seller", "name email").sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Unverified products fetched successfully",
            products
        });
    } catch (error) {
        console.error("Get unverified products error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching unverified products"
        });
    }
};

export const getAllSellers = async (req, res) => {
    try {
        const sellers = await Seller.find().select('-password');
        return res.status(200).json({ success: true, sellers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

export const getSellerById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Seller ID",
            });
        }

        const seller = await Seller.findById(id);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            });
        }

        return res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
        console.error("Get product by ID error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

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
        const { productId } = req.params;
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
        const { id, role, action } = req.body;
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

        const account = await Model.findById(id);
        if (!account) {
            return res.status(404).json({
                message: "Account not found",
                success: false,
            });
        }

        let notificationMessage = "";
        if (action === "approved") {
            account.isVerified = true;
            console.log(account.isVerified);
            account.verificationStatus = "approved";
            account.verifiedAt = new Date();
            if (role === "transporter") {
                account.isKycCompleted = true;
            }
            notificationMessage = "Your account verification has been approved by the admin.";

        } else if (action === "rejected") {
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
        const notification = new Notification({
            user: account._id,
            role: role,
            type: "verification",
            title: `Account ${action}d`,
            message: notificationMessage,
            relatedId: null, // optional, could be userId if needed
        });

        await notification.save();
        account.notifications.push(notification._id);
        await account.save();

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

export const verifyProduct = async (req, res) => {
    try {
        const { productId, action } = req.body;
        const adminId = req.user.adminId;

        const product = await Product.findById(productId).populate("seller", "name email");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }

        let notificationMessage = "";

        if (action === "approved") {
            product.isVerified = true;
            product.verifiedBy = adminId;
            product.verifiedAt = new Date();
            notificationMessage = `Your product "${product.name}" has been approved by the admin.`;
        } else if (action === "rejected") {
            product.isVerified = false;
            product.verifiedBy = adminId;
            product.verifiedAt = new Date();
            notificationMessage = `Your product "${product.name}" has been rejected by the admin.`;
        }

        await product.save();

        const notification = new Notification({
            user: product.seller._id,
            role: "seller",
            type: "product",
            title: `Product ${action}d`,
            message: notificationMessage,
            relatedId: product._id,
        });

        const seller = await Seller.findById(product.seller._id);
        seller.notifications.push(notification._id);
        await seller.save();

        await notification.save();
        await product.save();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const blockOrUnblockUser = async (req, res) => {
    try {
        let Model;
        const { id, role, action } = req.body;

        if (!["block", "unblock"].includes(action)) {
            return res.status(400).json({
                message: "Invalid action",
                success: false,
            });
        }

        // ✅ assign correct model
        if (role === "seller") Model = Seller;
        else if (role === "buyer") Model = Buyer;
        else if (role === "transporter") Model = TransportProvider;

        // ✅ check role
        if (!Model) {
            return res.status(400).json({
                message: "Invalid role",
                success: false,
            });
        }

        const user = await Model.findById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        let notificationMessage = "";

        if (action === "block") {
            if (user.isBlocked) {
                return res.status(400).json({
                    message: "User is already blocked",
                    success: false,
                });
            }
            user.isBlocked = true;
            notificationMessage = "Your account has been blocked by the admin.";
        }

        if (action === "unblock") {
            if (!user.isBlocked) {
                return res.status(400).json({
                    message: "User is already unblocked",
                    success: false,
                });
            }
            user.isBlocked = false;
            notificationMessage = "Your account has been unblocked by the admin.";
        }

        // ✅ save user
        await user.save();

        // ✅ create notification
        const notification = new Notification({
            user: user._id,
            role: role,
            type: "system",
            title: `Account ${action}ed`,
            message: notificationMessage,
            relatedId: user._id,
        });

        await notification.save();

        // ✅ push notification to user
        if (!user.notifications) {
            user.notifications = [];
        }

        user.notifications.push(notification._id);
        await user.save();

        return res.status(200).json({
            message: `${role} ${action}ed successfully`,
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

export const blockOrUnblockProduct = async (req, res) => {
    try {
        const { id, action } = req.body;

        if (!["block", "unblock"].includes(action)) {
            return res.status(400).json({
                message: "Invalid action",
                success: false,
            });
        }
        const product = await Product.findById(id).populate("seller");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false,
            });
        }

        const seller = product.seller;

        let notificationMessage = "";

        if (action === "block") {
            if (product.isBlocked) {
                return res.status(400).json({
                    message: "Product is already blocked",
                    success: false,
                });
            }

            product.isBlocked = true;
            notificationMessage = `Your product "${product.name}" has been blocked by admin.`;
        }

        if (action === "unblock") {
            if (!product.isBlocked) {
                return res.status(400).json({
                    message: "Product is already unblocked",
                    success: false,
                });
            }

            product.isBlocked = false;
            notificationMessage = `Your product "${product.name}" has been unblocked by admin.`;
        }


        await product.save();

        // ✅ create notification for seller
        const notification = new Notification({
            user: seller._id,
            role: "seller",
            type: "product",
            title: `Product ${action}ed`,
            message: notificationMessage,
            relatedId: product._id,
        });

        await notification.save();


        if (!seller.notifications) {
            seller.notifications = [];
        }
        seller.notifications.push(notification._id);
        await seller.save();

        return res.status(200).json({
            message: `Product ${action}ed successfully`,
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

export const getAllContactRequest = async (req, res) => {
    try {
        const contacts = await ContactData.find({}).sort({ createdAt: -1 }).lean();
        return res.status(200).json({
            success: true,
            count: contacts.length,
            contacts,
        });

    } catch (error) {
        console.error("Get Contact Requests Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch contact requests",
        });
    }
};

export const getContactById = async (req, res) => {
    try {
        const contact = await ContactData.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                message: "Contact not found",
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            contact,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const contact = await ContactData.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                message: "Contact not found",
                success: false,
            });
        }
        contact.isRead = true;
        await contact.save();

        return res.status(200).json({
            message: "Marked as read",
            success: true,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contact = await ContactData.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({
                message: "Contact not found",
                success: false,
            });
        }

        await contact.deleteOne();
        return res.status(200).json({
            message: "Contact deleted successfully",
            success: true,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id, role } = req.body;
        if (role === "seller") {
            const seller = await Seller.findById(id).select('-password');
            if (!seller) {
                return res.status(401).json({
                    message: "Seller not found !",
                    success: false
                })
            }
            return res.status(200).json({
                success: true,
                user: seller
            });
        } else if (role === "transporter") {
            const transporter = await TransportProvider.findById(id).select('-password');
            if (!transporter) {
                return res.status(401).json({
                    message: "Transporter not found !",
                    success: false
                })
            }
            return res.status(200).json({
                success: true,
                user: transporter
            });
        } else {
            return res.status(400).json({
                message: "Invalid role provided",
                success: false,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getAllOrders = async (req, res) => {
    try {

        const adminId = req.user.adminId;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false,
            });
        }

        const orders = await Order.find();
        if (!orders) {
            return res.status(404).json({
                message: "Orders not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "All orders are feached successfully !",
            success: true,
            orders
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

export const getOrderById = async (req, res) => {
    try {

        const adminId = req.user.adminId;
        const { id } = req.params;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false,
            });
        }

        const order = await Order.findById(id)
            .populate("buyer", "name email phone")
            .populate("transporter", "name email phone")
            .populate({
                path: "products.product",
                model: "Product"
            })
            .populate({
                path: "products.seller",
                model: "Seller",
                select: "name email phone"
            });

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Order fetched successfully!",
            success: true,
            order
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export const updateOrderStatusByAdmin = async (req, res) => {
    try {
        const adminId = req.user.adminId;
        const { id } = req.params;
        const { status } = req.body;


        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found",
                success: false,
            });
        }

        const allowedStatus = [
            "pending",
            "accepted",
            "rejected",
            "picked",
            "delivered",
            "cancelled",
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
                success: false,
            });
        }


        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: `Order status updated to ${status} successfully`,
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



