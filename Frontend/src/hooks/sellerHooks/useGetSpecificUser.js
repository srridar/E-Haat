import axios from "axios";

const useGetSpecificUser = () => {
  const getUserByRole = async (role, id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v4/${role}/${id}`,{ withCredentials: true });

      if (res.data.success) {
        return res.data.data;
      }
    } catch (error) {
      console.error("Profile fetch failed:", error.response?.data || error);
      return null;
    }
  };

  return getUserByRole;
};

export default useGetSpecificUser;
