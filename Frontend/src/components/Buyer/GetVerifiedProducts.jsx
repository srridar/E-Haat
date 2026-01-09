import React, { useEffect, useState } from "react";
import ProductCard from "@/components/Buyer/ProductCard";

const GetVerifiedProducts = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");

  // Mock data (replace with API later)
  useEffect(() => {
    setProducts([
      {
        _id: 1,
        name: "Fresh Tomatoes",
        category: "Vegetables",
        location: "Butwal",
        price: 80,
        image:
          "https://images.unsplash.com/photo-1582515073490-dc99a76c7b14",
        sellerName: "Ram Farmers Group",
      },
      {
        _id: 2,
        name: "Organic Potatoes",
        category: "Vegetables",
        location: "Pokhara",
        price: 60,
        image:
          "https://images.unsplash.com/photo-1589927986089-35812388d1f4",
        sellerName: "Himal Agro",
      },
      {
        _id: 3,
        name: "Red Apples",
        category: "Fruits",
        location: "Kathmandu",
        price: 220,
        image:
          "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce",
        sellerName: "Apple Farm Nepal",
      },
    ]);
  }, []);

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    return (
      (category === "all" || product.category === category) &&
      (location === "all" || product.location === location)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Verified Products
        </h1>
        <p className="text-gray-500 mt-1">
          Browse verified products from trusted sellers
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow p-5 mb-8 flex flex-wrap gap-4">

        {/* Category Filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="all">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
        </select>

        {/* Location Filter */}
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="all">All Locations</option>
          <option value="Butwal">Butwal</option>
          <option value="Pokhara">Pokhara</option>
          <option value="Kathmandu">Kathmandu</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default GetVerifiedProducts;
