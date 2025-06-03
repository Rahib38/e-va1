import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post("/create-payment-intent",auth(UserRole.ADMIN, UserRole.USER),PaymentController.createPayment)

export const paymentRoutes = router;