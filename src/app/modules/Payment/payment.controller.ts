import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await paymentService.createPayment(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "payment create successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
};
