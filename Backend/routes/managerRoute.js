const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const uploadResume = require("../utils/cloudinary/uploadResume");
const uploadEvents = require("../utils/cloudinary/uploadEvents");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authenticateToken");
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;


router.post("/register", uploadResume.single("resume"), async (req, res) => {
  const { name, phone, email, password, confirmPassword } = req.body;

  if (!name || !phone || !email || !password || !confirmPassword || !req.file) {
    return res
      .status(400)
      .json({ message: "Please fill all fields and upload resume" });
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

    try {
      await db.query(insertQuery, [name, phone, email, hashedPassword, resumeUrl]);
      res.status(201).json({
        message: "Registration successful. Awaiting admin approval.",
      });
    } catch (err) {
      console.error("DB error:", err);
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Manager registration failed" });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//Manager login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const query = "SELECT * FROM managers WHERE email = ?";
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: "Manager not found" });
    }

    const manager = results[0];
    const isMatch = await bcrypt.compare(password, manager.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!manager.is_verified) {
      return res.status(403).json({
        message:
          "Your account is not yet verified. A confirmation email will be sent once verified.",
      });
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
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post(
  "/create-events",
  authenticateToken,
  uploadEvents.single("image"),
  async (req, res) => {
    const {
      event_name,
      start_date,
      end_date,
      description,
      type,
      status,
      manager_id,
    } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    const eventFields = {
      event_name,
      start_date,
      end_date,
      description,
      type,
      status,
      image: imageUrl,
      manager_id,
    };

    const insertQuery = `
      INSERT INTO events 
      (event_name, start_date, end_date, description, type, status, image, manager_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const queryParams = [
      eventFields.event_name,
      eventFields.start_date,
      eventFields.end_date,
      eventFields.description,
      eventFields.type,
      eventFields.status,
      eventFields.image,
      eventFields.manager_id,
    ];

    try {
      const [result] = await db.query(insertQuery, queryParams);
      res.status(200).json({
        message: "Event created successfully.",
        eventData: { id: result.insertId, ...eventFields },
      });
    } catch (err) {
      console.error("Insert error details:", err);
      console.error("SQL Error Message:", err.sqlMessage);
      res
        .status(500)
        .json({ error: err.sqlMessage || "Something went wrong." });
    }
  }
);

//

// Example route to fetch events for a specific manager
router.get("/events/:managerId", authenticateToken, async (req, res) => {
  const managerId = req.params.managerId;

  try {
    const [results] = await db.query(
      "SELECT * FROM events WHERE manager_id = ? AND status = 'Approved'",
      [managerId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});


// Get participants for a specific event
router.get("/view-participants", authenticateToken, async (req, res) => {
  const managerId = req.user.userId;

  try {
    const query = `
      SELECT 
        e.id AS eventId,
        e.event_name,
        a.id AS participantId,
        a.name,
        a.email,
        a.profile_image,
        a.phone
      FROM events e
      LEFT JOIN event_attendees ea ON e.id = ea.event_id
      LEFT JOIN attendees a ON ea.attendee_id = a.id
      WHERE e.manager_id = ?
      ORDER BY e.id, a.name
    `;

    const [rows] = await db.query(query, [managerId]);

    // Group participants by event
    const eventsMap = {};
    rows.forEach(row => {
      if (!eventsMap[row.eventId]) {
        eventsMap[row.eventId] = {
          eventId: row.eventId,
          eventName: row.event_name,
          participants: [],
        };
      }
      if (row.participantId) {
        eventsMap[row.eventId].participants.push({
          id: row.participantId,
          name: row.name,
          email: row.email,
          profile_image: row.profile_image,
          phone: row.phone,
        });
      }
    });

    const events = Object.values(eventsMap);
    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching participants:", err);
    res.status(500).json({ message: "Server error" });
  }
});



router.get("/view-feedback/:managerId", authenticateToken, async (req, res) => {
  const managerId = req.params.managerId;

  const query = `
    SELECT 
      f.rating, 
      f.text, 
      f.submitted_at, 
      a.name AS attendeeName, 
      a.profile_image AS attendeeImage
    FROM feedback f
    JOIN events e ON f.event_id = e.id
    LEFT JOIN attendees a ON f.attendee_id = a.id
    WHERE e.manager_id = ?
    ORDER BY f.submitted_at DESC
  `;

  try {
    const [results] = await db.query(query, [managerId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
