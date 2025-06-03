import { Router } from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { orderController } from "./order.controller";

const router = Router();

router.post("/create-order",auth(UserRole.USER, UserRole.ADMIN),orderController.createProduct)

export const orderRoutes = router;