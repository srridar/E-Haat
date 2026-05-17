import mongoose from "mongoose";

const transporterAssignmentSchema = new mongoose.Schema({

    sellerOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerOrder",
        required: true
    },

    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransportProvider",
        required: true
    },

    priority: {
        type: Number,
        required: true
    },

    status: {
        type: String,

        enum: [
            "waiting",
            "pending",
            "accepted",
            "rejected",
            "expired"
        ],

        default: "waiting"
    },

    // when transporter got request
    requestedAt: {
        type: Date,
        default: null
    },

    // request timeout
    expiresAt: {
        type: Date,
        default: null
    },

    respondedAt: {
        type: Date,
        default: null
    }

}, { timestamps: true });

export const TransporterAssignment =
    mongoose.model(
        "TransporterAssignment",
        transporterAssignmentSchema
    );