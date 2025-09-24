import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { PetRoute } from "../modules/pets/pets.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/pets",
    route: PetRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
