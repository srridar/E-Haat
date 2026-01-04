import monogoose from 'mongoose';

const orderSchema = new monogoose.Schema({
    buyer: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'Buyer',
        required: true
    },
    seller: {
        type: monogoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    isSellerRated: {
        type: Boolean,
        default: false  
    },
    isProductRated: {
        type: Boolean,
        default: false  
    },
    isTransportRated: {
        type: Boolean,
        default: false  
    },
    transporter:{
        type: monogoose.Schema.Types.ObjectId,
        ref: 'TransportProvider',
        required: true
    },
    products: [{
        product: {
            type: monogoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'picked', 'delivered', 'cancelled'],
        default: 'pending'          
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })