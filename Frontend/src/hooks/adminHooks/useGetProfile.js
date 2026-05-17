import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {ADMIN_API_END_POINT} from "@/utils/constants";

const useGetProfile = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true); 

      const res = await axios.get(`${ADMIN_API_END_POINT}/profile-receiver`, { withCredentials: true });
      console.log("Profile fetch response:", res.data.admin);
      if (res.data.success) {
        setAdmin(res.data.admin);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setError("Unauthorized or session expired");
      navigate("/admin/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { admin, loading, error, refetch: fetchProfile };
};

export default useGetProfile;