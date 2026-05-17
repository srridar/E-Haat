import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './utils/db.js';
import adminRoute from './routes/admin.route.js';
import buyerRoute from './routes/buyer.route.js';
import productRoute from './routes/product.route.js';
import sellerRoute from './routes/seller.route.js';
import transporterRoute from './routes/transporter.route.js';
import contactRoute from './routes/contact.route.js';
import chatRoute from './routes/message.route.js';
import khaltiRoute from './routes/khalti.route.js';
import orderRoute from './routes/order.route.js'; 
import { Server } from "socket.io";
import http from "http";
import { startTransportExpiryJob } from "./job/transportExpiryJob.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 1. Create HTTP Server
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


const userSocketMap = {};
const adminSockets = new Set();

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];
export const getAdminSockets = () => adminSockets;

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.query;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;

    if (role === "admin" || role === "superadmin") {
      adminSockets.add(socket.id);
    }
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    adminSockets.delete(socket.id); // remove if admin

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


app.use("/api/v4/admin", adminRoute);
app.use("/api/v4/buyer", buyerRoute);
app.use("/api/v4/product", productRoute);
app.use("/api/v4/seller", sellerRoute);
app.use("/api/v4/transporter", transporterRoute);
app.use("/api/v4/contact", contactRoute);
app.use("/api/v4/chat", chatRoute);
app.use("/api/v4/khalti", khaltiRoute);
app.use("/api/v4/orders", orderRoute);


app.get('/', (req, res) => {
  res.send("Server is running with Socket.io");
});

connectDB() .then(() => {
    startTransportExpiryJob();
     server.listen(PORT, () => {
      console.log(` Server & Socket running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Database connection failed", err);
  });

export { app, io }; 