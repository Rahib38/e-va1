import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { orderService } from "./order.service";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await orderService.createOrder(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "order Create successfully",
    data: result,
  });
});


export const orderController ={
    createProduct
}