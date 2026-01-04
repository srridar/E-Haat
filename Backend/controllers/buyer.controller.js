import { Order } from '../models/Order.js';
import { Seller } from '../models/Seller.js'
import { Buyer } from '../models/Buyer.js'
import { Product } from "../models/product.model.js";
import { MAX_DISTANCE } from '../config/distance.config.js'


export const registerBuyer = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        if (!name || !email || !password || !address || !phone) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        const existingBuyer = await Buyer.findOne({ email });
        if (existingBuyer) {
            return res.status(400).json({ message: "Buyer with this email already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newBuyer = new Buyer({
            name,
            email,
            password: hashedPassword,
            address,
            phone
        });

        await newBuyer.save();
        return res.status(201).json({ message: "Buyer registered successfully", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


export const loginBuyer = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }
        const buyer = await Buyer.findOne({ email }).select('+password');
        if (!buyer) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, buyer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }

        if (buyer.isBlocked) {
            return res.status(403).json({
                message: "Account is blocked",
                success: false
            });
        }
        // Generate JWT Token
        const token = jwt.sign(
            { buyerId: buyer._id, role: 'buyer' },          //  id is obtained from buyer._id it is object id of mongodb . it will be used to identify the buyer in future requests
            process.env.JWT_SECRET,                         // secret key from environment variables USED to sign the token
            { expiresIn: '7d' }
        );

        const buyerData = {
            id: buyer._id,
            name: buyer.name,
            email: buyer.email,
            address: buyer.address,
            phone: buyer.phone
        }


        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure flag in production
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).json({
            message: "Login successful",
            success: true,
            buyer: buyerData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}



export const getBuyerProfile = async (req, res) => {
    try {
        const buyerId = req.buyer.buyerId;
        const buyer = await Buyer.findById(buyerId).select('-password');
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found", success: false });
        }

        return res.status(200).json({ buyer, success: true });
    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}



export const logoutBuyer = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,  // Expire the cookie immediately
            httpOnly: true,  // Prevent access via JavaScript
            secure: process.env.NODE_ENV === 'production',  // Only set secure cookies in production (HTTPS)
            sameSite: process.env.NODE_ENV === 'production' ? 'Strict' : 'Lax'
        }).json({
            message: "Logged out successfully!",
            success: true  // Corrected typo from 'sucess' to 'success'
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

//     updata buyer profile 

export const updateBuyerProfile = async (req, res) => {
    try {
        const { name, email, address, phone } = req.body;
        const buyerId = req.user.id;


        const buyer = await Buyer.findById(buyerId);

        if (!buyer) {
            return res.status(404).json({
                message: "buyer is not found",
                sucess: false
            })
        }

        if (email && email !== buyer.email) {
            const emailExists = await Buyer.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    message: "Email already in use",
                    success: false
                });
            }
            buyer.email = email;
        }

        if (name) buyer.name = name;
        if (address) buyer.address = address;
        if (phone) buyer.phone = phone;

        if (req.file) {
            buyer.profileImage = req.file.path; //  frontend  - >  multer middleware  ->  cloudinary upload  ->  req.file object created  ->Controller reads req.file.path  -> URL saved in MongoDB
        }

        await buyer.save();
        const updatedBuyer = {
            _id: buyer._id,
            name: buyer.name,
            email: buyer.email,
            address: buyer.address,
            phone: buyer.phone,
            profileImage: buyer.profileImage,

        }

        return res.status(200).json({
            message: "buyer Updated Successfully !",           // shows that the 
            updatedBuyer,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


//     change buyer password

export const changeBuyerPassword = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const buyer = await Buyer.findById(buyerId).select("+password");
        if (!buyer) {
            return res.status(404).json({
                message: "Buyer not found",
                success: false
            });
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, buyer.password);
        if (!isOldPasswordCorrect) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, buyer.password);
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password must be different from old password",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        buyer.password = hashedNewPassword;
        await buyer.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}


//      get all products of  veriefied sellers


export const getProductsFromVerifiedSellers = async (req, res) => {
    try {
        const products = await Product.find()
            .populate({
                path: "seller",
                match: { isVerified: true },   // only verified sellers
                select: "name email phone"
            });     // verifiedSellers contains list of all verified sellers along with their products


        const verifiedProducts = products.filter(product => product.seller !== null);

        if (verifiedProducts.length === 0) {
            return res.status(404).json({ message: "No products found from verified sellers", success: false });
        }

        return res.status(200).json({
            success: true,
            products: verifiedProducts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


//        create order by buyer

export const createOrderByBuyer = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { sellerId, products, transporterId, totalAmount } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                message: "Products must be a non-empty array",
                success: false
            });
        }

        // validate inputs
        if (!sellerId || !products || products.length === 0 || !transporterId || !totalAmount) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        // verify seller exists
        const seller = await Seller.findOne({ _id: sellerId, isVerified: true });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found", success: false });
        }
        // verify transporter exists
        const transporter = await TransportProvider.findOne({ _id: transporterId, isVerified: true, isActive: true });
        if (!transporter) {
            return res.status(404).json({ message: "Transporter not found", success: false });
        }

        await Order.create({
            buyer: buyerId,
            seller: sellerId,
            transporter: transporterId,
            products: products,
            totalAmount: totalAmount
        });

        return res.status(201).json({ message: "Order created successfully", success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


//       getMyOrders  history of orders by buyer

export const getMyOrdersByBuyer = async (req, res) => {
    try {
        const buyerId = req.user.id;            //  it comes from authentication middleware
        const allOrders = await Order.find({ buyer: buyerId })
            .populate("seller", "name phone email")           // seller details
            .populate("products.product", "name price");


        if (!allOrders || allOrders.length === 0) {
            return res.status(404).json({
                message: "You have not ordered any products yet",
                success: false
            });
        }

        const orderedProducts = [];
        allOrders.forEach(order => {
            order.products.forEach(item => {
                orderedProducts.push({
                    orderId: order._id,
                    productId: item.product._id,
                    productName: item.product.name,
                    productPrice: item.product.price,
                    quantity: item.quantity,
                    totalPrice: item.product.price * item.quantity,
                    seller: order.seller,
                    orderStatus: order.status,
                    isSellerRated: order.isSellerRated,
                    isTransportRated: order.isTransportRated
                })
            })
        })

        return res.status(200).json({
            success: true,
            orderedProducts
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }

}


//         rate transporter by buyer

export const rateTransporterByBuyer = async (req, res) => {
    try {
        const { rating, transporterId, orderId } = req.body;
        const buyerId = req.user.id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
        }

        // check if order exists and belongs to buyer
        const order = await Order.findOne({
            _id: orderId,
            buyer: buyerId,
            transporter: transporterId
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        if (order.status !== "DELIVERED") {
            return res.status(400).json({
                message: "You can rate transporter only after delivery",
                success: false
            });
        }

        // 4️⃣ Prevent double rating
        if (order.isTransportRated) {
            return res.status(400).json({
                message: "Transporter already rated for this order",
                success: false
            });
        }


        // check if transporter exists
        const transporter = await TransportProvider.findById(transporterId);
        if (!transporter) {
            return res.status(404).json({ message: "Transporter not found", success: false });
        }


        // update transporter's rating
        const newTotalRatings = transporter.totalRatings + 1;
        const newRating = ((transporter.rating * transporter.totalRatings) + rating) / newTotalRatings;

        transporter.rating = Number(newRating.toFixed(1));
        transporter.totalRatings = newTotalRatings;

        order.isTransportRated = true;

        await transporter.save();
        await order.save();

        return res.status(200).json({
            message: "Transporter rated successfully",
            success: true,
            rating: transporter.rating
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}



//       rate seller by buyer
export const rateSellerByBuyer = async (req, res) => {
    try {
        //  rating is done when buyer has received the product . technically after order is delivered . buyer can rate the seller by clicking on rate button in frontend. 
        //  then rating value is sent to backend along with sellerId in request body togeter with orderId to verify that buyer has purchased from that seller

        const { rating, sellerId, orderId } = req.body;
        const buyerId = req.user.id;

        // validate inputs - rating should be between 1 to 5
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
        }

        // check if order exists and belongs to buyer
        const order = await Order.findOne({
            _id: orderId,
            buyer: buyerId,
            seller: sellerId
        })

        if (!order) {
            return res.status(404).json({ message: "Order not found", success: false });
        }

        if (order.status !== "DELIVERED") {
            return res.status(400).json({
                message: "You can rate seller only after delivery",
                success: false
            });
        }

        // 4️⃣ Prevent double rating
        if (order.isSellerRated) {
            return res.status(400).json({
                message: "Seller already rated for this order",
                success: false
            });
        }

        // 5️⃣ Verify seller belongs to this order
        if (order.seller.toString() !== sellerId) {
            return res.status(403).json({
                message: "You are not allowed to rate this seller",
                success: false
            });
        }


        // check if seller exists
        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: "Seller not found", success: false });
        }

        // update seller's rating
        const newTotalRatings = seller.totalRatings + 1;
        const newRating = ((seller.rating * seller.totalRatings) + rating) / newTotalRatings;

        seller.rating = Number(newRating.toFixed(1));
        seller.totalRatings = newTotalRatings;

        order.isSellerRated = true;

        await seller.save();
        await order.save();

        return res.status(200).json({
            message: "Seller rated successfully",
            success: true,
            rating: seller.rating
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}


//        rate product by buyer

export const rateProductByBuyer = async (req, res) => {
    try {

        const { rating, productId, orderId } = req.body;
        const buyerId = req.user.id;

        // validate inputs - rating should be between 1 to 5
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5", success: false });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (order.buyer.toString() !== buyerId) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to rate this order",
            });
        }

        if (order.status !== "delivered") {
            return res.status(400).json({
                success: false,
                message: "You can rate product only after delivery",
            });
        }

        // 5️⃣ Prevent double rating
        if (order.isProductRated) {
            return res.status(400).json({
                success: false,
                message: "Product already rated for this order",
            });
        }


        // Check product exists in order
        const productInOrder = order.products.find(
            (item) => item.product.toString() === productId
        );


        if (!productInOrder) {
            return res.status(400).json({
                success: false,
                message: "This product is not part of the order",
            });
        }


        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const newTotalRatings = product.totalRatings + 1;
        const newRating =
            (product.rating * product.totalRatings + rating) / newTotalRatings;

        product.rating = newRating;
        product.totalRatings = newTotalRatings;

        await product.save();

        // 9️⃣ Mark order as product rated
        order.isProductRated = true;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Product rated successfully",
            rating: product.rating,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        })
    }
}


export const recommendProducts = async (req, res) => {
    try {
        const buyerId = req.user.id;
        const { category } = req.query;

        const buyer = await Buyer.findById(buyerId);
        if (!buyer) {
            return res.status(404).json({ message: "Buyer not found" });
        }

        const maxDistance = MAX_DISTANCE[category] || 20000;

        const nearbySellers = await Seller.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: buyer.location.coordinates
                    },
                    $maxDistance: maxDistance
                }
            },
            isActive: true
        })

        const sellerIds = nearbySellers.map(s => s._id);

        // 2️⃣ Fetch products
        const products = await Product.find({
            seller: { $in: sellerIds },
            category,
            isActive: true
        }).sort({ rating: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


