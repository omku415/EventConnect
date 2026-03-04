import express from "express";
import uploadResume from "../utils/cloudinary/uploadResume.js";
import uploadEvents from "../utils/cloudinary/uploadEvents.js";
import authenticateToken from "../middleware/authenticateToken.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

import {
  registerManager,
  managerLogin,
  getManagerEvents,
  viewParticipants,
  viewFeedback,
  createEvent
} from "../controllers/managerController.js";

router.post("/register", uploadResume.single("resume"), registerManager);

router.post("/login", managerLogin);

router.post(
  "/create-events",
  authenticateToken,
  uploadEvents.single("image"),
  createEvent,
);

router.get("/events/:managerId", authenticateToken, getManagerEvents);

router.get("/view-participants", authenticateToken, viewParticipants);

router.get("/view-feedback/:managerId", authenticateToken, viewFeedback);

export default router;