import express from "express";
import {
  login,
  pendingManager,
  approveManager,
  rejectManager,
  verifyEvents,
  updateEventStatus,
  getAllAttendees,
  getAllManagers,
  deleteAttendee,
  deleteManager,
  getAdminStats,
} from "../controllers/adminController.js";

import authenticateToken from "../middleware/authenticateToken.js";
const router = express.Router();

router.post("/login", login);
router.get("/pending-managers", authenticateToken, pendingManager);

router.post("/approve-manager/:managerId", approveManager);
router.post("/reject-manager/:managerId", rejectManager);

router.get("/verify-events", authenticateToken, verifyEvents);
router.put("/update-event-status/:id", authenticateToken, updateEventStatus);

router.get("/all-attendees", getAllAttendees);
router.get("/all-managers", getAllManagers);

router.delete("/delete-attendee/:id", authenticateToken, deleteAttendee);
router.delete("/delete-manager/:id", authenticateToken, deleteManager);

router.get("/admin-stats", getAdminStats);

export default router;
