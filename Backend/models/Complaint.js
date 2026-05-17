import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({

    sellerOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerOrder",
        required: true
    },

    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer",
        required: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },

    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TransportProvider"
    },

    issueType: {
        type: String,

        enum: [
            "damaged_product",
            "missing_items",
            "wrong_product",
            "late_delivery",
            "fake_product",
            "bad_quality",
            "package_opened",
            "other"
        ],

        required: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    proofImages: [
        {
            url: String,
            public_id: String
        }
    ],

    status: {
        type: String,

        enum: [
            "pending",
            "under_review",
            "resolved",
            "rejected",
            "refunded"
        ],

        default: "pending"
    },

    resolution: {
        type: String,
        default: ""
    },

    refundAmount: {
        type: Number,
        default: 0
    },

    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    refundStatus: {
        type: String,
        enum: [
            "not_requested",
            "pending",
            "approved",
            "rejected",
            "completed"
        ],
        default: "not_requested"
    },

    refundAmount: {
        type: Number,
        default: 0
    },

    refundProcessedAt: Date,

    resolvedAt: Date

}, { timestamps: true });

export const Complaint = mongoose.model("Complaint", complaintSchema);