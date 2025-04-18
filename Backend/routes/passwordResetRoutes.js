const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const db = require("../config/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// POST /forgot-password
const sgMail = require("@sendgrid/mail"); // Import SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Set SendGrid API key

router.post("/forgot-password", (req, res) => {
  const { email, userType } = req.body;

  if (userType !== "attendee") {
    return res
      .status(400)
      .json({
        message: "Only attendee password reset is supported at the moment.",
      });
  }

  // Check if attendee with the given email exists
  const query = "SELECT * FROM attendees WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendee found with this email" });
    }

    // Attendee exists — Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex"); // 32 bytes for a secure token
    const resetTokenExpiration = Date.now() + 3600000; // 1 hour expiration

    // Save the token and expiration in the database
    const updateQuery =
      "UPDATE attendees SET passwordResetToken = ?, passwordResetTokenExpiration = ? WHERE email = ?";
    db.query(updateQuery, [resetToken, resetTokenExpiration, email], (err) => {
      if (err) {
        console.error("Error updating token:", err);
        return res.status(500).json({ message: "Error saving reset token" });
      }

      // Generate reset URL with the token
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // Send the email with the reset link
      const msg = {
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL, // Use your verified sender email
        subject: "Password Reset Request",
        html: `<p>We received a request to reset your password. Click the link below to reset it:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link will expire in 1 hour.</p>`,
      };

      sgMail
        .send(msg)
        .then(() => {
          console.log("Password reset email sent");
          return res.status(200).json({ message: "Password reset email sent" });
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          return res.status(500).json({ message: "Error sending reset email" });
        });
    });
  });
});

//
router.post("/reset-password/:token", (req, res) => {
  const { token } = req.params; // Token from the URL
  const { newPassword } = req.body; // New password from the user

  // Validate the token in the database
  const query = "SELECT * FROM attendees WHERE passwordResetToken = ?";
  db.query(query, [token], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const attendee = results[0];

    // Check if the token has expired
    const currentTime = Date.now();
    if (attendee.passwordResetTokenExpiration < currentTime) {
      return res.status(400).json({ message: "Token has expired" });
    }

    // Proceed to update the password
    const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password
    const updateQuery =
      "UPDATE attendees SET password = ?, passwordResetToken = NULL, passwordResetTokenExpiration = NULL WHERE email = ?";

    db.query(updateQuery, [hashedPassword, attendee.email], (err) => {
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ message: "Error updating password" });
      }

      return res.status(200).json({ message: "Password updated successfully" });
    });
  });
});

module.exports = router;
