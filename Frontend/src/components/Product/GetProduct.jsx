import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from 'react-toastify';
import { PRODUCT_API_END_POINT } from "@/utils/constants";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  BadgeCheck,
  ShieldCheck,
  Truck,
  RotateCcw
} from "lucide-react";
import { addToCart } from "@/redux/cartSlice";

const GetProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated  } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);


  const handleQuery = () => {
    if (isAuthenticated) {
      navigate(`/message/chat/seller/${product.seller._id}`);
    } else {
      toast.error("Only logged in users can chat with transporter. Please log in first!");
      navigate("/buyer/login");
    }
  };

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${PRODUCT_API_END_POINT}/get-product/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setProduct(res.data.product);
        setActiveImage(res.data.product.images?.[0]?.url || "");
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id, fetchProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    dispatch(addToCart({
      id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      sellerId: product.seller?._id,
      quantity: 1,
    }));
    setTimeout(() => navigate("/product/cart"), 800);
  };

  if (loading) return <LoadingSkeleton />;

  if (!product) return <ProductNotFound navigate={navigate} />;

  const outOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-green-100">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-black transition-all"
          >
            <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
              <ArrowLeft size={18} />
            </div>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <section className="lg:col-span-7 space-y-8">
            {/* Location Badge - More integrated and subtle */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-lime-500 rounded-full" />
                <h2 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Origin Details
                </h2>
              </div>
              <p className="text-xl font-extrabold text-slate-900 tracking-tight">
                Handcrafted near{" "}
                <span className="text-lime-600 italic">
                  {product?.seller?.location?.city?.split(",").slice(0, 5).join(", ") || "Nepal"}
                </span>
              </p>
            </div>

            {/* Main Image Stage */}
            <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-slate-50 border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden group flex items-center justify-center p-8 transition-all duration-500 hover:shadow-lime-100">
              {/* Subtle Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-lime-100/40 rounded-full blur-3xl group-hover:bg-lime-200/50 transition-colors" />

              <img
                src={activeImage}
                alt={product.name}
                className="relative z-10 w-full h-full object-contain transition-transform duration-1000 ease-out group-hover:scale-110"
              />

              {/* Product Overlay Label */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">View Full Quality</span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
              {product.images?.map((img) => (
                <button
                  key={img.public_id}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl transition-all duration-500 overflow-hidden group
          ${activeImage === img.url
                      ? "ring-[3px] ring-lime-500 ring-offset-4 scale-95 shadow-lg"
                      : "ring-1 ring-slate-200 hover:ring-lime-300 opacity-70 hover:opacity-100 hover:-translate-y-1"}`}
                >
                  <img
                    src={img.url}
                    alt="thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Active Indicator Overlay */}
                  {activeImage === img.url && (
                    <div className="absolute inset-0 bg-lime-500/5" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* RIGHT: DETAILS SECTION */}
          <section className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-8">
            <header className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.15em] rounded-full">
                  {product.category}
                </span>
                {product.isVerified && (
                  <span className="flex items-center gap-1.5 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1 rounded-full">
                    <BadgeCheck size={14} /> Verified
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex text-amber-400 text-sm">
                  {"★".repeat(5)}
                </div>
                <span className="text-sm text-slate-400 font-medium">
                  {product.totalRatings || 0} Reviews
                </span>
              </div>

              <div className="pt-2">
                <span className="text-4xl font-light text-slate-900">
                  Rs. <span className="font-bold">{product.price?.toLocaleString()}</span>
                </span>
              </div>
            </header>

            <div className="space-y-6">
              <div className="prose prose-slate prose-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About the product</h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <Truck size={20} className="text-slate-400" />
                  <span className="text-xs font-medium">Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <ShieldCheck size={20} className="text-slate-400" />
                  <span className="text-xs font-medium">Secure Checkout</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full animate-pulse ${outOfStock ? "bg-red-500" : "bg-green-500"}`} />
                <span className={`text-sm font-bold uppercase tracking-wider ${outOfStock ? "text-red-500" : "text-green-700"}`}>
                  {outOfStock ? "Currently Unavailable" : `${product.stock} units remaining`}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={outOfStock || isAdding}
                className={`w-full group relative flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all
                  ${outOfStock
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    : isAdding
                      ? "bg-black text-white"
                      : "bg-green-600 text-white hover:bg-green-700 hover:shadow-[0_20px_40px_rgba(22,163,74,0.2)] active:scale-[0.98]"
                  }`}
              >
                {isAdding ? (
                  <><CheckCircle className="animate-bounce" size={24} /> Processing...</>
                ) : outOfStock ? (
                  "Sold Out"
                ) : (
                  <><ShoppingCart size={22} className="group-hover:-translate-y-1 transition-transform" /> Add to Cart</>
                )}
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sold by</h3>
               <button
                onClick={() => navigate(`/product/seller/${product?.seller?._id}/products`)}
                className="w-full mt-6 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
        
              Seller Products
              </button>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                  {product.seller?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{product.seller?.name}</p>
                  <p className="text-xs text-slate-500">{product.seller?.email}</p>
                </div>
              </div>

              {/* New Action Button */}
              <button
                onClick={() => handleQuery()}
                className="w-full mt-6 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Ask Seller about product
              </button>
            </div>


          </section>
        </div>
      </main>
    </div>
  );
};


const LoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-green-600 rounded-full animate-spin" />
      <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Curating Detail</p>
    </div>
  </div>
);

const ProductNotFound = ({ navigate }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
      <RotateCcw size={40} className="text-slate-300" />
    </div>
    <h2 className="text-3xl font-bold text-slate-900 mb-2">Item not found</h2>
    <p className="text-slate-500 mb-8 max-w-sm">The product you're looking for might have been moved or is no longer available.</p>
    <button
      onClick={() => navigate("/")}
      className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-slate-800 transition-colors"
    >
      Return to Store
    </button>
  </div>
);

export default GetProduct;