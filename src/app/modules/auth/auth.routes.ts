import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidation.authLoginSchema),
  authController.loginUser,
);
router.post(
  "/google-login",
  validateRequest(authValidation.googleLoginSchema),
  // authController.googleLogin,
);
// with authorization
router.get("/profile", auth(), authController.myProfile);
//  without authorization
// router.get("/profile", authController.myProfile);
router.patch(
  "/update/user-location",
  auth(),
  validateRequest(authValidation.locationUpdateSchema),
  authController.userLocationUpdateInRedis,
);
router.post(
  "/send-otp",
  validateRequest(authValidation.sendForgotPasswordOtpValidationSchema),
  authController.sendForgotPasswordOtp,
);
router.post("/verify-otp", authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", auth(), authController.resetPassword);
router.patch(
  "/profile",
  auth(),
  fileUploader.profileImage,
  parseBodyData,
  authController.updateProfile,
);

export const authRoute = router;
