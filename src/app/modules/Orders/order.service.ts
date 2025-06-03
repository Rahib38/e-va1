import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IOrder } from "./order.interface";
import { OrderStatus } from "@prisma/client";

const createOrder = async (
  userId: string,
//   productId: string,
  payload: IOrder
) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "this user not found");
  }

//   const productExists = await prisma.product.findUnique({
//     where: {
//       id: productId,
//     },
//   });

//   if (!productExists) {
//     throw new ApiError(httpStatus.NOT_FOUND, "this product not found");
//   }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: payload.productsId,
      },
    },
  });

  if (!products.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Valid products found");
  }

  const total = products.reduce((acc, p) => acc + p.price, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: OrderStatus.PENDING,
      products: {
        connect: payload.productsId.map((id: string) => ({ id })),
      },
    },
  });
  return order;
};

export const orderService = {
  createOrder,
};
