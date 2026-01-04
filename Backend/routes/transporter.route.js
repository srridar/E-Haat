import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated";
import {
    registerTransportProvider,
    loginTransportProvider,
    logoutTransporter,
    getTransporterProfile,
    updateTransportProviderProfile,
    changeTransporterPassword,
    deleteTransporterAccount,
    getAssignedOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus
} from "../controllers/TransportProvider";

const router = express.Router();

//   PATCH – “Update small part”
//   PUT  - “Replace existing data”
//   POST – “Create something new”
//   GET – “Give me data”

router.route("/register").post(registerTransportProvider);               
router.route("/login").post(loginTransportProvider);                    
router.route("/logout").get(isAuthenticated, logoutTransporter);  
router.route("/profile").get(isAuthenticated, getTransporterProfile);          
router.route("/profile/update").post(isAuthenticated, updateTransportProviderProfile); 
router.route("/profile/changepassword").post(isAuthenticated, changeTransporterPassword); 
router.route("/delete").delete(isAuthenticated, deleteTransporterAccount);    
  
router.route("/products").get(isAuthenticated, getAssignedOrders);         
router.route("/acceptorder/:id").patch(isAuthenticated, acceptOrder); 
router.route("/rejectorder/:id").patch(isAuthenticated, rejectOrder); 
router.route("/updateorderstatus/:id").patch(isAuthenticated, updateOrderStatus);

export default router;