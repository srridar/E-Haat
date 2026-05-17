import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer",
        required: true
    },

    sellerOrders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SellerOrder"
        }
    ],

    totalProductAmount: {
        type: Number,
        required: true
    },

    totalDeliveryCost: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        default: "cod"
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed",
            "refunded"
        ],
        default: "pending"
    },

    overallStatus: {
        type: String,
        enum: [
            "pending",
            "processing",
            "partially_shipped",
            "completed",
            "cancelled"
        ],
        default: "pending"
    }

}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);