import express from "express";
const router = express.Router();

import { registerSchema } from "../validators/User.Schema.js";
import { validate } from "../middleware/yup.middleware.js";
import {
  register,
  verifyOTP,
  refreshAccessToken,
} from "../controllers/Auth.Controller.js";

router.post("/register", validate(registerSchema), register);
router.post("/verify", verifyOTP);
router.post("/refresh", refreshAccessToken);

export default router;
