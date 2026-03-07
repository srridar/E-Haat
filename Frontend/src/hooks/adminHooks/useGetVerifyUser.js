import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_API_END_POINT } from "@/utils/constants";

const useGetVerifyUser = () => {

  const navigate = useNavigate();

  const verifyUser = async (id, role, action) => {
    try {
      const res = await axios.post(`${ADMIN_API_END_POINT}/verify-user`,{ id, role, action }, { withCredentials: true } );

      if (res.data.success) {
        console.log("User verified successfully");
        navigate(`/admin/user/${role.toLowerCase()}/${id}`);
      }

    } catch (error) {
      console.log(error);
    }
  };

  return verifyUser;
};

export default useGetVerifyUser;
