import { Router } from "express";
import { productController } from "./product.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/create",auth(UserRole.ADMIN),productController.createProduct)

export const ProductRoutes = router;