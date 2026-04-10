import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Package, Truck, Store, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Recommended for professional feedback
import { BUYER_API_END_POINT } from "@/utils/constants";

const RatingSection = ({ title, icon: Icon, type, onRate, isSubmitted, currentRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 bg-white ${
      isSubmitted ? "border-green-100 bg-green-50/30" : "border-gray-100 shadow-sm hover:border-indigo-100"
    }`}>
      {isSubmitted && (
        <div className="absolute top-4 right-4 text-green-500 flex items-center gap-1 text-xs font-bold uppercase">
          <CheckCircle size={14} /> Rated
        </div>
      )}
      
      <div className="flex flex-col items-center space-y-4">
        <div className={`p-3 rounded-full ${isSubmitted ? "bg-green-100 text-green-600" : "bg-indigo-50 text-indigo-600"}`}>
          <Icon size={24} />
        </div>
        
        <div className="text-center">
          <h3 className="font-bold text-gray-800 text-lg uppercase tracking-tight">{title}</h3>
          <p className="text-gray-500 text-sm">How was your experience?</p>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={isSubmitted}
              onMouseEnter={() => !isSubmitted && setHover(star)}
              onMouseLeave={() => !isSubmitted && setHover(0)}
              onClick={() => onRate(type, star)}
              className="focus:outline-none transition-transform active:scale-90 disabled:cursor-default"
            >
              <Star
                size={32}
                fill={(hover || currentRating) >= star ? "#fbbf24" : "none"}
                className={`transition-colors duration-200 ${
                  (hover || currentRating) >= star ? "text-yellow-400" : "text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const RateOrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // These IDs would normally come from your Order Details API
  const [orderData, setOrderData] = useState({
    sellerId: "",
    transporterId: "",
    productId: "", // For simplicity, rating the first product in the array
  });

  const [ratings, setRatings] = useState({
    seller: 0,
    product: 0,
    transporter: 0
  });

  const [submitted, setSubmitted] = useState({
    seller: false,
    product: false,
    transporter: false
  });


  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${BUYER_API_END_POINT}/get-order/${orderId}`, { withCredentials: true });
        const order = res.data.order;
        setOrderData({
          sellerId: order.seller,
          transporterId: order.transporter,
          productId: order.products[0].product // Assuming rating the main item
        });
        // Set existing rating status if already rated
        setSubmitted({
          seller: order.isSellerRated,
          transporter: order.isTransporterRated,
          product: order.isProductRated
        });
      } catch (err) {
        console.error("Error fetching order", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleRating = async (type, value) => {
    setRatings(prev => ({ ...prev, [type]: value }));
  };

  const submitAllRatings = async () => {
    setLoading(true);
    try {
      const endpoints = [
        { 
          url: "/rating-seller", 
          data: { rating: ratings.seller, sellerId: orderData.sellerId, orderId },
          key: "seller" 
        },
        { 
          url: "/rating-transporter", 
          data: { rating: ratings.transporter, transporterId: orderData.transporterId, orderId },
          key: "transporter" 
        },
        { 
          url: "/rating-product", 
          data: { rating: ratings.product, productId: orderData.productId, orderId },
          key: "product" 
        }
      ];

      // Only hit endpoints that haven't been submitted and have a rating > 0
      for (const item of endpoints) {
        if (!submitted[item.key] && ratings[item.key] > 0) {
          await axios.post(`${BUYER_API_END_POINT}${item.url}`, item.data, { withCredentials: true });
          setSubmitted(prev => ({ ...prev, [item.key]: true }));
        }
      }

      toast.success("Feedback submitted successfully!");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Rate Your Experience</h1>
          <p className="text-gray-500">Order ID: <span className="font-mono text-indigo-600">#{orderId.toUpperCase()}</span></p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <RatingSection 
            title="Product" 
            icon={Package} 
            type="product" 
            onRate={handleRating} 
            currentRating={ratings.product}
            isSubmitted={submitted.product}
          />
          <RatingSection 
            title="Seller" 
            icon={Store} 
            type="seller" 
            onRate={handleRating} 
            currentRating={ratings.seller}
            isSubmitted={submitted.seller}
          />
          <RatingSection 
            title="Delivery" 
            icon={Truck} 
            type="transporter" 
            onRate={handleRating} 
            currentRating={ratings.transporter}
            isSubmitted={submitted.transporter}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={submitAllRatings}
            disabled={loading || Object.values(ratings).every(r => r === 0)}
            className="w-full md:w-64 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Submit Feedback"}
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateOrderPage;