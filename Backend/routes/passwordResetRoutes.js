const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const sendPasswordResetEmail = require("../sendEmail/sendForgotPassword"); 

const frontendUrl = process.env.APP_URL || process.env.FRONTEND_URL;

// POST /forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email, userType } = req.body;

  let tableName;
  if (userType === "attendee") {
    tableName = "attendees";
  } else if (userType === "manager") {
    tableName = "managers";
  } else {
    return res.status(400).json({ message: "Invalid user type." });
  }

  try {
    // Check if the user exists in the selected table
    const query = `SELECT * FROM ${tableName} WHERE email = ?`;
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: `No ${userType} found with this email` });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour

    const updateQuery = `
      UPDATE ${tableName}
      SET passwordResetToken = ?, passwordResetTokenExpiration = ?
      WHERE email = ?
    `;
    await db.query(updateQuery, [resetToken, resetTokenExpiration, email]);

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(email, resetUrl); 
      return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Email sending error:", error);
      return res.status(500).json({ message: "Error sending reset email" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// POST /reset-password/:token
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Helper to check a table for the token
    const checkTableForToken = async (tableName) => {
      const query = `SELECT * FROM ${tableName} WHERE passwordResetToken = ?`;
      const [results] = await db.query(query, [token]);
      if (results.length === 0) return null;
      return { tableName, user: results[0] };
    };

    // Check attendees first
    let result = await checkTableForToken("attendees");

    // If not found, check managers
    if (!result) {
      result = await checkTableForToken("managers");
    }

    if (!result) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { tableName, user } = result;
    const currentTime = Date.now();

    if (user.passwordResetTokenExpiration < currentTime) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateQuery = `
      UPDATE ${tableName}
      SET password = ?, passwordResetToken = NULL, passwordResetTokenExpiration = NULL
      WHERE email = ?
    `;
    await db.query(updateQuery, [hashedPassword, user.email]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
