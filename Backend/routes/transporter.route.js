import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isTransporter from "../middlewares/isTransporter.js";
import upload from "../middlewares/multer.js";
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
  submitTransporterKyc,
  getTransporterNotifications,
  setLocation,
  transporterStatus,

  getAvailablePickupTasks,
  verifyPickup,
  markInTransit,
  markOutForDelivery,
  uploadDeliveryProof,
  completeDelivery,
  rejectTransportRequest,
  acceptTransportRequest,
  transporterByRecommendationEngine,
  getAvailablePickupAssignedToTransporter,
  getPickupTaskDetails

} from "../controllers/TransportProvider.js";

import { trackTransporterLocation, updateTransporterLocation  } from '../controllers/tracking.controller.js';

const router = express.Router();

router.route("/register").post(registerTransportProvider);
router.route("/login").post(loginTransportProvider);
router.route("/logout").post(isAuthenticated, logoutTransporter);
router.route("/profile").get(isAuthenticated, getTransporterProfile);
router.route("/setlocation").put(isAuthenticated, setLocation);
router.route("/profile/update").patch(isAuthenticated, upload.single("profileImage"), updateTransportProviderProfile);
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
router.get("/notifications", isAuthenticated, getTransporterNotifications)

router.get("/verification-status", isAuthenticated, transporterStatus);
router.post("/pickup-task/:sellerOrderId /verify", isAuthenticated, verifyPickup);
router.post("/pickup-task/:sellerOrderId /in-transit", isAuthenticated, markInTransit);
router.post("/pickup-task/:sellerOrderId /out-for-delivery", isAuthenticated, markOutForDelivery);
router.post("/pickup-task/:sellerOrderId /upload-proof", isAuthenticated, upload.single("deliveryProof"), uploadDeliveryProof);
router.post("/pickup-task/:sellerOrderId /complete", isAuthenticated, completeDelivery);

router.get("/transporter-by-recommendation", isAuthenticated, transporterByRecommendationEngine);
router.get("/get-availabe-tasks",isAuthenticated,isTransporter, getAvailablePickupAssignedToTransporter);
router.post("/pickup-task/:taskId", isAuthenticated, isTransporter, getPickupTaskDetails);       
router.post("/accept-transporter-req", isAuthenticated, acceptTransportRequest);
router.post("/reject-transporter-req", isAuthenticated, rejectTransportRequest);



router.get("/tracking-transporter/:sellerOrderId", isAuthenticated, trackTransporterLocation);
router.put("/current-location-update", isAuthenticated, isTransporter, updateTransporterLocation);


export default router;