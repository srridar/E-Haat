import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
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
    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransportProvider',
      required: true
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'picked', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
