import { Router } from "express";
import authController from "./auth.controller";
import validate from "../../middlewares/validation.middleware";
import authValidator from "./auth.validation";

const router = Router();

// Auth Routes
router.post(
  "/register",
  validate(authValidator.registerValidation),
  authController.register
);

router.post(
  "/verify-email",
  validate(authValidator.verificationValidation),
  authController.verifyEmail
);

router.post(
  "/login",
  validate(authValidator.loginValidation),
  authController.login
);

router.post(
  "/forgot-password",
  validate(authValidator.forgotPasswordValidation),
  authController.forgotPassword
);

router.post(
  "/reset-password",
  validate(authValidator.resetPasswordValidation),
  authController.resetPassword
);

router.post(
  "/resend-verification",
  validate(authValidator.resendVerificationValidation),
  authController.resendVerification
);

router.delete("/delete/:userId", authController.deleteUser);

router.post("/logout", authController.logout);

export default router;
