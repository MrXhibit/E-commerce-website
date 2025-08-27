import {
  createPaymentResponse,
  paymentUtillsInterface,
  verifyPaymentResponse,
} from "@/domain/interfaces/utils";

import Stripe from "stripe";
import { env } from "@/infrastructure/config/environment";
import { APIError } from "@/domain/entities";

// Initialize Stripe only if keys are available
let stripe: Stripe | null = null;

if (env.stripe_secret_key && env.stripe_publish_key) {
  try {
    stripe = new Stripe(env.stripe_secret_key, {
      apiVersion: '2025-07-30.basil',
    });
  } catch (error) {
    console.warn('Failed to initialize Stripe:', error);
  }
} else {
  console.warn('Stripe keys not configured. Payment functionality will be disabled.');
}

const createPayment = async function (
   amount: number,
   orderId: string, 
   userId: string,
): Promise<createPaymentResponse> {
  try {
    if (!stripe) {
      throw new APIError("Stripe not configured");
    }

    const metaData = { orderId, userId };
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: metaData,
      description: 'Export transaction for order #'+orderId,
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
    if (!stripe) {
      throw new APIError("Stripe not configured");
    }

    let isPayed = false;
    const paymentResponse = await stripe.paymentIntents.retrieve(paymentId);
    const orderId  = paymentResponse.metadata.orderId
    if (paymentResponse.status === "succeeded") isPayed = true;
    return { isPayed, paymentResponse,orderId };
  } catch (error) {
    throw new APIError();
  }
};

export const paymentUtills: paymentUtillsInterface = {
  createPayment,
  verifyPayment,
};
