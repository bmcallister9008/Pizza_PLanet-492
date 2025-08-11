// backend/routes/stripeWebhook.js
import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/env.js";

const router = express.Router();

// Initialize Stripe with the key loaded by config/env.js
if (!STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");
const stripe = new Stripe(STRIPE_SECRET_KEY);

// Stripe requires RAW body for signature verification.
// IMPORTANT: Mount this router BEFORE global express.json() in server.js
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  try {
    if (!STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    // req.body is a Buffer because of express.raw
    const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

    if (event.type === "checkout.session.completed") {
      const s = event.data.object;

      await Order.create({
        email: s.customer_details?.email ?? null,
        status: "paid",
        total: (s.amount_total ?? 0) / 100,
        providerId: s.id,
        // optionally: metadata: s.metadata,
      });
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default router;
