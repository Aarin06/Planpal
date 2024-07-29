import { Router } from "express";
import { User } from "../models/users.js";
import Stripe from "stripe";
import express from "express";
import { isAuthenticated } from "../middleware/helpers.js";
import { config } from "dotenv";

config();
const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY,
);
export const stripeRouter = Router();

process.env.STRIPE_ENDPOINT_SECRET;

stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata.userId;
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ error: "No user found" });
        }
        user.tier = 2;
        await user.save();
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send();
  },
);

stripeRouter.post(
  "/create-checkout-session",
  express.json(),
  isAuthenticated,
  async (req, res) => {
    try {
      const product = await stripe.products.create({
        name: "Travel Master",
        images: [
          "https://media.self.com/photos/5f0885ffef7a10ffa6640daa/4:3/w_5240,h_3929,c_limit/travel_plane_corona.jpeg",
        ],
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 499,
        currency: "usd",
      });

      if (req.user?.id) {
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: price.id,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `https://planpal.tech/home`,
          cancel_url: `https://planpal.tech/payment/error`,
          metadata: {
            userId: req.user.id,
          },
        });
        return res.json({ url: session.url });
      }
      res.status(401).json({ errors: "Not Authenticated" });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  },
);
