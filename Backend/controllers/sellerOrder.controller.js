import mongoose from "mongoose";
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { SellerOrder } from '../models/SellerOrder.js'
import { sendOrderNotification } from './notification.controller.js';
import { reserveStock, releaseReservedStock } from "./inventory.controller.js";


//         done 


export const placeOrder = async (req, res) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        console.log("Initiating order placement process...");
        const buyerId = req.user.buyerId;
        const { products, deliveryLocation } = req.body;

        console.log("Received order details:", { buyerId, products, deliveryLocation });

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No products provided"
            });
        }

        const productIds = products.map(item => item.productId);

        console.log("Fetching product details for IDs:", productIds);

        const dbProducts = await Product.find({ _id: { $in: productIds } }).populate("seller").session(session);

        console.log("Fetched products from DB:", dbProducts);

        if (dbProducts.length !== products.length) {
            throw new Error(
                "Some products not found"
            );
        }

        let totalProductAmount = 0;
        const sellerMap = new Map();


        for (const item of products) {

            const dbProduct = dbProducts.find(p => p._id.toString() === item.productId);
            if (!dbProduct) {
                throw new Error(
                    "Product not found"
                );
            }

            await reserveStock(dbProduct._id, item.quantity, session);

            const subtotal = dbProduct.price * item.quantity;
            totalProductAmount += subtotal;

            const sellerId = dbProduct.seller._id.toString();

            if (!sellerMap.has(sellerId)) {
                sellerMap.set(sellerId, []);
            }

            sellerMap.get(sellerId).push({
                product: dbProduct._id,
                quantity: item.quantity,
                price: dbProduct.price,
                subtotal
            });
        }

        const sellerOrderIds = [];

        for (const [sellerId, items] of sellerMap.entries()) {

            const sellerTotal = items.reduce(
                (sum, i) => sum + i.subtotal,
                0
            );

            const firstProduct = dbProducts.find(
                p => p.seller._id.toString() === sellerId
            );

            const sellerOrder = await SellerOrder.create([{
                mainOrder: null,
                buyer: buyerId,
                seller: sellerId,
                products: items,
                deliveryLocation,
                pickupLocation: firstProduct?.seller?.location, //    FIXED
                totalAmount: sellerTotal,
                status: "pending"
            }], { session });

            sellerOrderIds.push(sellerOrder[0]._id);
        }

        const order = await Order.create([{
            buyer: buyerId,
            sellerOrders: sellerOrderIds,
            totalProductAmount,
            totalDeliveryCost: 0,
            totalAmount: totalProductAmount,
            paymentMethod: "cod",
            paymentStatus: "pending",
            overallStatus: "pending"
        }], { session });


        const createdOrder = order[0];

        await SellerOrder.updateMany(
            { _id: { $in: sellerOrderIds } },
            { $set: { mainOrder: createdOrder._id } },
            { session }
        );


        await session.commitTransaction();
        session.endSession();


        // extracting seller ids details for notifications

        const sellerIds = [...sellerMap.keys()];

        await sendOrderNotification({
            buyerId,
            sellerIds,
            orderId: createdOrder._id,
            totalAmount: totalProductAmount
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: createdOrder,
        });

    } catch (error) {

        await session.abortTransaction();
        session.endSession();
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export const getBuyerOrders = async (req, res) => {

    try {
        const buyerId = req.user.buyerId;

        const orders = await Order.find({ buyer: buyerId }).populate({
            path: "sellerOrders",
            populate: [
                {
                    path: "seller",
                    select: "name email"
                },
                {
                    path: "products.product"
                }
            ]
        })
            .sort({ createdAt: -1 });


        return res.status(200).json({
            success: true,
            total: orders.length,
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

export const getSingleOrder = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const { orderId } = req.params;

        const order = await Order.findById(orderId)
            .populate("buyer")
            .populate({
                path: "sellerOrders",
                populate: [
                    {
                        path: "seller",
                        select: "name email"
                    },
                    {
                        path: "products.product"
                    },
                    {
                        path: "transporter",
                        select: "name phone"
                    }
                ]
            });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.buyer._id.toString() !== buyerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            order,
            sellerOrders: order.sellerOrders
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const cancelOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const buyerId = req.user.buyerId;
        const { orderId } = req.params;

        const order = await Order.findById(orderId).session(session);

        if (!order) {
            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.buyer.toString() !== buyerId.toString()) {
            await session.abortTransaction();
            session.endSession();

            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Get seller orders (FIXED FIELD)
        const sellerOrders = await SellerOrder.find({
            mainOrder: order._id
        }).session(session);

        const blockedStatuses = [
            "picked_up",
            "in_transit",
            "out_for_delivery",
            "delivered"
        ];

        const shipmentStarted = sellerOrders.some(
            item => blockedStatuses.includes(item.status)
        );

        if (shipmentStarted) {
            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                success: false,
                message: "Cannot cancel after shipment started"
            });
        }

        // Restore stock
        for (const sellerOrder of sellerOrders) {
            for (const item of sellerOrder.products) {
                await releaseReservedStock(item.product, item.quantity, session);
            }

            sellerOrder.status = "cancelled";
            await sellerOrder.save({ session });
        }

        // FIXED: correct field name
        order.overallStatus = "cancelled";

        await order.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
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
};

