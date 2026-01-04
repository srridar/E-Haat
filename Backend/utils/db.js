import mongoose from 'mongoose';               
import dotenv from 'dotenv';   

dotenv.config(); 

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000 ,// Increase timeout to 30 seconds
            socketTimeoutMS: 160000,  // Increase socket timeout to 60 seconds
            connectTimeoutMS: 160000
        });
       console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error)
    }
};

export default connectDB;
