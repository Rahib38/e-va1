import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.routes";
import { ProductRoutes } from "../modules/product/product.routes";
import { orderRoutes } from "../modules/Orders/order.routes";



const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  // {
  //   path: "/user",
  //   route: UserRoute,
  // },
  {
    path: "/product",
    route: ProductRoutes,
  },
  // {
  //   path: "/blog",
  //   route: blogRoutes,
  // },
  {
    path: "/orders",
    route: orderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
