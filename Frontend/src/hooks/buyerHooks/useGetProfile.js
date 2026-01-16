import axios from "axios";
import { useNavigate } from "react-router-dom";

const useGetProfile = (role) => {
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v4/${role}/profile`,
        { withCredentials: true }
      );

      if (res.data.success) {
        return res.data.data;   // profile data
      }
    } catch (error) {
      console.error("Profile fetch failed:", error);
      navigate(`/${role}/login`);
      return null;
    }
  };

  return getProfile;
};

export default useGetProfile;
