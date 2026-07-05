import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "./models/admin.model.js";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    const exists = await Admin.findOne({
      email: "admin@gmail.com",
    });

    if (exists) {
      console.log("Admin already exists.");
      process.exit();
    }

    await Admin.create({
      email: "admin@gmail.com",
      password: "Admin@123",
    });

    console.log("Admin created successfully.");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
