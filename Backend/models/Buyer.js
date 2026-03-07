import mongoose from "mongoose";
import validator from "validator";

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, " buyer name must consist at least 3 characters in his name"],
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
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        },
    ],
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, "Location coordinates are required"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


buyerSchema.index({ location: "2dsphere" });

export const Buyer = mongoose.model('Buyer', buyerSchema)