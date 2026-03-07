import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ADMIN_API_END_POINT } from "@/utils/constants";
import {
  ArrowLeft,
  Package, Tag, XCircle,
  CheckCircle2, AlertCircle, User,
  Eye, Archive, ShieldCheck, Trash2
} from 'lucide-react';

const ViewProductCompletly = () => {
  const { id } = useParams();
  const productId = useParams().id;
  console.log("Received product ID:", productId);

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');


   const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${ADMIN_API_END_POINT}/product-approval/${id}`, { withCredentials: true });
      console.log("control is here", res.data);
      if (res.data.success) {
        setProduct(res.data.product);
        console.log("Product data:", res.data.product);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const verifyProduct = async (productId, action) => {
    try {
      console.log("this is hit")
      const res = await axios.post(`${ADMIN_API_END_POINT}/verify-product`, { productId, action }, { withCredentials: true });
       console.log("this is hit1")
      if (res.data.success) {
        console.log("Product verified successfully");
        fetchProductDetails();
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [verifyProduct]);




  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImage(product.images[0].url);
    }
  }, [product]);

  if (loading) {
    return <div className="p-10 text-center">Loading product data...</div>;
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <div className="p-2 rounded-lg group-hover:bg-indigo-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Back to Dashboard
        </button>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            <Tag size={16} /> {product.category}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
          <p className="text-gray-500">ID: {product._id.substring(0, 5)}</p>
        </div>

        <div className={`flex gap-3 ${product.isVerified ? 'opacity-50 pointer-events-none' : ''}`}>
          <button
            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
            title="Delete Product"
          >
            <Trash2 size={24} />
          </button>

          {!product.isVerified && (
            <div className='flex gap-5'>
            <button
              onClick={() => verifyProduct(product._id, 'approved')}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-green-200 transition"
            >
              <ShieldCheck size={20} /> Verify Product
            </button>

              <button
              onClick={() => verifyProduct(product._id, 'rejected')}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-red-200 transition"
            >
              <XCircle size={20} /> Reject Product
            </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <img
              src={activeImage || 'https://via.placeholder.com/600'}
              alt="Product"
              className="w-full aspect-square object-contain bg-gray-50 rounded-2xl"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img.url)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition ${activeImage === img.url ? 'border-indigo-600' : 'border-transparent'
                  }`}
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover rounded-lg"
                  alt="thumbnail"
                />
              </button>
            ))}
          </div>
        </div>


        <div className="space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <span className="text-gray-400 text-xs uppercase font-bold">Price</span>
              <div className="text-2xl font-black text-gray-800">
                Rs. {product.price}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100">
              <span className="text-gray-400 text-xs uppercase font-bold">Stock Availability</span>
              <div className={`text-2xl font-black flex items-center gap-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                <Archive size={20} /> {product.stock}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Eye size={18} className="text-indigo-500" /> Product Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-6">
            <h3 className="text-indigo-900 font-bold mb-4 uppercase text-xs tracking-widest">
              Specifications
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between border-b border-indigo-100 pb-2">
                <span className="text-indigo-600 text-sm">Brand</span>
                <span className="font-semibold text-indigo-900">{product.brand}</span>
              </div>


              <div className="space-y-3 border-b border-indigo-100 pb-4">

                <div className="flex justify-between">
                  <span className="text-indigo-600 text-sm">Seller Name</span>
                  <span className="font-semibold text-indigo-900">
                    {product.seller?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-indigo-600 text-sm">Seller Email</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-indigo-200">
                    {product.seller?.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-indigo-600 text-sm">Seller Phone</span>
                  <span className="text-xs bg-white px-2 py-1 rounded border border-indigo-200">
                    {product.seller?.phone}
                  </span>
                </div>

              </div>


              <div className="flex justify-between border-b border-indigo-100 pb-2">
                <span className="text-indigo-600 text-sm">Quality Rating</span>
                <span className="font-semibold text-indigo-900">
                  ⭐ {product.rating} ({product.totalRatings} Reviews)
                </span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-indigo-600 text-sm">Status</span>
                <span className={`flex items-center gap-1 font-bold ${product.isVerified ? 'text-green-600' : 'text-amber-600'
                  }`}>
                  {product.isVerified ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {product.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              <span className="font-medium text-gray-700">
                Visibility: {product.isActive ? 'Public' : 'Hidden'}
              </span>
            </div>

            <button className="text-indigo-600 text-sm font-bold hover:underline">
              Toggle Visibility
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewProductCompletly;
