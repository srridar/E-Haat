import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const useGetTransporterApprovalRequest = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTransporters = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${ADMIN_API_END_POINT}/transporters-approval-req`,{ withCredentials: true });
      console.log("i rich below api hit transporter");
      if (res.data?.success) {
        setData(res.data.transporters || []);
      }
    } catch (error) {
      console.error("Transporter approval fetch failed:", error);
      navigate("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    getTransporters();
  }, [getTransporters]);

  return {
    data,
    loading,
    refetch: getTransporters,
  };
};

export default useGetTransporterApprovalRequest;
