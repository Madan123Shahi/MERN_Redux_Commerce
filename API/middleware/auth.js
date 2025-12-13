// import jwt from "jsonwebtoken";
// import User from "../models/User.Model.js";

// export const userAuth = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   //   if (!authHeader?.startsWith("Bearer")) {
//   //     return res.status(400).json("Missing Token");
//   //   }
//   //   const token = authHeader.split(" ")[1];

//   // or recommended one
//   if (!authHeader) {
//     return res.status(401).json({ message: "Missing Token" });
//   }

//   const parts = authHeader.split(" ");
//   if (parts[0] !== "Bearer" || !parts[1]) {
//     return res.status(401).json({ message: "Invalid Authorization Format" });
//   }
//   const token = parts[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     console.log(payload);
//     const user = await User.findById(payload.sub);
//     if (!user) return res.status(401).json({ message: "Invalid Token" });
//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: error.message });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/User.Model.js";

export const protect = async (req, res, next) => {
  let token;

  // 1️⃣ Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user to request
    req.user = await User.findById(decoded.sub).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
