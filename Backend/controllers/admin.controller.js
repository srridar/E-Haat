import Admin from '../models/Admin.js'
import Seller from '../models/Seller.js'
import Buyer from '../models/Buyer.js'
import Product from '../models/Product.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerAdmin = async () => {
    try {

        const hashedPassword = await bcrypt.hash("superadmin", 10);
        const newAdmin = new Admin({
            name: "SuperAdmin",
            email: "admin@ehaat.com",
            password: hashedPassword,
            role: "superadmin",
            phone: "9800000000"
        });

        await newAdmin.save();   // Save the new admin to the database
        return res.status(201).json({ message: "Admin registered successfully", success: true });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}


export const getAllUsers = async (req, res) => {
    try {
        const sellers = await Seller.find().select('-password');               // Never send passwords to frontend
        const buyers = await Buyer.find().select('-passoword');
        const transporters = await TransportProvider.find().select("-password");

        return res.status(200).json({
            success: true,
            data: {
                buyers,
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
                message: "Invalid role provided", success: false
            })
        }

        //  find account 

        const account = await Model.findById(userId);
        if (!account) {
            return res.status(404).json({
                message: "Account not found", success: false
            })
        }

        if (action === "approve") {
            account.isVerified = true;
            account.verificationStatus = "approved";
            account.verifiedAt = new Date();
        } else if (action === "reject") {
            account.isVerified = false;
            account.verificationStatus = "rejected";
            account.verifiedAt = new Date();
        } else {
            return res.status(400).json({
                message: "Invalid action",
                success: false
            });
        }
        await account.save();
        return res.status(200).json({
            message: `Account has been ${action}d successfully`,
            success: true
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error", success: false
        })
    }
}




