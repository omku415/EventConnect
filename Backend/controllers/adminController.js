import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import db from "../config/db.js";

import { sendVerificationEmail } from "../utils/email/sendVerificationEmail.js";
import { sendRejectionEmail } from "../utils/email/sendRejectionEmail.js";

import {
  sendEventApprovalEmail,
  sendEventRejectionEmail,
} from "../utils/email/sendEventEmail.js";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

//LOGIN 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const [results] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

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
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//PENDING MANAGER
export const pendingManager= async (req, res) => {
  try {
    const query = "SELECT * FROM managers WHERE is_verified = false";

    const [results] = await db.query(query);

    const formattedManagers = results.map((manager) => ({
      id: manager.id,
      name: manager.name,
      email: manager.email,
      phone: manager.phone,
      resumeUrl: manager.resume_url, // keep same as original
    }));

    res.status(200).json(formattedManagers);
  } catch (err) {
    console.error("Error fetching pending managers:", err);
    res.status(500).json({ message: "Error fetching pending managers." });
  }
};

// APPROVE MANAGER
export const approveManager = async (req, res) => {
  try {
    const { managerId } = req.params;

    const updateQuery = "UPDATE managers SET is_verified = true WHERE id = ?";
    await db.query(updateQuery, [managerId]);

    const selectQuery = "SELECT email FROM managers WHERE id = ?";
    const [selectResult] = await db.query(selectQuery, [managerId]);

    if (selectResult.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerEmail = selectResult[0].email;

    sendVerificationEmail(managerEmail);

    res.status(200).json({ message: "Manager approved and email sent." });

  } catch (err) {
    console.error("Error approving manager:", err);
    res.status(500).json({
      message: "Failed to update manager verification status",
    });
  }
};


// REJECT MANAGER
export const rejectManager = async (req, res) => {
  try {
    const { managerId } = req.params;

    const updateQuery = "UPDATE managers SET is_verified = false WHERE id = ?";
    await db.query(updateQuery, [managerId]);

    const selectQuery = "SELECT email FROM managers WHERE id = ?";
    const [selectResult] = await db.query(selectQuery, [managerId]);

    if (selectResult.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerEmail = selectResult[0].email;

    sendRejectionEmail(managerEmail);

    res.status(200).json({ message: "Manager rejected and email sent." });

  } catch (err) {
    console.error("Error rejecting manager:", err);
    res.status(500).json({ message: "Failed to update manager status" });
  }
};


// GET EVENTS FOR VERIFICATION
export const verifyEvents = async (req, res) => {
  try {
    const query =
      "SELECT * FROM events WHERE status = 'Pending' ORDER BY created_at DESC";

    const [results] = await db.query(query);

    res.status(200).json({ events: results });

  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};


// UPDATE EVENT STATUS
export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const [result] = await db.query(
      "SELECT manager_id FROM events WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const managerId = result[0].manager_id;

    const [managerResult] = await db.query(
      "SELECT email FROM managers WHERE id = ?",
      [managerId]
    );

    if (managerResult.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerEmail = managerResult[0].email;

    const [updateResult] = await db.query(
      "UPDATE events SET status = ? WHERE id = ?",
      [status, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (status === "Approved") {
      await sendEventApprovalEmail(managerEmail);
    } else {
      await sendEventRejectionEmail(managerEmail);
    }

    res.status(200).json({
      message: `Event ${status.toLowerCase()} successfully`,
    });

  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({
      message: "Error processing request",
    });
  }
};


// GET ALL ATTENDEES
export const getAllAttendees = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, email FROM attendees"
    );

    res.status(200).json(results);

  } catch (err) {
    console.error("Error fetching attendees:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};


// GET ALL MANAGERS
export const getAllManagers = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, name, email FROM managers"
    );

    res.status(200).json(results);

  } catch (err) {
    console.error("Error fetching managers:", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};


// DELETE ATTENDEE
export const deleteAttendee = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM attendees WHERE id = ?", [id]);

    res.status(200).json({
      message: "Attendee deleted",
    });

  } catch (err) {
    console.error("Error deleting attendee:", err);
    res.status(500).json({
      error: "Server error",
    });
  }
};


// DELETE MANAGER
export const deleteManager = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM managers WHERE id = ?", [id]);

    res.status(200).json({
      message: "Manager deleted",
    });

  } catch (err) {
    console.error("Error deleting manager:", err);
    res.status(500).json({
      error: "Server error",
    });
  }
};


// ADMIN DASHBOARD STATS
export const getAdminStats = async (req, res) => {
  try {

    const [totalManagersResult] = await db.query(
      "SELECT COUNT(*) AS totalManagers FROM managers"
    );

    const [pendingManagersResult] = await db.query(
      "SELECT COUNT(*) AS pendingManagers FROM managers WHERE is_verified = false"
    );

    const [totalEventsResult] = await db.query(
      "SELECT COUNT(*) AS totalEvents FROM events"
    );

    const [pendingEventsResult] = await db.query(
      "SELECT COUNT(*) AS pendingEvents FROM events WHERE status = 'Pending'"
    );

    const [totalUsersResult] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM attendees"
    );

    res.status(200).json({
      totalManagers: totalManagersResult[0].totalManagers,
      pendingManagers: pendingManagersResult[0].pendingManagers,
      totalEvents: totalEventsResult[0].totalEvents,
      pendingEvents: pendingEventsResult[0].pendingEvents,
      totalUsers: totalUsersResult[0].totalUsers,
    });

  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({
      message: "Failed to fetch admin stats",
    });
  }
};