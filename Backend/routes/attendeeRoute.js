const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");
//for  cloud
const upload = require("../utils/cloudinary/upload");
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
    await db.query(query, [name, phone, email, hashedPassword]);

    res.status(201).json({ message: "Attendee registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Attendee Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const query = "SELECT * FROM attendees WHERE email = ?";
    const [results] = await db.query(query, [email]);

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
      attendee: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_image: user.profile_image,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//update profile
router.post(
  "/update-profile/:id",
  authenticateToken,
  upload.single("profile_image"),
  async (req, res) => {
    const attendeeId = req.params.id;
    const { name, phone } = req.body;

    // Check if the user has uploaded a new image
    const imageUrl = req.file ? req.file.path : null;

    // Initialize an object to hold the fields to update
    let updatedFields = {};
    let queryParams = [];

    // Add fields to update only if they are provided
    if (name) updatedFields.name = name;
    if (phone) updatedFields.phone = phone;
    if (imageUrl) updatedFields.profile_image = imageUrl;

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
    queryParams.push(attendeeId);

    try {
      await db.query(updateQuery, queryParams);

      res.status(200).json({
        message: "Profile updated successfully.",
        updatedData: {
          id: attendeeId,
          ...updatedFields,
        },
      });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
);

// Route to fetch only approved events for attendees
router.get("/events/approved", authenticateToken, async (req, res) => {
  const query = "SELECT * FROM events WHERE status = 'Approved'";

  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/join-event", authenticateToken, async (req, res) => {
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

  try {
    await db.query(query, [eventId, attendeeId]);
    res.status(200).json({ message: "Successfully joined the event" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/events/joined", authenticateToken, async (req, res) => {
  const attendeeId = req.user.userId;

  const query = `
    SELECT events.*
    FROM events
    JOIN event_attendees ON events.id = event_attendees.event_id
    WHERE event_attendees.attendee_id = ?
  `;

  try {
    const [results] = await db.query(query, [attendeeId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching joined events:", err);
    res.status(500).json({ message: "Failed to fetch joined events" });
  }
});

router.post("/feedback", authenticateToken, async (req, res) => {
  const attendeeId = req.user.userId; 
  const { rating, text, eventId } = req.body;

  if (!eventId || !rating) {
    return res
      .status(400)
      .json({ message: "Event ID and rating are required" });
  }

  const query = `
    INSERT INTO feedback (event_id, attendee_id, rating, text)
    VALUES (?, ?, ?, ?)
  `;

  try {
    await db.query(query, [eventId, attendeeId, rating, text]);
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
