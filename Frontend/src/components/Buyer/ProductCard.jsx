import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      
      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h3>

        <p className="text-sm text-gray-500">
          Category: {product.category}
        </p>

        <p className="text-sm text-gray-500">
          Location: {product.location}
        </p>

        <p className="text-green-600 font-bold text-lg">
          Rs. {product.price}
        </p>

        {/* Seller */}
        <div className="text-xs text-gray-500">
          Seller: {product.sellerName}
        </div>

        {/* Action */}
        <button className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl transition">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
