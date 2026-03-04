import crypto from "crypto";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { sendPasswordResetEmail } from "../utils/email/sendPasswordReset.js";

dotenv.config();

const frontendUrl = process.env.APP_URL || process.env.FRONTEND_URL;



// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email, userType } = req.body;

    let tableName;

    if (userType === "attendee") {
      tableName = "attendees";
    } else if (userType === "manager") {
      tableName = "managers";
    } else {
      return res.status(400).json({ message: "Invalid user type." });
    }

    const query = `SELECT * FROM ${tableName} WHERE email = ?`;
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res.status(404).json({
        message: `No ${userType} found with this email`,
      });
    }

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

      res.status(200).json({
        message: "Password reset email sent",
      });
    } catch (error) {
      console.error("Email sending error:", error);
      res.status(500).json({
        message: "Error sending reset email",
      });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const checkTableForToken = async (tableName) => {
      const query = `SELECT * FROM ${tableName} WHERE passwordResetToken = ?`;
      const [results] = await db.query(query, [token]);

      if (results.length === 0) return null;

      return { tableName, user: results[0] };
    };

    let result = await checkTableForToken("attendees");

    if (!result) {
      result = await checkTableForToken("managers");
    }

    if (!result) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const { tableName, user } = result;
    const currentTime = Date.now();

    if (user.passwordResetTokenExpiration < currentTime) {
      return res.status(400).json({
        message: "Token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateQuery = `
      UPDATE ${tableName}
      SET password = ?, passwordResetToken = NULL, passwordResetTokenExpiration = NULL
      WHERE email = ?
    `;

    await db.query(updateQuery, [hashedPassword, user.email]);

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};