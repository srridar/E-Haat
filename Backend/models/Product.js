import mongoose from "mongoose";  // checked

function arrayLimit(val) {
    return val.length > 0;
}

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, "Product name must be at least 3 characters long"]
    },
    description: {
        type: String,
        required: true,
        minlength: [3, "Product name must be at least 3 characters long"],
        maxlength: [1750, "description length must be less than 750"]
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Vegetables",
            "Fruits",
            "Grains",
            "Dairy",
            "Food",
            "Clothing",
            "Furniture",
            "Electronics",
            "Other"
        ]

    },
    brand: {
        type: String,
        trim: true,
        default: "Generic"
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    unit:{
        type: String,
        required: true,
        enum: ["Kg", "Litre", "Piece", "Pack" ,"Gram", "Dozen", "Furniture", "Other"]
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    verifiedAt: {
        type: Date
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    images: [{
        url: String,
        public_id: String
    }],
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,

    }

}, { timestamps: true })


export const Product = mongoose.model('Product', productSchema)