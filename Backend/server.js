require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes"); 
const app = express();

app.use(express.json());
const db = require("./config/db");
app.use(cors());

app.use("/users", userRoutes);

// Sample route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
