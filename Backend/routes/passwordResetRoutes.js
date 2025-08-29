const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const sendPasswordResetEmail = require("../sendEmail/sendForgotPassword"); // Nodemailer version

const frontendUrl = process.env.APP_URL || process.env.FRONTEND_URL;
// POST /forgot-password
router.post("/forgot-password", (req, res) => {
  const { email, userType } = req.body;

  let tableName;
  if (userType === "attendee") {
    tableName = "attendees";
  } else if (userType === "manager") {
    tableName = "managers";
  } else {
    return res.status(400).json({ message: "Invalid user type." });
  }

  // Check if the user exists in the selected table
  const query = `SELECT * FROM ${tableName} WHERE email = ?`;
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

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

    db.query(
      updateQuery,
      [resetToken, resetTokenExpiration, email],
      async (err) => {
        if (err) {
          console.error("Error updating token:", err);
          return res.status(500).json({ message: "Error saving reset token" });
        }

        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        try {
          await sendPasswordResetEmail(email, resetUrl); // Nodemailer handles sending
          return res.status(200).json({ message: "Password reset email sent" });
        } catch (error) {
          console.error("Email sending error:", error);
          return res.status(500).json({ message: "Error sending reset email" });
        }
      }
    );
  });
});

// POST /reset-password/:token
router.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Check a table for the token
  const checkTableForToken = (tableName, callback) => {
    const query = `SELECT * FROM ${tableName} WHERE passwordResetToken = ?`;
    db.query(query, [token], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      return callback(null, { tableName, user: results[0] });
    });
  };

  // First check attendees, then managers
  checkTableForToken("attendees", (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (result) return handlePasswordReset(result);

    checkTableForToken("managers", (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!result) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      return handlePasswordReset(result);
    });
  });

  function handlePasswordReset({ tableName, user }) {
    const currentTime = Date.now();
    if (user.passwordResetTokenExpiration < currentTime) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updateQuery = `
      UPDATE ${tableName}
      SET password = ?, passwordResetToken = NULL, passwordResetTokenExpiration = NULL
      WHERE email = ?
    `;

    db.query(updateQuery, [hashedPassword, user.email], (err) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Error updating password" });
      }

      return res.status(200).json({ message: "Password updated successfully" });
    });
  }
});

module.exports = router;
