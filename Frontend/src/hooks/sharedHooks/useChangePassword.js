import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API = import.meta.env.COMMON_API_URL || "http://localhost:8000/api/v4";

const useChangePassword = (role) => {
    const navigate = useNavigate();

    const changePassword = async (oldPassword, newPassword) => {
        const promise = axios.post(
            `http://localhost:8000/api/v4/${role}/change-password`,
            { oldPassword, newPassword },
            { withCredentials: true }
        );

        toast.promise(promise, {
            loading: "Changing password...",
            success: "Password changed successfully!",
            error: (err) =>
                err?.response?.data?.message || "Failed to change password"
        });

        try {
            const res = await promise;

            if (res.data.success) {
                // Optional: force logout
                await axios.post(`${API}/api/logout`, {}, { withCredentials: true });

                navigate(`/${role}/login-enter`);
            }

        } catch (error) {
            console.error("Change Password failed:", error);
        }
    };

    return changePassword;
};

export default useChangePassword;