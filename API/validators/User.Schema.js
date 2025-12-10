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
