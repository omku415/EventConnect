const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const uploadResume = require("../Cloudinary/uploadResume");
const uploadEvents = require("../Cloudinary/uploadEvents");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../authenticateToken");
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Manager Registration Route
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

    db.query(
      insertQuery,
      [name, phone, email, hashedPassword, resumeUrl],
      (err, result) => {
        if (err) {
          console.error("DB error:", err);

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }

          return res
            .status(500)
            .json({ message: "Manager registration failed" });
        }

        res.status(201).json({
          message: "Registration successful. Awaiting admin approval.",
        });
      }
    );
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
  });
});

router.post(
  "/create-events",
  authenticateToken,
  uploadEvents.single("image"),
  (req, res) => {
    const {
      event_name,
      start_date,
      end_date,
      description,
      type,
      status,
      manager_id, // ✅ Extract manager_id from body
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
      manager_id, // ✅ Add manager_id here
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
      eventFields.manager_id, // ✅ Include in values
    ];

    db.query(insertQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Something went wrong." });
      }

      res.status(200).json({
        message: "Event created successfully.",
        eventData: {
          id: result.insertId,
          ...eventFields,
        },
      });
    });
  }
);

//

// Example route to fetch events for a specific manager
router.get("/events/:managerId", authenticateToken, (req, res) => {
  const managerId = req.params.managerId;

  db.query(
    "SELECT * FROM events WHERE manager_id = ? AND status = 'Approved'",
    [managerId],
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error fetching events", error });
      }

      res.json(results);
    }
  );
});

// Get participants for a specific event
router.get("/view-participants/:eventId", authenticateToken, (req, res) => {
  const eventId = req.params.eventId;

  const query = `
    SELECT a.id, a.name, a.email,a.profile_image,a.phone
    FROM event_attendees ea
    JOIN attendees a ON ea.attendee_id = a.id
    WHERE ea.event_id = ?
  `;

  db.query(query, [eventId], (err, results) => {
    if (err) {
      console.error("Error fetching participants:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  });
});

router.get("/view-feedback/:managerId", authenticateToken, (req, res) => {
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

  db.query(query, [managerId], (err, results) => {
    if (err) {
      console.error("Error fetching feedback:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json(results);
  });
});

module.exports = router;
