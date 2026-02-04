import React, { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCT_API_END_POINT } from "@/utils/constants";

const GetAllProducts = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(
          `${PRODUCT_API_END_POINT}/get-all-product`
        );

        if (res.data.success) {
          setAllProducts(res.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div>
      <h2>All Products</h2>

      {allProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        allProducts.map((product) => (
          <div key={product._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{product.name}</h3>
            <p>Price: {product.price}</p>
            <p>{product.description}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default GetAllProducts;
