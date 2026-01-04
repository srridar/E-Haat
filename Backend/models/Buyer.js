import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
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
        required: true,
        select: false         // never send password to frontend by default
    },
    address: {
        type: String,

        required: true
    },
    phone: {
        type: String,
        required: true
    },
    profileImage:{
        type: String
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
        city: String
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


buyerSchema.index({ location: "2dsphere" });

export const Buyer = mongoose.model('Buyer', buyerSchema)