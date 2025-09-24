//
import { z } from "zod";
const fileSchema = z
  .object({
    originalname: z.string(),
    mimetype: z.string(),
    size: z.number(),
    buffer: z.instanceof(Buffer).optional(),
  })
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype),
    "Only JPG, JPEG, or PNG files are allowed",
  )
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB",
  );
const userRegisterValidationSchema = z.object({
  firstName: z.string().min(2, "Full name must be at least 2 characters long"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  nationality: z.string(),
  fcmToken: z.string().optional(),
});

const verificationSchema = z.object({
  email: z.string().min(10, "Phone Number min 10 Digit"),
  otp: z.string().min(4, "OTP must be at least 4 characters long"),
});

const userUpdateValidationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .optional(),
  nationality: z.string().optional(),
  phoneNumber: z.string().optional(),
});

const userCreateValidationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export const userValidation = {
  userRegisterValidationSchema,
  verificationSchema,
  userUpdateValidationSchema,
  userCreateValidationSchema,
};
