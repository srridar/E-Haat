import mongoose from "mongoose";
import validator from "validator";

const buyerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, " buyer name must consist at least 3 characters in his name"]
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email format"
        }
    },
    password: {
        type: String,
        required: true,
        select: false         // never send password to frontend by default
    },
    phone: {
        type: String,
        required: true,
        match: [
            /^(98|97)\d{8}$/,
            "Please enter a valid Nepali mobile number"
        ]
    },
    profileImage: {
        url: String,
        public_id: String,
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
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        city: String
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


buyerSchema.index({ location: "2dsphere" });

export const Buyer = mongoose.model('Buyer', buyerSchema)