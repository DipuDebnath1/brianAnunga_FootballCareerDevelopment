import Joi from "joi";
import { roles } from "../../config/roles";

const registerValidation = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/[a-zA-Z]/)
    .pattern(/\d/)
    .required(),
  role: Joi.string()
    .required()
    .valid(...roles),
});

const verificationValidation = Joi.object({
  code: Joi.number().required(),
  email: Joi.string().email().required(),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  fcmToken: Joi.string().optional(),
});

const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordValidation = Joi.object({
  code: Joi.string().length(6).required(),
  email: Joi.string().email().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/[a-zA-Z]/)
    .pattern(/\d/)
    .required(),
});

const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/[a-zA-Z]/)
    .pattern(/\d/)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Confirm password must match new password" }),
});

const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required(),
});

const resendVerificationValidation = Joi.object({
  email: Joi.string().email().required(),
});

const authValidator = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  refreshTokenValidation,
  resendVerificationValidation,
  verificationValidation,
};

export default authValidator;
