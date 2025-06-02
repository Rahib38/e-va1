import express from "express";

import { AuthRoutes } from "../modules/Auth/auth.routes";

import { productRoute } from "../modules/products/product.routes";
import { UserRoute } from "../modules/user/user.routes";
import { OderRoutes } from "../modules/orders/order.routes";
import { blogRoutes } from "../modules/blog/blog.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/blog",
    route: blogRoutes,
  },
  {
    path: "/orders",
    route: OderRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
