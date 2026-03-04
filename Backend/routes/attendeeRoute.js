import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import upload from "../utils/cloudinary/upload.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

import {
  registerAttendee,
  attendeeLogin,
  updateProfile,
  getApprovedEvents,
  joinEvent,
  getJoinedEvents,
  submitFeedback,
} from "../controllers/attendeeController.js";

router.post("/register", registerAttendee);
router.post("/login", attendeeLogin);

router.post(
  "/update-profile/:id",
  authenticateToken,
  upload.single("profile_image"),
  updateProfile,
);

router.get("/events/approved", authenticateToken, getApprovedEvents);

router.post("/join-event", authenticateToken, joinEvent);

router.get("/events/joined", authenticateToken, getJoinedEvents);

router.post("/feedback", authenticateToken, submitFeedback);

export default router;
