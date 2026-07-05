import "dotenv/config";
import connectDB from "../config/db.js";
import app from "../app.js";
// Initialize Database Connection
connectDB();
export default app;
