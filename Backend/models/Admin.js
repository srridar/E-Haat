
import mongoose from "mongoose";           // checked

const adminSchema = new mongoose.Schema({
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
    role: {
        type: String,
        default: "superadmin"
    },
    phone: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        },
    ],
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

export const Admin = mongoose.model('Admin', adminSchema)