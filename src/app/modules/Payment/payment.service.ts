import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IPayment } from "./payment.interface";
import stripe from "../../../helpars/stripe/stripe";

const createPayment = async (userId: string, payload: IPayment) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user not found");
  }

  const order = await prisma.order.findUnique({
    where: {
      id: payload.orderId,
    },
    include: {
      products: true,
      user: true,
    },
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "this order not found");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    // customer_name:order.user.name,
    customer_email: order.user.email,
    line_items: order.products.map((p) => ({
      price_data: {
        currency: "bdt",
        unit_amount: p.price *100,
        product_data: { name: p.name },
      },
      quantity: 1,
    })),
    success_url: `http://localhost:5000/success`,
    cancel_url: `http://localhost:5000/cancel`,
  });
  return session.url;
};

export const paymentService = {
  createPayment,
};
