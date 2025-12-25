import * as yup from "yup";

const strongPassword = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/[a-z]/, "Must contain at least one lowercase letter")
  .matches(/\d/, "Must contain at least one number")
  .matches(/[@$!%*?&]/, "Must contain at least one special character");

export const registerSchema = yup
  .object({
    email: yup.string().trim().lowercase().email("Invalid email").nullable(),
    phone: yup
      .string()
      .trim()
      .matches(/^[6-9]\d{9}$/, "Invalid Indian phone number")
      .nullable(),
    country: yup.string().length(2).uppercase().nullable(),
    password: strongPassword,
  })
  .test(
    "email-or-phone",
    "Either email or phone is required",
    (v) => !!(v.email || v.phone)
  )
  .test(
    "country-required-for-phone",
    "Country is required when using phone",
    (v) => !v.phone || !!v.country
  );

export const loginAdminSchema = yup.object({
  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email structure")
    .required("Email is required"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character"),
});

export const registerAdminSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .lowercase()
    .email("Invalid email format")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email structure")
    .optional(),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character"),
});

/* ======================================
   LOGIN SCHEMA (EMAIL OR PHONE)
====================================== */
export const loginSchema = yup
  .object({
    email: yup.string().email("Invalid email").nullable(),
    phone: yup.string().nullable(),
    country: yup.string().nullable(),
    password: yup.string().required("Password is required"),
  })
  .test(
    "email-or-phone",
    "Email or phone is required",
    (v) => !!(v.email || v.phone)
  )
  .test(
    "country-required-for-phone",
    "Country code is required for phone login",
    (v) => !v.phone || !!v.country
  );

/* ======================================
   CHANGE PASSWORD SCHEMA (LOGGED-IN USER)
====================================== */
export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});

/* ======================================
   FORGOT PASSWORD SCHEMA
====================================== */
export const forgotPasswordSchema = yup
  .object({
    email: yup.string().email("Invalid email").nullable(),
    phone: yup.string().nullable(),
    country: yup.string().nullable(),
  })
  .test(
    "email-or-phone",
    "Email or phone is required",
    (v) => !!(v.email || v.phone)
  )
  .test(
    "country-required-for-phone",
    "Country is required when using phone",
    (v) => !v.phone || !!v.country
  );

/* ======================================
   RESET PASSWORD SCHEMA (AFTER OTP)
====================================== */
export const resetPasswordSchema = yup
  .object({
    email: yup.string().email("Invalid email").nullable(),
    phone: yup.string().nullable(),
    country: yup.string().nullable(),
    otp: yup.string().required("OTP is required"),
    newPassword: yup.string().min(6).required("New password is required"),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Confirm new password is required"),
  })
  .test(
    "email-or-phone",
    "Email or phone is required",
    (v) => !!(v.email || v.phone)
  )
  .test(
    "country-required-for-phone",
    "Country is required for phone",
    (v) => !v.phone || !!v.country
  );
