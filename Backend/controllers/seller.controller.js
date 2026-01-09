import { Seller } from '../models/Seller'

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
            return res.status(400).json({ message: "Buyer with this email already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newSeller = new Seller({
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
        // Generate JWT Token
        const token = jwt.sign(
            { sellerId: seller._id, role: 'seller' },          //  id is obtained from buyer._id it is object id of mongodb . it will be used to identify the buyer in future requests
            process.env.JWT_SECRET,                         // secret key from environment variables USED to sign the token
            { expiresIn: '7d' }
        );

        const sellerData = {
            id: seller._id,
            name: seller.name,
            email: seller.email,
            address: seller.address,
            phone: seller.phone
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


export const getSellerProfile = async (req, res) => {
    try {
        const sellerId = req.user.id; // from JWT middleware

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
            seller
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};



export const updateSellerProfile = async (req, res) => {
    try {

        const { name, email, address, phone } = req.body;
        const sellerId = req.user.id;


        const seller = await Seller.findById(sellerId);

        if (!seller) {
            return res.status(404).json({
                message: "seller is not found",
                sucess: false
            })
        }

        if (email && email !== seller.email) {
            const emailExists = await Seller.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email already in use",
                    success: false
                });
            }
            seller.email = email;
        }

        if (name) seller.name = name;
        if (address) seller.address = address;
        if (phone) seller.phone = phone;
        //  frontend  - >  multer middleware  ->  cloudinary upload  ->  req.file object created  ->Controller reads req.file.path  -> URL saved in MongoDB

        if (req.file) {
            // delete old image from cloudinary
            if (seller.profileImage?.public_id) {
                await cloudinary.v2.uploader.destroy(
                    seller.profileImage.public_id
                );
            }

            // convert file buffer → data uri
            const fileUri = getDataUri(req.file);

            // upload to cloudinary
            const uploadResult = await cloudinary.v2.uploader.upload(
                fileUri.content,
                {
                    folder: "sellers/profile",
                    resource_type: "image",
                }
            );

            // save new image
            seller.profileImage = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };
        }

        await seller.save();
        const updatedSeller = {
            _id: seller._id,
            name: seller.name,
            email: seller.email,
            address: seller.address,
            phone: seller.phone,
            profileImage: seller.profileImage,

        }

        await Notification.create({
            user: sellerId,
            role: "seller",
            type: "profile_update",
            title: "Profile Updated",
            message: "Your profile has been updated successfully.",
        });

        return res.status(200).json({
            message: "Product Updated Successfully !",           // shows that the 
            updatedSeller,
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


export const changeSellerPassword = async (req, res) => {
    try {
        const sellerId = req.user.id;
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
        seller.password = hashedNewPassword;
        await seller.save();

        await Notification.create({
            user: sellerId,
            role: "seller",
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


export const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const seller = await Seller.findById(sellerId);
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

        const sellerProducts = await Product.find({ seller: sellerId });



        return res.status(200).json({
            message: " sellerProducts are fetched successfully !",
            success: true,
            totalProducts: sellerProducts.length,
            sellerProducts
        })

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}


export const deleteSellerAccount = async (req, res) => {
    try {
        const sellerId = req.user.id;
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



export const blockOrUnblockSeller = async (req, res) => {
    try {
        const sellerId = req.params.id;
        const { action } = req.body; // "block" | "unblock"

        if (!["block", "unblock"].includes(action)) {
            return res.status(400).json({
                message: "Invalid action",
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

        if (action === "block") {
            if (seller.isBlocked) {
                return res.status(400).json({
                    message: "Seller is already blocked",
                    success: false
                });
            }
            seller.isBlocked = true;
        }

        if (action === "unblock") {
            if (!seller.isBlocked) {
                return res.status(400).json({
                    message: "Seller is already unblocked",
                    success: false
                });
            }
            seller.isBlocked = false;
        }

        await seller.save();

        return res.status(200).json({
            message: `Seller ${action}ed successfully`,
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





















