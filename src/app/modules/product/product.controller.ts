import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ProductService } from "./product.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await ProductService.createProduct(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "product Create successfully",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getAllProduct();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get all product successfully", 
    data: result,
  });
});


export const productController ={
    createProduct,getAllProduct
}