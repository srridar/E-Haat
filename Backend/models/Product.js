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
        maxlength: [150, "description length must be less than 150"]
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ["Electronics", "Clothing", "Food", "Furniture", "vegetables", "Other"]
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        url: String,
        public_id: String
    },
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