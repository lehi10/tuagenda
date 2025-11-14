/**
 * User Validation Schemas
 *
 * Zod schemas for validating user data throughout the application.
 * These schemas provide both runtime validation and TypeScript type inference.
 */

import { z } from "zod";

/**
 * Schema for creating a new user in the database
 *
 * This schema validates all required fields when creating a user after
 * Firebase authentication. The user type defaults to 'customer' for new signups.
 */
export const createUserSchema = z.object({
  // Firebase UID - required and must be a non-empty string
  id: z.string().min(1, "User ID is required"),

  // Email - must be valid email format and unique in the database
  email: z.string().email("Invalid email format"),

  // First and last name - required for all users
  firstName: z.string().min(1, "First name is required").max(255),
  lastName: z.string().min(1, "Last name is required").max(255),

  // Optional fields
  phone: z.string().max(63).nullable().optional(),
  countryCode: z.string().max(10).nullable().optional(),
  birthday: z.date().nullable().optional(),
  note: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  pictureFullPath: z.string().max(767).nullable().optional(),
  timeZone: z.string().max(255).nullable().optional(),

  // Status and type have defaults in the database schema
  // but can be explicitly set if needed
  status: z.enum(["hidden", "visible", "disabled", "blocked"]).optional(),
  type: z.enum(["customer", "provider", "manager", "admin"]).optional(),
});

/**
 * Schema for creating a user from Firebase Auth data
 *
 * This is a simplified version used specifically for signup flows.
 * It only requires the essential data available during authentication.
 */
export const createUserFromAuthSchema = z.object({
  id: z.string().min(1, "Firebase UID is required"),
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  pictureFullPath: z.string().url().nullable().optional(),
});

/**
 * Schema for updating user profile personal information
 */
export const updateProfilePersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(255),
  lastName: z.string().min(1, "Last name is required").max(255),
  birthday: z.date().nullable().optional(),
  countryCode: z.string().max(10).nullable().optional(),
  phone: z
    .string()
    .regex(/^\d{9}$/, "Phone must be exactly 9 digits")
    .nullable()
    .optional()
    .or(z.literal("")),
  timeZone: z.string().max(255).nullable().optional(),
});

/**
 * Schema for changing password
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Type inference from the schemas
 * Use these types throughout your application for type safety
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateUserFromAuthInput = z.infer<typeof createUserFromAuthSchema>;
export type UpdateProfilePersonalInfoInput = z.infer<
  typeof updateProfilePersonalInfoSchema
>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
