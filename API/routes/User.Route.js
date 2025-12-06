import express from "express";
const router = express.Router();

import { registerSchema } from "../validators/User.Schema.js";
import { validate } from "../middleware/yup.middleware.js";
import { register, verifyOTP } from "../controllers/Auth.Controller.js";

router.post("/register", validate(registerSchema), register);

export default router;
