import mongoose from "mongoose";
import {Product} from '../models/Product.js'



export const reserveStock = async (productId, quantity, session = null) => {

    const product = await Product.findById(productId).session(session);

    if (!product) {
        throw new Error( "Product not found");
    }

    const availableStock = product.stock - product.reservedStock;

    if (availableStock < quantity) {
        throw new Error(
            `${product.name} insufficient stock`
        );
    }

    product.reservedStock += quantity;
    await product.save({ session });
    return product;
};

export const releaseReservedStock = async (productId, quantity, session = null) => {

    const product = await Product.findById(productId).session(session);

    if (!product) {
        throw new Error("Product not found");
    }

    product.reservedStock -= quantity;

    // Prevent negative values
    if (product.reservedStock < 0) {
        product.reservedStock = 0;
    }

    await product.save({ session });

    return product;
};

export const deductStock = async (productId, quantity, session = null) => {
    const product = await Product.findById(productId).session(session);

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.reservedStock < quantity) {
        throw new Error("Reserved stock inconsistency");
    }

    if (product.stock < quantity) {
        throw new Error("Insufficient stock");
    }

    product.stock -= quantity;
    product.reservedStock -= quantity;

    await product.save({ session });

    return product;
};


export const restockProduct = async (req, res) => {
    try {
        const sellerId = req.user.sellerId;
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "Product and quantity required"
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Ownership validation
        if (product.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        product.stock += Number(quantity);
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product restocked successfully",
            stock: product.stock,
            reservedStock: product.reservedStock,
            availableStock: product.stock - product.reservedStock
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};