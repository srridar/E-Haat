import fetch from 'node-fetch';
import dotenv from 'dotenv';
import Order from "../models/Order.js";


dotenv.config();
const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2/epayment";



export const handlePayment = async (req, res) => {
    try {
        const khaltiRes = await fetch(
            "https://dev.khalti.com/api/v2/epayment/initiate/",
            {
                method: "POST",
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req.body),
            }
        );


        const text = await khaltiRes.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (err) {
            return res.status(500).json({
                error: "Invalid response from Khalti (HTML instead of JSON)",
                raw: text,
            });
        }

        if (!khaltiRes.ok) {
            return res.status(400).json({
                error: "Payment initiation failed",
                details: data,
            });
        }

        return res.json(data);
    } catch (error) {
        console.error("Error processing payment:", error);
        return res.status(500).json({
            error: "Server error",
        });
    }
};


export const lookupPayment = async (req, res) => {
  try {
    const { pidx, orderId } = req.body; // extract orderId from request body

    if (!pidx || !orderId) {
      return res.status(400).json({ error: "Missing payment ID or order ID." });
    }

    // Call Khalti lookup API
    const khaltiRes = await fetch(`${KHALTI_BASE_URL}/lookup/`, {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    });

    const data = await khaltiRes.json();

    if (!khaltiRes.ok) {
      console.error("Khalti API error:", data);
      return res.status(400).json({ error: "Payment lookup failed.", details: data });
    }

    // Update order if payment is completed
    if (data.status === "Completed") {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId, // must be a valid ObjectId
        { isPaymentCompleted: true, status: "accepted" },
        { new: true }
      );
      console.log("Order updated:", updatedOrder);
    }

    return res.json(data);
  } catch (error) {
    console.error("Error looking up payment:", error);
    res.status(500).json({ error: "An error occurred while looking up the payment." });
  }
};