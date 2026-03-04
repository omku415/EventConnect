import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// REGISTER ATTENDEE
export const registerAttendee = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO attendees (name, phone, email, password) VALUES (?, ?, ?, ?)";

    await db.query(query, [name, phone, email, hashedPassword]);

    res.status(201).json({
      message: "Attendee registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};


// ATTENDEE LOGIN
export const attendeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

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
};


// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const attendeeId = req.params.id;
    const { name, phone } = req.body;

    const imageUrl = req.file ? req.file.path : null;

    let updatedFields = {};
    let queryParams = [];

    if (name) updatedFields.name = name;
    if (phone) updatedFields.phone = phone;
    if (imageUrl) updatedFields.profile_image = imageUrl;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: "No fields to update." });
    }

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

    await db.query(updateQuery, queryParams);

    res.status(200).json({
      message: "Profile updated successfully",
      updatedData: {
        id: attendeeId,
        ...updatedFields,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};


// GET APPROVED EVENTS
export const getApprovedEvents = async (req, res) => {
  try {
    const query = "SELECT * FROM events WHERE status = 'Approved'";

    const [results] = await db.query(query);

    res.status(200).json(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// JOIN EVENT
export const joinEvent = async (req, res) => {
  try {
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

    await db.query(query, [eventId, attendeeId]);

    res.status(200).json({
      message: "Successfully joined the event",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// GET JOINED EVENTS
export const getJoinedEvents = async (req, res) => {
  try {
    const attendeeId = req.user.userId;

    const query = `
      SELECT events.*
      FROM events
      JOIN event_attendees ON events.id = event_attendees.event_id
      WHERE event_attendees.attendee_id = ?
    `;

    const [results] = await db.query(query, [attendeeId]);

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching joined events:", err);
    res.status(500).json({
      message: "Failed to fetch joined events",
    });
  }
};


// SUBMIT FEEDBACK
export const submitFeedback = async (req, res) => {
  try {
    const attendeeId = req.user.userId;
    const { rating, text, eventId } = req.body;

    if (!eventId || !rating) {
      return res.status(400).json({
        message: "Event ID and rating are required",
      });
    }

    const query = `
      INSERT INTO feedback (event_id, attendee_id, rating, text)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(query, [eventId, attendeeId, rating, text]);

    res.status(201).json({
      message: "Feedback submitted successfully",
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Server error" });
  }
};