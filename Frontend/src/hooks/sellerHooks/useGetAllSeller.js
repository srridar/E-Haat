import axios from "axios";

const useGetAllSpecificUser = () => {
    const getAllByRole = async (role) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v4/${role}/all`, { withCredentials: true });

            if (res.data.success) {
                return res.data.data;
            }
        } catch (error) {
            console.error("Profiles fetch failed:", error.response?.data || error);
            return null;
        }
    };

    return getAllByRole;
};

export default useGetAllSpecificUser;
