import mongoose from "mongoose";
import validator from "validator";

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, " seller name must consist at least 3 characters in his name"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        minlength: [8, "Password must be at least 8 characters"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [
            /^(?:\+977|977)?(98|97)\d{8}$/,
            "Please enter a valid Nepali mobile number",
        ],
    },
    profileImage: {
        url: {
            type: String,
            default: "",
        },
        public_id: {
            type: String,
            default: "",
        },
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
    isBlocked: {
        type: Boolean,
        default: false
    },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        },
    ],
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
            type: [Number], 
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