import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './utils/db.js'
import adminRoute from './routes/admin.route.js'
import buyerRoute from './routes/buyer.route.js'
import productRoute from './routes/product.route.js'
import sellerRoute from './routes/seller.route.js'
import transporterRoute from './routes/transporter.route.js'
import contactRoute from './routes/contact.route.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
  origin: 'http://localhost:5173',  // Frontend URL
  credentials: true,  // Allow credentials (cookies)
};


app.use(cors(corsOptions));


app.use("/api/v4/admin", adminRoute);
app.use("/api/v4/buyer", buyerRoute);
app.use("/api/v4/product", productRoute);
app.use("/api/v4/seller",sellerRoute);
app.use("/api/v4/transporter",transporterRoute);
app.use("/api/v4/contact",contactRoute)

app.get('/',(req, res)=>{
  res.send(" server is running");
})

connectDB()
.then(()=>{
  app.listen(PORT, ()=>{
      console.log(`✅ Server running on port ${PORT}`);
  })
})
.catch((err)=>{
  console.error("❌ Database connection failed", err);
})