require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
//It converts parse the JSON data and populate req.body with the JavaScript object:
app.use(express.json());

const db = require("./config/db");

app.use(cors());

//attendee routes
const attendeeRoutes = require("./routes/attendeeRoute");
app.use("/attendees", attendeeRoutes);

//forgot password routes
const passwordResetRoutes = require("./routes/passwordResetRoutes");
app.use("/", passwordResetRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
