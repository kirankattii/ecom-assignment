import "dotenv/config";

// Validate required environment variables
const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error("❌ Critical: Missing required environment variables:");
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`);
  });
  process.exit(1);
}

import app from "./app.js";
import connectDB from "./config/db.js";

// Database Connection
connectDB();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});


