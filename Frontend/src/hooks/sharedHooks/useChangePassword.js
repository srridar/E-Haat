import axios from 'axios';
import { useNavigate } from "react-router-dom";

const useChangePassword = (role) => {
    const navigate = useNavigate();

    const changePassword = async (oldPassword, newPassword) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v4/${role}/change-password`,
                {oldPassword, newPassword}, { withCredentials: true });
            if (res.data.success) {
                navigate(`/${role}/login`)
            }
        } catch (error) {
            console.error("Change Password failed:", error);
        }
    }

    return changePassword;

}

export default useChangePassword