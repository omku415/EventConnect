require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const db = require("../config/db"); // now promise pool
const router = express.Router();
const sendVerificationEmail = require("../sendEmail/sendVerificationEmail");
const authenticateToken = require("../authenticateToken");
const sendRejectionEmail = require("../sendEmail/sendRejectionEmail");
const {
  sendEventApprovalEmail,
  sendEventRejectionEmail,
} = require("../sendEmail/sendEventEmail");

router.post("/login", async (req, res) => {
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
});

router.get("/pending-managers", authenticateToken, async (req, res) => {
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
});

// Approve Manager Route
router.post("/approve-manager/:managerId", async (req, res) => {
  const managerId = req.params.managerId;

  try {
    // Step 1: Update the manager's is_verified status
    const updateQuery = "UPDATE managers SET is_verified = true WHERE id = ?";
    await db.query(updateQuery, [managerId]);

    // Step 2: Fetch the manager's email
    const selectQuery = "SELECT email FROM managers WHERE id = ?";
    const [selectResult] = await db.query(selectQuery, [managerId]);

    if (selectResult.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerEmail = selectResult[0].email;

    // Step 3: Send the verification email
    sendVerificationEmail(managerEmail);

    res.status(200).json({ message: "Manager approved and email sent." });
  } catch (err) {
    console.error("Error approving manager:", err);
    res
      .status(500)
      .json({ message: "Failed to update manager verification status" });
  }
});


router.post("/reject-manager/:managerId", async (req, res) => {
  const managerId = req.params.managerId;

  try {
    // Step 1: Optionally mark the manager as rejected
    const updateQuery = "UPDATE managers SET is_verified = false WHERE id = ?";
    await db.query(updateQuery, [managerId]);

    // Step 2: Fetch the manager's email
    const selectQuery = "SELECT email FROM managers WHERE id = ?";
    const [selectResult] = await db.query(selectQuery, [managerId]);

    if (selectResult.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerEmail = selectResult[0].email;

    // Step 3: Send rejection email
    sendRejectionEmail(managerEmail);

    res.status(200).json({ message: "Manager rejected and email sent." });
  } catch (err) {
    console.error("Error rejecting manager:", err);
    res.status(500).json({ message: "Failed to update manager status" });
  }
});



router.get("/verify-events", authenticateToken, async (req, res) => {
  const query =
    "SELECT * FROM events WHERE status = 'Pending' ORDER BY created_at DESC";

  try {
    const [results] = await db.query(query);
    res.status(200).json({ events: results });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});


router.put("/update-event-status/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Step 1: Fetch manager_id before updating
    const [result] = await db.query("SELECT manager_id FROM events WHERE id = ?", [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const managerId = result[0].manager_id;

    // Step 2: Fetch manager's email
    const [managerResult] = await db.query("SELECT email FROM managers WHERE id = ?", [managerId]);

    if (managerResult.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const managerEmail = managerResult[0].email;

    // Step 3: Update status
    const [updateResult] = await db.query("UPDATE events SET status = ? WHERE id = ?", [status, id]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Step 4: Send email
    if (status === "Approved") {
      await sendEventApprovalEmail(managerEmail);
    } else if (status === "Rejected") {
      await sendEventRejectionEmail(managerEmail);
    }

    res.json({ message: `Event ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ message: "Error processing request", error });
  }
});


// /all-attendees
router.get("/all-attendees", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, name, email FROM attendees");
    res.json(results);
  } catch (err) {
    console.error("Error fetching attendees:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// /all-managers
router.get("/all-managers", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, name, email FROM managers");
    res.json(results);
  } catch (err) {
    console.error("Error fetching managers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.delete("/delete-attendee/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM attendees WHERE id = ?", [id]);
    res.json({ message: "Attendee deleted" });
  } catch (err) {
    console.error("Error deleting attendee:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete-manager/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.query("DELETE FROM managers WHERE id = ?", [id]);
    res.json({ message: "Manager deleted" });
  } catch (err) {
    console.error("Error deleting manager:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
