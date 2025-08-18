import {
  createPaymentResponse,
  paymentUtillsInterface,
  verifyPaymentResponse,
} from "@/domain/interfaces/utills";

import Stripe from "stripe";
import { env } from "@/infrastructure/config/environment";
import { APIError } from "@/domain/entities";

if (!env.stripe_secret_key || !env.stripe_publish_key) throw new APIError();
const stripe = new Stripe(env.stripe_secret_key);

const createPayment = async function (
  amount: number,
  orderId: string,
  userId: string,
): Promise<createPaymentResponse> {
  try {
    const metaData = { orderId, userId };
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: metaData,
    });

    return {
      amount: paymentIntent.amount,
      orderId: orderId,
      publish_key: env.stripe_publish_key!,
      secret: paymentIntent.client_secret!,
      userId,
    };
  } catch (error) {
    throw new APIError("payment failed");
  }
};
const verifyPayment = async function (paymentId: string): Promise<verifyPaymentResponse> {
  try {
    let isPayed = false;
    const paymentResponse = await stripe.paymentIntents.retrieve(paymentId);
    if (paymentResponse.status === "succeeded") isPayed = true;
    return { isPayed, paymentResponse };
  } catch (error) {
    throw new APIError();
  }
};

export const paymentUtills: paymentUtillsInterface = {
  createPayment,
  verifyPayment,
};
