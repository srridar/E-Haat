import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Trash2, Plus, Minus, ShoppingBag,
  ArrowLeft, ChevronRight, ShieldCheck, Truck
} from "lucide-react";
import { removeFromCart, adjustQuantity } from "@/redux/cartSlice";

const Cart = () => {

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();


const handleCheckout = () => {
  if (items.length === 0) return;

  if (isAuthenticated) {
    navigate("/product/get-transporter");
  } else {
    toast.error("Only logged in users can choose a transporter. Please log in first!");

    navigate("/buyer/login", {
      state: { from: "/admin/checkout" },
    });
  }
};

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#a9b7c5] px-4">
        <div className="max-w-md w-full text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-white p-8 rounded-full shadow-sm border border-gray-100">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Your bag is empty</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Discover our latest arrivals and find something special to fill it with.
          </p>
          <button
            onClick={() => navigate("/product/all")}
            className="group w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Start Exploring
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6EC] pb-10 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">


        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <nav className="flex items-center gap-2 text-sm  mb-3 font-medium">
              <Link to="/" className="hover:text-green-600">Home</Link>
              <ChevronRight size={14} />
              <span className="text-gray-900">Shopping Bag</span>
            </nav>
            <h1 className="text-3xl font-black text-orange-600 tracking-tight flex items-center gap-4">
              Shopping Bag
              <span className="text-sm font-bold bg-green-700 text-white px-3 py-1 rounded-full tracking-normal">
                {items.length}
              </span>
            </h1>
          </div>
          <Link
            to="/product/all"
            className="inline-flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all underline decoration-2 underline-offset-8"
          >
            Continue Shopping
            <ChevronRight size={20} />
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

         
          <div className="lg:col-span-8 space-y-3">
            <div className="hidden md:grid grid-cols-12 px-6 mb-4 text-xs font-bold  uppercase tracking-widest">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div
                key={item.productId}
                className="group relative bg-slate-700  text-white border border-gray-100 p-3 rounded-2xl transition-all hover:shadow-xl hover:shadow-gray-400 hover:border-green-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 ">
                  {/* Item Details */}
                  <div className="md:col-span-6 flex items-center gap-6">
                    <div className="w-28 h-24 bg-gray-100 rounded-xl overflow-hidden border border-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-300 text-lg mb-1 leading-tight">{item.name}</h3>
                      <p className=" text-sm mb-2">Unit Price: Rs. {item.price?.toLocaleString()}</p>
                      <button
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-3 flex justify-center">
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                      <button
                        onClick={() => dispatch(adjustQuantity({ productId: item.productId, type: "decrement" }))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(adjustQuantity({ productId: item.productId, type: "increment" }))
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-green-500 transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="md:col-span-3 text-right">
                    <p className="text-xl font-black text-gray-200">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

         
          <aside className="lg:col-span-4">
            <div className="sticky top-8 bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50">
              <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Estimated Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-xs tracking-widest bg-green-50 px-2 py-1 rounded">Free</span>
                </div>
                <div className="h-px bg-gray-100 my-6" />
                <div className="flex justify-between items-end">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-green-600 leading-none">
                      Rs. {totalAmount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold mt-2 tracking-tighter">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={handleCheckout} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-300 flex items-center justify-center gap-3 group">
                  Get a Transporter
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex flex-col gap-4 pt-6 border-t border-gray-100 mt-6">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <ShieldCheck size={18} className="text-green-500" />
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Truck size={18} className="text-blue-500" />
                    Fast Doorstep Delivery
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;