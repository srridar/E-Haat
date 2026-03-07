import mongoose from 'mongoose';


const locationSchema = new mongoose.Schema(
  {
    province: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    municipality: {
      type: String,
      required: true,
      trim: true,
    },
    ward: {
      type: String,
      required: true,
      trim: true,
    },
    landmark: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);


const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Buyer',
      required: true
    },
    transporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransportProvider',
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
    isTransporterRated: {
      type: Boolean,
      default: false
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Seller',
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
    },
    deliveryCost: {
      type: Number,
    },
    totalCost: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'picked', 'delivered', 'cancelled'],
      default: 'pending'
    },
    deliveryLocation: {
      pickupLocation: {
        type: locationSchema,
        required: true,
      },

      destinationLocation: {
        type: locationSchema,
        required: true,
      },
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
