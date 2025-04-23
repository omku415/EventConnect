const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const uploadResume = require("../Cloudinary/uploadResume"); 
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Manager Registration Route
router.post("/register", uploadResume.single("resume"), async (req, res) => {
  const { name, phone, email, password, confirmPassword } = req.body;

  if (!name || !phone || !email || !password || !confirmPassword || !req.file) {
    return res.status(400).json({ message: "Please fill all fields and upload resume" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const resumeUrl = req.file.path;

    const insertQuery = `
      INSERT INTO managers (name, phone, email, password, resume_url, is_verified)
      VALUES (?, ?, ?, ?, ?, false)
    `;

    db.query(insertQuery, [name, phone, email, hashedPassword, resumeUrl], (err, result) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ message: "Manager registration failed" });
      }

      res.status(201).json({ message: "Registration successful. Awaiting admin approval." });
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
