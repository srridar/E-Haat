import mongoose from 'mongoose';
import validator from 'validator';

const contactSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
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
    phone: {
        type: String,
        required: true,
        match: [
            /^(98|97)\d{8}$/,
            "Please enter a valid Nepali mobile number"
        ]
    },
    subject: {
        type: String,
        required: true,
        minLength: [5, " subject needs atleast 5 characters ."],
        maxLength: [60, " subject must not longer than 60 characters"]
    },
    message: {
        type: String,
        required: true,
        minLength: [5, " subject needs atleast 5 characters ."],
        maxLength: [500, " subject must not longer than 50 characters"]
    },
    isRead: {
        type: Boolean,
        default: false
    }
})


export const ContactData = mongoose.model('ContactData', contactSchema);