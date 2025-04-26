require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const db = require("../config/db");
const router = express.Router();
const sendVerificationEmail = require("../sendEmail/sendVerificationEmail");
const authenticateToken = require('../authenticateToken');
const sendRejectionEmail=require("../sendEmail/sendRejectionEmail")

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const query = "SELECT * FROM admin WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecretKey,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: user.id,
        email: user.email,
      },
    });
  });
});

router.get("/pending-managers",authenticateToken, (req, res) => {
  // Query to fetch managers who are pending approval (isVerified = false)
  const query = "SELECT * FROM managers WHERE is_verified = false";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching pending managers:", err);
      return res
        .status(500)
        .json({ message: "Error fetching pending managers." });
    }
    const formattedManagers = results.map((manager) => ({
      id: manager.id,
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      resumeUrl: manager.resume_url, // make sure this matches your DB column
    }));
    // Send the result as response
    res.status(200).json(formattedManagers);
  });
});

// Approve Manager Route
router.post("/approve-manager/:managerId", (req, res) => {
  const managerId = req.params.managerId;

  // Step 1: Update the manager's is_verified status
  const updateQuery = "UPDATE managers SET is_verified = true WHERE id = ?";
  db.query(updateQuery, [managerId], (updateErr, updateResult) => {
    if (updateErr) {
      console.error("Error updating manager:", updateErr);
      return res
        .status(500)
        .json({ message: "Failed to update manager verification status" });
    }

    
    // Step 2: Fetch the manager's email
    const selectQuery = "SELECT email FROM managers WHERE id = ?";
    db.query(selectQuery, [managerId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error fetching manager email:", selectErr);
        return res
          .status(500)
          .json({ message: "Failed to retrieve manager email" });
      }

      if (selectResult.length === 0) {
        return res.status(404).json({ message: "Manager not found" });
      }

      const managerEmail = selectResult[0].email;

      // Step 3: Send the verification email
      sendVerificationEmail(managerEmail);

      res.status(200).json({ message: "Manager approved and email sent." });
    });
  });
});


router.post("/reject-manager/:managerId", (req, res) => {
  const managerId = req.params.managerId;

  // Step 1: Optionally mark the manager as rejected (e.g., is_verified = false or is_rejected = true)
  const updateQuery = "UPDATE managers SET is_verified = false WHERE id = ?";
  db.query(updateQuery, [managerId], (updateErr, updateResult) => {
    if (updateErr) {
      console.error("Error updating manager:", updateErr);
      return res
        .status(500)
        .json({ message: "Failed to update manager status" });
    }

    // Step 2: Fetch the manager's email
    const selectQuery = "SELECT email FROM managers WHERE id = ?";
    db.query(selectQuery, [managerId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error fetching manager email:", selectErr);
        return res
          .status(500)
          .json({ message: "Failed to retrieve manager email" });
      }

      if (selectResult.length === 0) {
        return res.status(404).json({ message: "Manager not found" });
      }

      const managerEmail = selectResult[0].email;

      sendRejectionEmail(managerEmail);

      res.status(200).json({ message: "Manager rejected and email sent." });
    });
  });
});
router.get("/verify-events", authenticateToken, (req, res) => {
  const query = "SELECT * FROM events ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Failed to fetch events." });
    }

    res.status(200).json({ events: results });
  });
});


module.exports = router;
