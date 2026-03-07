import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const useGetProductApprovalRequest = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${ADMIN_API_END_POINT}/products-approval-req`,
        { withCredentials: true }
      );

      if (res.data?.success) {
        setData(res.data.products || []);
      }
    } catch (error) {
      console.error("Product approval fetch failed:", error);
      navigate("/admin/dashboard"); // optional
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return {
    data,
    loading,
    refetch: getProducts,
  };
};

export default useGetProductApprovalRequest;
