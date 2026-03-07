import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logOut } from '@/redux/authSlice';

const useLogOut = (role) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logout = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v4/${role}/logout`, {}, { withCredentials: true });
            if (res.data.success) {
                console.log("successfully logged out");
                dispatch(logOut());
                if(role==="admin"){
                   navigate(`/${role}/login-enter`)
                }
                else{
                    navigate(`/${role}/login`)
                }
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }
    return logout;
}

export default useLogOut;