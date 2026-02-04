import React, { useEffect, useState } from "react";
import axios from "axios";
import { SELLER_API_END_POINT } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const AllMyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`${SELLER_API_END_POINT}/products`, { withCredentials: true });
      console.log(res.data);
      if (res.data.success) {
        setProducts(res.data.sellerProducts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);


  const fetchVerifiedProducts = async () => {

    setLoading(true);
    try {
      const res = await axios.get(`${SELLER_API_END_POINT}/verified-products`, { withCredentials: true });
      if (res.data.success) {
        setProducts(res.data.sellerVerifiedProducts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  }

  const handleEdit = (id) => {
    navigate(`/seller/products/update/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await axios.delete(
        `${SELLER_API_END_POINT}/delete-product/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setProducts((prev) => prev.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold text-[var(--text-gray)]">
        Loading your products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] px-6 py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--primary-green)]">
            My Products
          </h1>
          <p className="text-sm text-[var(--text-gray)] mt-1">
            Manage all products you have added to E-haat
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={fetchMyProducts}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 hover:-translate-y-1 transform transition-all duration-300"
          >
            All Products
          </button>

          <button
            onClick={fetchVerifiedProducts}
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 hover:-translate-y-1 transform transition-all duration-300"
          >
            Verified Products
          </button>
        </div>


        <button
          onClick={() => navigate("/product/create")}
          className="mt-4 md:mt-0 bg-[var(--primary-green)] hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow transition"
        >
          + Add New Product
        </button>
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="text-center text-[var(--text-gray)] mt-20">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">
            Start by adding your first product
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.images?.[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-lg text-gray-800">
                  {product.name}
                </h3>

                <p className="text-sm text-[var(--text-gray)] line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between text-sm mt-2">
                  <span className="font-medium text-green-700">
                    Rs. {product.price}
                  </span>
                  <span className="text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>

                <span className="inline-block text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full mt-2">
                  {product.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex border-t">
                <button
                  onClick={() => handleEdit(product._id)}
                  className="w-1/2 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="w-1/2 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllMyProducts;
