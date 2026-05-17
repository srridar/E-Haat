import { SellerOrder } from "../models/SellerOrder.js";
import { TransportProvider } from "../models/TransportProvider.js";
import { TransporterAssignment } from "../models/TransporterAssignment.js";
import { transportRequestNotification } from "../controllers/notification.controller.js";


const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};


export const assignTransporterUsingAI = async ({ sellerOrderId }) => {

    try {
        const sellerOrder = await SellerOrder.findById(sellerOrderId);
        if (!sellerOrder) {
            throw new Error("Seller order not found");
        }

        const existingAssignment = await TransporterAssignment.findOne({
            sellerOrder: sellerOrder._id
        });

        if (existingAssignment) {
            return;
        }

        const buyerLocation = sellerOrder.deliveryLocation;
        const sellerLocation = sellerOrder.pickupLocation;

        if (!buyerLocation || !sellerLocation) {
            throw new Error("Missing buyer or seller location");
        }

        if (
            !buyerLocation?.coordinates ||
            !sellerLocation?.coordinates
        ) {
            throw new Error(
                "Pickup and delivery coordinates required"
            );
        }

        const transporters = await TransportProvider.find({
            isActive: true,
            isVerified: true,
            isBlocked: false
        });

        if (!transporters.length) {
            throw new Error("No transporters found");
        }

        const scoredTransporters = transporters.map((t) => {


            const transporterLat = t.location.coordinates[1];
            const transporterLng = t.location.coordinates[0];

            const sellerLat = sellerLocation.coordinates[1];
            const sellerLng = sellerLocation.coordinates[0];

            const buyerLat = buyerLocation.coordinates[1];
            const buyerLng = buyerLocation.coordinates[0];

            const pickupDistance = haversineDistance(
                transporterLat,
                transporterLng,
                sellerLat,
                sellerLng
            );

            const deliveryDistance = haversineDistance(
                sellerLat,
                sellerLng,
                buyerLat,
                buyerLng
            );

            const totalDistance = pickupDistance + deliveryDistance;
            const distanceScore = Math.exp(-totalDistance / 10);

            const ratingScore = (t.totalRating || 0) / 5;

            const acceptanceRate = t.totalRequest > 0 ? t.acceptedRequests / t.totalRequest : 0;

            const cancellationRate = t.totalRequest > 0 ? t.cancelledRequests / t.totalRequest : 0;

            const workloadScore = 1 / (1 + (t.activeDeliveriesCount || 0));

            const experienceScore = Math.min((t.totalDeliveries || 0) / 100, 1);

            const finalScore =
                0.30 * distanceScore +
                0.25 * ratingScore +
                0.20 * acceptanceRate +
                0.10 * workloadScore +
                0.10 * (1 - cancellationRate) +
                0.05 * experienceScore;

            return {
                transporter: t,
                distanceScore,
                ratingScore,
                finalScore
            };
        });


        const sortedTransporters =
            scoredTransporters.sort((a, b) => {

                if (b.finalScore !== a.finalScore) {
                    return b.finalScore - a.finalScore;
                }

                if (a.distanceScore !== b.distanceScore) {
                    return a.distanceScore - b.distanceScore;
                }

                return b.ratingScore - a.ratingScore;
            });

        const top5 = sortedTransporters.slice(0, 5);
        const assignments = [];

        for (let i = 0; i < top5.length; i++) {

            assignments.push({
                sellerOrder: sellerOrder._id,
                transporter: top5[i].transporter._id,
                priority: i + 1,
                status: i === 0 ? "pending" : "waiting",
                requestedAt: i === 0 ? new Date() : null,
                expiresAt: i === 0 ? new Date(Date.now() + 15 * 60 * 1000) : null
            });
        }

        await TransporterAssignment.insertMany(assignments);

        await transportRequestNotification({
            transporterId: top5[0].transporter._id,
            sellerOrderId: sellerOrder._id
        });

        return true;


    } catch (error) {
        console.error("Error in assignTransporterUsingAI:", error);
        throw error;
    }


}