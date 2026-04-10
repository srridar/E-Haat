import axios from "axios";
import { PAYMENT_API_END_POINT } from "@/utils/constants";

const handeleKhaltiapi = async (data) => {
  console.log(data);
  try {
    const response = await axios.post(`${PAYMENT_API_END_POINT}/initiate-payment`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Call Error:", error.response?.data || error.message);
    throw error;
  }
};

export { handeleKhaltiapi };