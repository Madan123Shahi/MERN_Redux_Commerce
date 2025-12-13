import express from "express";
const router = express.Router();

import {
  registerSchema,
  loginAdminSchema,
  registerAdminSchema,
} from "../validators/User.Schema.js";
import { validate } from "../middleware/yup.middleware.js";
import {
  register,
  verifyOTP,
  refreshAccessToken,
  loginAdmin,
  registerAdmin,
} from "../controllers/Auth.Controller.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.middleware.js";

router.post("/register", validate(registerSchema), register);
router.post("/verify", verifyOTP);
router.post("/refresh", refreshAccessToken);
router.post(
  "/loginAdmin",
  validate(loginAdminSchema),
  protect(adminOnly),
  loginAdmin
);
router.post("/registerAdmin", validate(registerAdminSchema), registerAdmin);

export default router;
