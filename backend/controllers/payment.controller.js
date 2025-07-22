import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { medications } = req.body;

    if (Array.isArray(medications) || medications.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid or empty medications array!",
      });
    }

    const totalAmount = 0;

    const lineItems = medications.map((medication) => {
      const amount = Math.round(medication.price * 100);
      totalAmount += amount * medication.quantity;

      return {
        price_data: {
          currency: "USD",
          product_data: {
            name: medication.name,
            image: medication.image,
          },
          unit_price: amount,
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      currency: "USD",
      success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_URL}/cancel`,
      metadata: JSON.stringify(
        medications.map((medication) => ({
          _id: medication._id.toString(),
          quantity: medication.quantity,
          price: medication.price,
        }))
      ),
      userId: req.user._id.toString(),
    });

    res.status(200).json({
      success: true,
      message: "Successfully created checkout session",
      sessionId: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const medications = JSON.parse(session.metadata.medications);

      const newOrder = new Order({
        user: session.metadata.userId,
        medications: medications.map((medication) => ({
          medication: medication._id,
          quantity: medication.quantity,
          price: medication.price,
        })),
        totalAmount: session.amount_total / 100,
        sessionId,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message: "Session paid | Successfully created order",
        order: newOrder,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Error | Session is not paid!",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed at checkout success",
      error: error.message,
    });
  }
};
