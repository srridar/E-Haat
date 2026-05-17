
import { Complaint } from "../models/Complaint.js";
import { SellerOrder } from "../models/SellerOrder.js";


export const raiseComplaint = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const {  sellerOrderId, issueType,  description} = req.body;


        if (   !sellerOrderId ||  !issueType ||  !description) {    
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const sellerOrder = await SellerOrder.findById(sellerOrderId);

        if (!sellerOrder) {
            return res.status(404).json({
                success: false,
                message: "Seller order not found"
            });
        }

        // Buyer ownership check
        if (
            sellerOrder.buyer.toString() !==
            buyerId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // Only delivered orders
        if (sellerOrder.status !== "delivered") {
            return res.status(400).json({
                success: false,
                message:
                    "Complaint can only be raised after delivery"
            });
        }

        const existingComplaint =
            await Complaint.findOne({
                sellerOrder: sellerOrderId,
                status: {
                    $in: [
                        "pending",
                        "under_review"
                    ]
                }
            });

        if (existingComplaint) {
            return res.status(400).json({
                success: false,
                message: "Complaint already exists for this order"
            });
        }

        const complaint =
            await Complaint.create({

                sellerOrder: sellerOrder._id,
                buyer: buyerId,
                seller: sellerOrder.seller,
                transporter: sellerOrder.transporter,
                issueType,
                description
            });


        sellerOrder.complaintRaised = true;
        await sellerOrder.save();
        return res.status(201).json({
            success: true,
            message:"Complaint raised successfully",
            complaint
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const uploadComplaintProof = async (req, res) => {
    try {

        const buyerId = req.user.buyerId;
        const complaintId = req.params.id;
        const files = req.files || [];

        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message:
                    "Complaint not found"
            });
        }

        if (
            complaint.buyer.toString() !==
            buyerId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const uploadedProofs = files.map(file => ({
            url: file.path,
            public_id: file.filename
        }));

        complaint.proofImages.push( ...uploadedProofs );

        complaint.status = "under_review";
        await complaint.save();

        return res.status(200).json({
            success: true,
            message: "Proof uploaded successfully",
            complaint
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const resolveComplaint = async (req, res) => {

    try {

        const adminId = req.user.adminId;

        const { complaintId } = req.params;

        const {
            resolution,
            status
        } = req.body;

        const complaint =
            await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message:
                    "Complaint not found"
            });
        }

        if (
            !["resolved", "rejected"]
                .includes(status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid complaint status"
            });
        }

        complaint.status = status;

        complaint.resolution = resolution;

        complaint.resolvedBy = adminId;

        complaint.resolvedAt = new Date();

        await complaint.save();

        return res.status(200).json({
            success: true,
            message:
                "Complaint resolved successfully",
            complaint
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message:
                "Internal Server Error"
        });
    }
};

export const getComplaintHistory = async (req, res) => {
    try {
        const buyerId = req.user.buyerId;
        const complaints = await Complaint.find({buyer: buyerId })
            .populate("seller")
            .populate("transporter")
            .populate("sellerOrder")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            total: complaints.length,
            complaints
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const monitorComplaints = async (req, res) => {
    try {
        const { status, complaintType, page = 1, limit = 10 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (complaintType) query.complaintType = complaintType;

        const complaints = await Complaint.find(query)
            .populate("buyer")
            .populate("seller")
            .populate("transporter")
            .populate("sellerOrder")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Complaint.countDocuments(query);

        return res.status(200).json({
            success: true,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            complaints
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


