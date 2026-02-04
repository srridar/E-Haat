import axios from "axios";
import { useNavigate } from "react-router-dom";

const useGetProfile = () => {
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v4/admin/profile-receiver`, { withCredentials: true });
      if (res.data.success) {
        return res.data.admin; 
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
      navigate(`/admin/dashboard`);
      return null;
    }
  };

  return getProfile;
};

export default useGetProfile;
