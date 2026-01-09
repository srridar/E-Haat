import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GetProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/product/${productId}`
        );
        setProduct(res.data.product);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="text-center py-10">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Product Images */}
        <div className="grid grid-cols-2 gap-4">
          {product.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`product-${index}`}
              className="w-full h-48 object-cover rounded-lg border"
            />
          ))}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          <div className="space-y-2 text-lg">
            <p>
              <span className="font-semibold">Price:</span> Rs. {product.price}
            </p>

            <p>
              <span className="font-semibold">Stock:</span>{" "}
              {product.stock > 0 ? product.stock : "Out of Stock"}
            </p>

            <p>
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>

            <p>
              <span className="font-semibold">Seller ID:</span>{" "}
              {product.seller}
            </p>
          </div>

          {/* CTA */}
          <button
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetProduct;
