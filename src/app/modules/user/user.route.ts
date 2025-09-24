import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// create user with otp email verification
router.post(
  "/create",
  validateRequest(userValidation.userRegisterValidationSchema),
  UserControllers.createUser,
);

// create user without otp email verification
router.post(
  "/create-user",
  validateRequest(userValidation.userCreateValidationSchema),
  UserControllers.CreateUser,
);
router.post(
  "/signup-verification",
  validateRequest(userValidation.verificationSchema),
  UserControllers.signupVerification,
);

// router.get("/", auth(UserRole.Admin), UserControllers.getUsers);
router.get("/", auth(), UserControllers.getUsers);
router.get("/:id", auth(), UserControllers.getSingleUser);
// update role and user status (active, block, deleted)
router.patch(
  "/admin-update",
  validateRequest(userValidation.userUpdateValidationSchema),
  auth(UserRole.Admin),
  UserControllers.updateUser,
);

router.patch(
  "/:id",
  validateRequest(userValidation.userUpdateValidationSchema),
  // auth(UserRole.Admin),
  UserControllers.updateUser,
);
router.delete("/:id", auth(UserRole.Admin), UserControllers.deleteUser);
// Route
export const userRoutes = router;
