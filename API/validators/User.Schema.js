import * as yup from "yup";

export const registerSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Invalid email format")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email structure")
      .optional(),

    phone: yup
      .string()
      .trim()
      .matches(/^[6-9]\d{9}$/, "Invalid Indian phone number")
      .test(
        "no-repeated-digits",
        "Phone number looks invalid",
        (value) => !value || !/(.)\1{6,}/.test(value)
      )
      .optional(),

    country: yup
      .string()
      .length(2, "Invalid country code")
      .uppercase()
      .when("phone", {
        is: (phone) => !!phone,
        then: (schema) => schema.required("Country is required"),
      }),

    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/\d/, "Must contain at least one number")
      .matches(/[@$!%*?&]/, "Must contain at least one special character"),
  })
  .test("email-or-phone", "Either email or phone is required", (value) =>
    Boolean(value.email || value.phone)
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
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .when("phone", {
      is: (val) => !val || val.length === 0,
      then: yup.string().required("Email or phone is required"),
      otherwise: yup.string().notRequired(),
    }),
  phone: yup.string().when("email", {
    is: (val) => !val || val.length === 0,
    then: yup.string().required("Phone or email is required"),
    otherwise: yup.string().notRequired(),
  }),
  country: yup.string().when("phone", {
    is: (val) => val && val.length > 0,
    then: yup.string().required("Country code is required for phone login"),
    otherwise: yup.string().notRequired(),
  }),
  password: yup.string().required("Password is required"),
});

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
export const forgotPasswordSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().notRequired(),
  country: yup.string().when("phone", {
    is: (val) => val && val.length > 0,
    then: yup.string().required("Country code required when using phone"),
    otherwise: yup.string().notRequired(),
  }),
});

/* ======================================
   RESET PASSWORD SCHEMA (AFTER OTP)
====================================== */
export const resetPasswordSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email")
    .when("phone", {
      is: (val) => !val || val.length === 0,
      then: yup.string().required("Email or phone is required"),
      otherwise: yup.string().notRequired(),
    }),
  phone: yup.string().when("email", {
    is: (val) => !val || val.length === 0,
    then: yup.string().required("Phone or email is required"),
    otherwise: yup.string().notRequired(),
  }),
  country: yup.string().when("phone", {
    is: (val) => val && val.length > 0,
    then: yup.string().required("Country code is required for phone"),
    otherwise: yup.string().notRequired(),
  }),
  otp: yup.string().required("OTP is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm new password is required"),
});
