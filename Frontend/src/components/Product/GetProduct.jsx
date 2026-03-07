import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";

const GetProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-500 hover:text-black transition-all"
          >
            <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase">Back</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
         
          <section className="lg:col-span-7 space-y-6">
            <div className="relative p-2 aspect-auto rounded-3xl bg-[#406106b9] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain p-7 transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
              {product.images?.map((img) => (
                <button
                  key={img.public_id}
                  onClick={() => setActiveImage(img.url)}
                  className={`relative flex-shrink-0 w-24 h-24 rounded-2xl border-2 transition-all duration-300 overflow-hidden
                    ${activeImage === img.url ? "border-green-600 ring-4 ring-green-50" : "border-transparent hover:border-slate-300"}`}
                >
                  <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
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

              {/* Trust Badges */}
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

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full animate-pulse ${outOfStock ? "bg-red-500" : "bg-green-500"}`} />
                <span className={`text-sm font-bold uppercase tracking-wider ${outOfStock ? "text-red-500" : "text-green-700"}`}>
                  {outOfStock ? "Currently Unavailable" : `${product.stock} units remaining`}
                </span>
              </div>

              {/* Action Button */}
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
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                  {product.seller?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{product.seller?.name}</p>
                  <p className="text-xs text-slate-500">{product.seller?.email}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Sub-components for cleaner code
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