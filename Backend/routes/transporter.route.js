import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload  from "../middlewares/multer.js";
import {
    registerTransportProvider,
    loginTransportProvider,
    logoutTransporter,
    getTransporterProfile,
    updateTransportProviderProfile,
    changeTransporterPassword,
    updateAvailabilityStatus,
    getTransporterDashboard,
    deleteTransporterAccount,
    getAssignedOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    submitTransporterKyc,
    getTransporterNotifications,
    setLocation,
    getTransportRequests,
    getTransportRequest,
    getAllTransportationRequests,
    updateRequestStatus

} from "../controllers/TransportProvider.js";

const router = express.Router();


router.route("/register").post(registerTransportProvider);               
router.route("/login").post(loginTransportProvider);                    
router.route("/logout").post(isAuthenticated, logoutTransporter);  
router.route("/profile").get(isAuthenticated, getTransporterProfile);
router.route("/setlocation").put(isAuthenticated, setLocation);
router.route("/profile/update").patch(isAuthenticated,upload.single("profileImage"),updateTransportProviderProfile); 
router.route("/change-password").post(isAuthenticated, changeTransporterPassword); 
router.route("/delete").delete(isAuthenticated, deleteTransporterAccount);    
router.post("/submitkyc",
  isAuthenticated,
  (req, res, next) => {
    upload.fields([
      { name: "citizenshipCard", maxCount: 1 },
      { name: "drivingLicense", maxCount: 1 },
      { name: "vehicleRegistration", maxCount: 1 },
      { name: "vehiclePhoto", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR FIELD:", err.field);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  submitTransporterKyc
);
router.put("/availability-status", isAuthenticated, updateAvailabilityStatus);
router.get("/dashboard", isAuthenticated, getTransporterDashboard); 
router.route("/products").get(isAuthenticated, getAssignedOrders);         
router.route("/acceptorder/:id").patch(isAuthenticated, acceptOrder); 
router.route("/rejectorder/:id").patch(isAuthenticated, rejectOrder); 
router.route("/updateorderstatus/:id").patch(isAuthenticated, updateOrderStatus);
router.get("/notifications",isAuthenticated,getTransporterNotifications)
router.get("/get-transports-req",isAuthenticated,getTransportRequests);
router.get("/get-transport-req/:id",isAuthenticated,getTransportRequest);
router.get("/get-all-requests", isAuthenticated, getAllTransportationRequests);
router.put("/request/:id/status",isAuthenticated,updateRequestStatus);


export default router;