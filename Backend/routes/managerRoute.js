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

//Manager login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const query = "SELECT * FROM managers WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Manager not found" });
    }

    const manager = results[0];

    const isMatch = await bcrypt.compare(password, manager.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!manager.is_verified) {
      return res.status(403).json({ message: "Your account is not yet verified. A confirmation email will be sent once verified." });
    }

    const token = jwt.sign(
      { userId: manager.id, email: manager.email },
      jwtSecretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      manager: {
        id: manager.id,
        name: manager.name,
        email: manager.email,
        phone: manager.phone,
      },
    });
  });
});


module.exports = router;
