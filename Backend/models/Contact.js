import mongoose from "mongoose";
import validator from "validator";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },
    },

    phone: {
      type: String,
      required: true,
      match: [
        /^(98|97)\d{8}$/,
        "Please enter a valid Nepali mobile number",
      ],
    },

    subject: {
      type: String,
      required: true,
      minlength: [5, "Subject needs at least 5 characters"],
      maxlength: [500, "Subject must not exceed 60 characters"],
    },

    message: {
      type: String,
      required: true,
      minlength: [5, "Message needs at least 5 characters"],
      maxlength: [2000, "Message must not exceed 500 characters"],
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt (USED IN UI)
  }
);

export const ContactData = mongoose.model("ContactData", contactSchema);
