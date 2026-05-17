import express from "express";

import {
    raiseComplaint,
    uploadComplaintProof,
    resolveComplaint,
    getComplaintHistory,
    monitorComplaints
} from "../controllers/complaint.controller.js";

import {  isAuthenticated, isBuyer, isAdmin} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();


router.post(  "/raise",  isAuthenticated,  isBuyer,  raiseComplaint);
router.post(  "/upload-proof/:complaintId",  isAuthenticated,  isBuyer,  upload.array("images", 5),  uploadComplaintProof);
router.get( "/history", isAuthenticated, isBuyer, getComplaintHistory);
router.put("/resolve/:complaintId", isAuthenticated, isAdmin, resolveComplaint);
router.get( "/monitor", isAuthenticated, isAdmin, monitorComplaints);
