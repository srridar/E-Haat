import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,

        required: true
    },
    phone: {
        type: String,
        required: true
    },
    productsOwned: {
        type: [mongoose.Schema.Types.ObjectId],    // Array of product IDs
        ref: 'Product',
        default: []
    },
    rating: {
        type: Number,
        default: 0 
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    profileImage: {
        type: String, // Cloudinary URL
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    verifiedAt: Date,

}, { timestamps: true })

sellerSchema.index({ location: "2dsphere" });

export const Seller = mongoose.model('Seller', sellerSchema)