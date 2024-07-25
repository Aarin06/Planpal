import { Router } from "express";
import { User } from "../models/users.js";
import Stripe from "stripe";
import express from "express";

console.log(process.env['STRIPE_SECRET_KEY'])
const stripe = Stripe(
  process.env['STRIPE_SECRET_KEY'],
);
export const stripeRouter = Router();

const endpointSecret =
  "whsec_009dd382c29ccbd8be4017cbd52e4370e4cb6907a09fcc1c0db8f638f91b1945";

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
    console.log("charge captured ");

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const userId = session.metadata.userId;
        console.log("Payment was successful for user ID:", userId);
        const user = await User.findByPk(userId)
        if (!user){
          return res.status(404).json({error: "No user found"})
        }
        user.tier = 2
        await user.save()
        console.log("here is the updated user")
        console.log(user)
        break
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
  async (req, res) => {
    try {
      const product = await stripe.products.create({
        name: "Travel Master",
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: 499,
        currency: "usd",
      });

      if (req.user?.id) {
        console.log("i am here for");
        console.log(req.user.id);
        const session = await stripe.checkout.sessions.create({
          line_items: [
            {
              // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
              price: price.id,
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `http://localhost:4200/home`,
          cancel_url: `http://localhost:4200/payment/error`,
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
