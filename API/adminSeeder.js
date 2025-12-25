import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.Model.js";

dotenv.config();

const adminSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const admin_email_1 = process.env.ADMIN1_EMAIL;
    const admin_email_2 = process.env.ADMIN2_EMAIL;
    const admin_password_1 = process.env.ADMIN1_PASSWORD;
    const admin_password_2 = process.env.ADMIN2_PASSWORD;

    // Validate env variables
    if (
      !admin_email_1 ||
      !admin_email_2 ||
      !admin_password_1 ||
      !admin_password_2
    ) {
      throw new Error(`Admin Email or Admin Password is missing in .env file`);
    }

    // Check if first admin exists
    const existingAdmin1 = await User.findOne({ email: admin_email_1 });
    if (!existingAdmin1) {
      await User.create({
        name: "Admin One",
        email: admin_email_1,
        password: admin_password_1,
        role: "admin",
      });
      console.log(`🎉 Admin created: ${admin_email_1}`);
    } else {
      console.log(`✅ Admin already exists: ${admin_email_1}`);
    }

    // Check if second admin exists
    const existingAdmin2 = await User.findOne({ email: admin_email_2 });
    if (!existingAdmin2) {
      await User.create({
        name: "Admin Two",
        email: admin_email_2,
        password: admin_password_2,
        role: "admin",
      });
      console.log(`🎉 Admin created: ${admin_email_2}`);
    } else {
      console.log(`✅ Admin already exists: ${admin_email_2}`);
    }

    console.log("✅ Admin seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Admin seeding failed:", error.message);
    process.exit(1);
  }
};

// 👇 ADD THIS LINE to execute the function
adminSeeder();
