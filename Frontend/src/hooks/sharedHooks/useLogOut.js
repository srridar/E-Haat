import axios from 'axios';
import { useNavigate } from "react-router-dom";

const useLogOut = (role) => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v4/${role}/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                console.log("successfully log out");
                navigate(`/${role}/login`)
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }

    return logout;

}

export default useLogOut