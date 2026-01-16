import mongoose from 'mongoose';
import validator from "validator";

const transportProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [4, " Transporter name must consist at least 4 characters in his name"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid email format"
        }

    },
    password: {
        type: String,
        required: true,
        select: false
    },
    phone: {
        type: String,
        required: true,
        match: [
            /^(98|97)\d{8}$/,
            "Please enter a valid Nepali mobile number"
        ]
    },
    role: {
        type: String,
        default: "transporter"
    },

    //          verification fields

    isVerified: {
        type: Boolean,
        default: false
    },

    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notification",
        },
    ],
    
    isKycCompleted: {
        type: Boolean,
        default: false
    },

    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    veritedAt: Date,

    //        KYC means Know Your Customer details 

    documents: {
        citizenshipId: {
            type: String   // Cloudinary URL
        },
        drivingLicense: {
            type: String
        },
        vehicleRegistration: {
            type: String
        }
    },

    /* ================= VEHICLE INFO ================= */
    vehicle: {
        type: {
            type: String,
            enum: ["Bike", "Pickup", "Truck", "Mini Truck"],
            required: true
        },
        numberPlate: {
            type: String,
            required: true
        },
        capacityKg: {
            type: Number,
            required: true
        }
    },


    //     service area details 

    serviceAreas: [
        {
            type: String  // Example: Kathmandu, Lalitpur
        }
    ],


    /* ================= PRICING ================= */
    pricePerKm: {
        type: Number,
        required: true
    },


    /* ================= STATUS ================= */
    isAvailable: {
        type: Boolean,
        default: true
    },

    isBlocked: {              // if isBlocked is true then transporter cannot accept new delivery requests
        type: Boolean,
        default: false
    },

    /* ================= RATING ================= */
    rating: {
        type: Number,
        default: 0
    },

    totalDeliveries: {
        type: Number,
        default: 0
    },

    isActive: {              // it helps to soft delete the user if isActive is false then user is deleted
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const TransportProvider = mongoose.model('TransportProvider', transportProviderSchema);