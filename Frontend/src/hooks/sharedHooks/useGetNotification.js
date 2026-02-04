import axios from "axios";


const useGetNotification = (role) => {
    let url;
    if (role === "admin") {
        url = " http://localhost:8000/api/v4/admin/admin-notifications";
    }
    else{
        url =`http://localhost:8000/api/v4/${role}/notifications`;
    }
    const getNotifications = async () => {
        try {
            const res = await axios.get(url, { withCredentials: true });
            if (res.data.success) {
                return res.data.notifications;
            }
            return [];
        } catch (error) {
            console.error("Notification fetch failed:", error);
            return [];
        }
    };

    return getNotifications;
};

export default useGetNotification;
