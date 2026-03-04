import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import attendeeRoutes from "./routes/attendeeRoute.js";
import passwordResetRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import managerRoutes from "./routes/managerRoute.js";

dotenv.config();

const app = express();

// Parse JSON data
app.use(express.json());

app.use(
  cors({
    origin: ["https://eventconnect1.netlify.app", "http://localhost:5173"],
    credentials: true,
  })
);

app.options("*", cors());

// Attendee routes
app.use("/attendees", attendeeRoutes);

// Forgot password routes
app.use("/", passwordResetRoutes);

// Admin routes
app.use("/admin", adminRoutes);

// Manager routes
app.use("/managers", managerRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});