import { Request, Response } from "express";
import httpStatus from "http-status";
import { string } from "zod";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "user Create successfully",
    data: result,
  });
});
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "login sent successfully",
    data: {
      accessToken: result.accessToken,
    },
  });
});

// const enterOtp = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.enterOtp(req.body);

//   // res.cookie("token", result.accessToken, { httpOnly: true });
//   res.cookie("token", result.accessToken, {
//     secure: config.env === "production",
//     httpOnly: true,
//     sameSite: "none",
//     maxAge: 1000 * 60 * 60 * 24 * 365,
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User logged in successfully",
//     data: result,
//   });
// });

// const logoutUser = catchAsync(async (req: Request, res: Response) => {
//   // Clear the token cookie
//   res.clearCookie("token", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User Successfully logged out",
//     data: null,
//   });
// });

// // get user profile
// const getMyProfile = catchAsync(async (req: Request, res: Response) => {
//   const userToken = req.headers.authorization;

//   const result = await AuthServices.getMyProfile(userToken as string);
//   sendResponse(res, {
//     success: true,
//     statusCode: 201,
//     message: "User profile retrieved successfully",
//     data: result,
//   });
// });

// // change password
// const changePassword = catchAsync(async (req: Request, res: Response) => {
//   const userToken = req.headers.authorization;
//   const { oldPassword, newPassword } = req.body;

//   const result = await AuthServices.changePassword(
//     userToken as string,
//     newPassword,
//     oldPassword
//   );
//   sendResponse(res, {
//     success: true,
//     statusCode: 201,
//     message: "Password changed successfully",
//     data: result,
//   });
// });

// // forgot password
// const forgotPassword = catchAsync(async (req: Request, res: Response) => {
//   const data = await AuthServices.forgotPassword(req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Check your email!",
//     data: data,
//   });
// });

// const resetPassword = catchAsync(async (req: Request, res: Response) => {
//   const token = req.headers.authorization || "";

//   await AuthServices.resetPassword(token, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Password Reset!",
//     data: null,
//   });
// });

export const AuthController = {
  createUser,
  loginUser,
  // enterOtp,
  // logoutUser,
  // getMyProfile,
  // changePassword,
  // forgotPassword,
  // resetPassword,
};
