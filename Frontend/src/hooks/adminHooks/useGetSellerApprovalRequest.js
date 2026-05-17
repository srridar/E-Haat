import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const useGetSellerApprovalRequest = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getSellers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API_END_POINT}/sellers-approval-req`, { withCredentials: true });
      
      if (res.data?.success) {
        setData(res.data.sellers || []);
      }

    } catch (error) {
      console.error("Profile fetch failed:", error);
      navigate(`/admin/dashboard`);
      return null;
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSellers();
  }, []);


  return {
    data,
    loading,
    refetch: getSellers
  };
};

export default useGetSellerApprovalRequest;