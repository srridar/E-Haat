import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
            required: true,
        },

        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, "Location coordinates are required"],
        },

        province: String,
        district: String,
        municipality: String,
        ward: String,
        landmark: String,
    },
    { _id: false }
);

const sellerOrderSchema = new mongoose.Schema({

    mainOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        deault: null
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

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            subtotal: {
                type: Number,
                required: true
            }
        }
    ],

    pickupLocation: {
        type: locationSchema,
        required: true
    },

    deliveryLocation: {
        type: locationSchema,
        required: true
    },

    deliveryCost: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,

        enum: [
            "pending",

            "pickup_requested",
            "pickup_assigned",
            "accepted",
            "preparing",
            "ready_for_pickup",
            "picked_up",
            "in_transit",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "rejected"
        ],

        default: "pending"
    },

    sellerPacked: {
        type: Boolean,
        default: false
    },

    transporterPicked: {
        type: Boolean,
        default: false
    },

    delivered: {
        type: Boolean,
        default: false
    },

    verificationCode: {
        type: String
    },

    sellerProofImages: [
        {
            url: String,
            public_id: String
        }
    ],

    packingCompletedAt: Date,

    isPackingCompleted: {
        type: Boolean,
        default: false
    },

    pickupProofImages: [
        {
            url: String,
            public_id: String
        }
    ],

    deliveryProofImages: [
        {
            url: String,
            public_id: String
        }
    ],

    complaintRaised: {
        type: Boolean,
        default: false
    },

    paymentReleasedToSeller: {
        type: Boolean,
        default: false
    },
    pickupOTP: String,

    deliveryOTP: String,

    pickupVerified: {
        type: Boolean,
        default: false
    },

    deliveryVerified: {
        type: Boolean,
        default: false
    },
    assignedByAdmin: {
        type: Boolean,
        default: false
    },

    transporterAssignedAt: Date,

    pickedUpAt: Date,

    inTransitAt: Date,

    outForDeliveryAt: Date,

    deliveredAt: Date,

    transporterNotes: String

}, { timestamps: true });

sellerOrderSchema.index({               //   for geospatial queries on pickup location
    pickupLocation: "2dsphere"
});

export const SellerOrder =
    mongoose.model(
        "SellerOrder",
        sellerOrderSchema
    );