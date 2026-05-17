import cron from "node-cron";
import { TransporterAssignment } from "../models/TransporterAssignment.js";
import { activateNextTransporter } from "../controllers/TransportProvider.js";

export const startTransportExpiryJob = () => {

    // runs every 1 minute
    cron.schedule("* * * * *", async () => {

        try {
            const now = new Date();

            // find expired pending assignments
            const expiredAssignments = await TransporterAssignment.find({
                status: "pending",
                expiresAt: { $lte: now }
            });

            for (const assignment of expiredAssignments) {

                assignment.status = "expired";
                await assignment.save();

                // move to next transporter
                await activateNextTransporter(assignment.sellerOrder);
            }

            console.log("Transport expiry job executed");

        } catch (error) {
            console.log("Expiry Job Error:", error);
        }
    });
};