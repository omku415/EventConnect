const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../authenticateToken");
//for  cloud
const upload = require("../Cloudinary/upload");
const cloudinary = require("../Cloudinary/cloudinary");
require("dotenv").config(); // To load the environment variables

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Attendee Registration Route
router.post("/register", async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO attendees (name, phone, email, password) VALUES (?, ?, ?, ?)";
    db.query(query, [name, phone, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Registration failed" });
      }
      res.status(201).json({ message: "Attendee registered successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Attendee Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const query = "SELECT * FROM attendees WHERE email = ?";
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
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload: you can add other data if needed
      jwtSecretKey, // Your secret key to sign the token
      { expiresIn: "1h" } // Expiration time for the token
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // You can include a token or user data here for frontend usage
    res.status(200).json({
      message: "Login successful",
      token,
      attendee: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_image: user.profile_image,
      },
    });
  });
});

//update profile
router.post(
  "/update-profile/:id",
  authenticateToken,
  upload.single("profile_image"),
  (req, res) => {
    const attendeeId = req.params.id;
    const { name, phone } = req.body;

    // Check if the user has uploaded a new image
    const imageUrl = req.file ? req.file.path : null; // Cloudinary URL if image uploaded

    // Initialize an object to hold the fields to update
    let updatedFields = {};
    let queryParams = [];

    // Add fields to update only if they are provided
    if (name) {
      updatedFields.name = name;
    }
    if (phone) {
      updatedFields.phone = phone;
    }
    if (imageUrl) {
      updatedFields.profile_image = imageUrl;
    }

    // If no fields to update, return an error
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

    // Create the update query dynamically
    let updateQuery = "UPDATE attendees SET ";
    Object.keys(updatedFields).forEach((field, index) => {
      updateQuery += `${field} = ?`;
      queryParams.push(updatedFields[field]);

      if (index < Object.keys(updatedFields).length - 1) {
        updateQuery += ", ";
      }
    });

    updateQuery += " WHERE id = ?";
    queryParams.push(attendeeId); // Add attendeeId as the last parameter

    // Execute the query
    db.query(updateQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ error: "Something went wrong." });
      }

      res.status(200).json({
        message: "Profile updated successfully.",
        updatedData: {
          id: attendeeId,
          ...updatedFields,
        },
      });
    });
  }
);
// Route to fetch only approved events for attendees
router.get("/events/approved", authenticateToken, (req, res) => {
  const query = "SELECT * FROM events WHERE status = 'Approved'";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  });
});

router.post("/join-event", authenticateToken, (req, res) => {
  const attendeeId = req.user.userId;
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required" });
  }

  const query = `
    INSERT INTO event_attendees (event_id, attendee_id)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE joined_at = NOW()
  `;

  db.query(query, [eventId, attendeeId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json({ message: "Successfully joined the event" });
  });
});

module.exports = router;
