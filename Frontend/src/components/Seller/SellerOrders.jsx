import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ShoppingBag, Calendar, User, ArrowRight, Eye, 
  ChevronLeft, ChevronRight, Loader2, Search,
  Clock, CheckCircle2, XCircle, Truck, Package 
} from "lucide-react";
import { SELLER_API_END_POINT } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentStatus, setCurrentStatus] = useState(""); 
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  
  const limit = 10;

  // Status mapping for visual accents
  const statusConfig = {
    all: { label: "All Orders", bg: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
    pending: { label: "Pending", bg: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", icon: Clock },
    accepted: { label: "Accepted", bg: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", icon: Package },
    delivered: { label: "Delivered", bg: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500", icon: CheckCircle2 },
    rejected: { label: "Rejected", bg: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500", icon: XCircle },
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
      };
      if (currentStatus) params.status = currentStatus;

      const res = await axios.get(`${SELLER_API_END_POINT}/orders`, {
        params,
        withCredentials: true,
      });

      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalOrders(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, currentStatus]);

  const handleStatusChange = (status) => {
    setCurrentStatus(status);
    setCurrentPage(1); // Reset page on filter change
  };

  // Filter client-side for immediate transactional ID or Buyer Name search
  const filteredOrders = orders.filter((order) => {
    const matchesId = order._id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuyer = order.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesId || matchesBuyer;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="text-indigo-600" size={32} />
              Order Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track, manage, and process your incoming store operations.
            </p>
          </div>
          
          {/* Quick Stats Summary indicator */}
          <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm flex items-center gap-3 self-start md:self-auto">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package size={20} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Segment</div>
              <div className="text-xl font-bold text-slate-800">{totalOrders} Orders</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Tabs Filter */}
          <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {Object.keys(statusConfig).map((key) => {
              const statusKey = key === "all" ? "" : key;
              const isActive = currentStatus === statusKey;
              return (
                <button
                  key={key}
                  onClick={() => handleStatusChange(statusKey)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2
                    ${isActive 
                      ? "bg-slate-900 text-white shadow-md shadow-slate-200 scale-[1.02]" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-indigo-400" : statusConfig[key].dot}`} />
                  {statusConfig[key].label}
                </button>
              );
            })}
          </div>

          {/* Local Query bar */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search ID or Buyer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Orders Layout List Container */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1">
              There are no matching orders matching your current criteria or search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon || Clock;

              return (
                <div 
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                  {/* Top segment */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 bg-[#FBFDFE]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                      <div className="flex items-center text-xs text-slate-400 gap-1.5">
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </div>
                    </div>
                    
                    {/* Badge state indicator */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 self-start sm:self-auto ${config.bg}`}>
                      <StatusIcon size={14} />
                      {config.label}
                    </span>
                  </div>

                  {/* Body Content - Products and Meta */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Buyer Details */}
                    <div className="md:col-span-3 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {order.buyer?.name?.[0].toUpperCase() || "B"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-slate-400 font-medium">Customer</div>
                        <h4 className="text-sm font-bold text-slate-800 truncate">{order.buyer?.name || "Anonymous Buyer"}</h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{order.buyer?.email}</p>
                      </div>
                    </div>

                    {/* Product Listing Sub-Grid */}
                    <div className="md:col-span-6 space-y-3 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      {order.products?.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                            {item.product?.image || item.product?.images?.[0] ? (
                              <img 
                                src={item.product?.image || item.product?.images?.[0]} 
                                alt={item.product?.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-sm font-semibold text-slate-800 truncate">{item.product?.name || "Unknown Product"}</h5>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Qty: <span className="font-bold text-slate-700">{item.quantity}</span> 
                              {item.variant && ` • ${item.variant}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
                      <div className="text-left md:text-right">
                        <div className="text-xs text-slate-400 font-medium">Grand Total</div>
                        <div className="text-xl font-black text-slate-900 mt-0.5">
                          Rs. {order.totalAmount || order.products?.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString()}
                        </div>
                      </div>

                      <button onClick={() => navigate(`/seller/order-details/${order._id}`)} className="bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200 hover:border-indigo-600 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 group-hover:translate-x-0">
                        Details <ArrowRight size={14} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls Section */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200/60 mt-8 pt-4">
            <p className="text-xs font-medium text-slate-500">
              Showing page <span className="text-slate-800 font-bold">{currentPage}</span> of <span className="text-slate-800 font-bold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl transition-all text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Isolated Clean Loading Skeleton Screen State UI 
const OrderSkeleton = () => (
  <div className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-5 w-24 bg-slate-200 rounded-md" />
        <div className="h-4 w-32 bg-slate-100 rounded-md" />
      </div>
      <div className="h-6 w-20 bg-slate-200 rounded-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
      <div className="md:col-span-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-200" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-24 bg-slate-200 rounded" />
          <div className="h-2.5 w-32 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="md:col-span-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-200" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
          <div className="h-2.5 w-1/4 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="md:col-span-3 flex md:items-end flex-col gap-2">
        <div className="h-3 w-16 bg-slate-100 rounded" />
        <div className="h-5 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  </div>
);

export default SellerOrders;