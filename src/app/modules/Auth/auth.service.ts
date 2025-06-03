import { UserRole } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import emailSender from "../../../helpars/emailSender/emailSender";
import { IUser } from "./auth.interface";

const createUser = async (payload: IUser) => {
  const userExist = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist) {
    throw new ApiError(httpStatus.FORBIDDEN, "This user already exist");
  }
  const userData = {
    name: payload.name,
    password: payload.password,
    email: payload.email,
    role: UserRole.USER,
  };

  const result = await prisma.user.create({
    data: userData,
  });
  return result;
};




const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // const isPasswordMatch = await bcrypt.compare(password, user.password);
  // if (!isPasswordMatch) {
  //   throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect password');
  // }

  const accessToken = jwtHelpers.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  // Optional: save tokens in DB (only if you want to track them)
  await prisma.user.update({
    where: { id: user.id },
    data: {
      accessToken,
      refreshToken,
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};


// user login
// const enterOtp = async (payload: { otp: string; identifier: string }) => {
//   const userData = await prisma.user.findFirst({
//     where: {
//       AND: [
//         {
//           otp: payload.otp,
//         },
//       ],
//     },
//   });

//   if (!userData) {
//     throw new ApiError(404, "Your otp is incorrect");
//   }

//   if (userData.otpExpiry && userData.otpExpiry < new Date()) {
//     throw new ApiError(400, "Your otp has been expired");
//   }

//   const accessToken = jwtHelpers.generateToken(
//     {
//       id: userData.id,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.jwt_secret as Secret,
//     config.jwt.expires_in as string
//   );

//   const refreshToken = jwtHelpers.generateToken(
//     {
//       id: userData.id,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.refresh_token_secret as Secret,
//     config.jwt.refresh_token_expires_in as string
//   );

//   await prisma.user.update({
//     where: {
//       id: userData.id,
//     },
//     data: {
//       otp: null,
//       otpExpiry: null,
//     },
//   });

//   const result = {
//     accessToken,
//     refreshToken,
//   };

//   return result;
// };

// get user profile
// const getMyProfile = async (userToken: string) => {
//   const decodedToken = jwtHelpers.verifyToken(
//     userToken,
//     config.jwt.jwt_secret!
//   );

//   const result = await prisma.$transaction(async (TransactionClient) => {
//     const userProfile = await TransactionClient.user.findUnique({
//       where: {
//         id: decodedToken?.id,
//       },
//       select: {
//         id: true,
//         email: true,
//         role: true,
//         status: true,
//         profileImage: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     if (!userProfile) {
//       throw new ApiError(404, "User not found");
//     }

//     if (userProfile.status === UserStatus.INACTIVE) {
//       throw new ApiError(403, "Your account is inactive");
//     }

//     if (userProfile.role === UserRole.STUDENT) {
//       const customerProfile = await TransactionClient.student.findUnique({
//         where: {
//           email: userProfile.email,
//         },
//       });

//       return { ...userProfile, ...customerProfile };
//     } else if (userProfile.role === UserRole.BROKER) {
//       const helperProfile = await TransactionClient.broker.findUnique({
//         where: {
//           email: userProfile.email,
//         },

//       });

//       return { ...userProfile, ...helperProfile };
//     } else if (userProfile.role === UserRole.ADMIN) {
//       const adminProfile = await TransactionClient.admin.findUnique({
//         where: {
//           email: userProfile.email,
//         },
//       });

//       return { ...userProfile, ...adminProfile };
//     }

//     return userProfile;
//   });

//   return result;
// };

// change password

// const changePassword = async (
//   userToken: string,
//   newPassword: string,
//   oldPassword: string
// ) => {
//   const decodedToken = jwtHelpers.verifyToken(
//     userToken,
//     config.jwt.jwt_secret!
//   );

//   const user = await prisma.user.findUnique({
//     where: { id: decodedToken?.id },
//   });

//   if (!user || !user?.password) {
//     throw new ApiError(404, "User not found");
//   }

//   const isPasswordValid = await bcrypt.compare(oldPassword, user?.password);

//   if (!isPasswordValid) {
//     throw new ApiError(401, "Incorrect old password");
//   }

//   const hashedPassword = await bcrypt.hash(newPassword, 12);

//   await prisma.user.update({
//     where: {
//       id: decodedToken.id,
//     },
//     data: {
//       password: hashedPassword,
//     },
//   });
//   return { message: "Password changed successfully" };
// };

// const forgotPassword = async (payload: { email: string }) => {
//   const userData = await prisma.user.findUnique({
//     where: {
//       email: payload.email,
//     },
//   });
//   if (!userData) {
//     throw new ApiError(404, "User not found");
//   }

//   const resetPassToken = jwtHelpers.generateToken(
//     { email: userData.email, role: userData.role },
//     config.jwt.reset_pass_secret as Secret,
//     config.jwt.reset_pass_token_expires_in as string
//   );

//   const resetPassLink =
//     config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

//   await emailSender(
//     "Reset Your Password",
//     userData.email,
//     `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Password Reset Request</title>
// </head>
// <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; line-height: 1.6; color: #333333;">
//     <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
//         <div style="background-color: #FF7600; padding: 30px 20px; text-align: center;">
//             <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
//         </div>
//         <div style="padding: 40px 30px;">
//             <p style="font-size: 16px; margin-bottom: 20px;">Dear User,</p>

//             <p style="font-size: 16px; margin-bottom: 30px;">We received a request to reset your password. Click the button below to reset your password:</p>

//             <div style="text-align: center; margin-bottom: 30px;">
//                 <a href=${resetPassLink} style="display: inline-block; background-color: #FF7600; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: 600; transition: background-color 0.3s ease;">
//                     Reset Password
//                 </a>
//             </div>

//             <p style="font-size: 16px; margin-bottom: 20px;">If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>

//             <p style="font-size: 16px; margin-bottom: 0;">Best regards,<br>Your Support Team</p>
//         </div>
//         <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #6c757d;">
//             <p style="margin: 0 0 10px;">This is an automated message, please do not reply to this email.</p>
//             <p style="margin: 0;">© 2023 Your Company Name. All rights reserved.</p>
//         </div>
//     </div>
// </body>
// </html>`
//   );
//   return {
//     message: "Reset password link sent via your email successfully",
//     resetPassLink,
//   };
// };

// reset password
// const resetPassword = async (
//   token: string,
//   payload: { email: string; password: string }
// ) => {
//   const userData = await prisma.user.findUnique({
//     where: {
//     email: payload.email,
//     },
//   });

//   if (!userData) {
//     throw new ApiError(404, "User not found");
//   }

//   const isValidToken = jwtHelpers.verifyToken(
//     token,
//     config.jwt.reset_pass_secret as Secret
//   );

//   if (!isValidToken) {
//     throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
//   }

//   // hash password
//   const password = await bcrypt.hash(payload.password, 12);

//   // update into database
//   await prisma.user.update({
//     where: {
//       email : payload.email,
//     },
//     data: {
//       password,
//     },
//   });
//   return { message: "Password reset successfully" };
// };

export const AuthServices = {
  createUser,
  loginUser,
  // enterOtp,
  // getMyProfile,
  // changePassword,
  // forgotPassword,
  // resetPassword,
};
