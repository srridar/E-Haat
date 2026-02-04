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
    getTransporterNotifications
} from "../controllers/TransportProvider.js";

const router = express.Router();

//   PATCH – “Update small part”
//   PUT  - “Replace existing data”
//   POST – “Create something new”
//   GET – “Give me data”

router.route("/register").post(registerTransportProvider);               
router.route("/login").post(loginTransportProvider);                    
router.route("/logout").post(isAuthenticated, logoutTransporter);  
router.route("/profile").get(isAuthenticated, getTransporterProfile);         //  tested 
router.route("/profile/update").patch(isAuthenticated,upload.single("profileImage"),updateTransportProviderProfile); 
router.route("/profile/changepassword").post(isAuthenticated, changeTransporterPassword); 
router.route("/delete").delete(isAuthenticated, deleteTransporterAccount);    
router.post("/submitkyc",
  isAuthenticated,
  (req, res, next) => {
    upload.fields([
      { name: "citizenshipCard", maxCount: 1 },
      { name: "drivingLicense", maxCount: 1 },
      { name: "vehicleRegistration", maxCount: 1 },
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
router.get("/dashboard", isAuthenticated, getTransporterDashboard); // to fetch data for dashboard
router.route("/products").get(isAuthenticated, getAssignedOrders);         
router.route("/acceptorder/:id").patch(isAuthenticated, acceptOrder); 
router.route("/rejectorder/:id").patch(isAuthenticated, rejectOrder); 
router.route("/updateorderstatus/:id").patch(isAuthenticated, updateOrderStatus);
router.get("/notifications",isAuthenticated,getTransporterNotifications)

export default router;