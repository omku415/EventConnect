const nodemailer = require("nodemailer");
require("dotenv").config();

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send event approval email
const sendEventApprovalEmail = async (managerEmail) => {
  const subject = "Event Approval Notification";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Event Approved ✅</h2>
      <p>Dear Manager,</p>
      <p>Your event has been <strong>approved</strong> and is now live on <strong>Event Connect</strong>.</p>
      <p>Thank you for managing events with us!</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9em; color: #999;">&copy; 2025 Event Connect. All rights reserved.</p>
    </div>
  `;
  const textContent =
    "Dear Manager, your event has been approved and is now live on Event Connect.";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_SENDER_EMAIL,
      to: managerEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log("Event approval email sent successfully to", managerEmail);
  } catch (error) {
    console.error("Error sending event approval email:", error);
  }
};

// Function to send event rejection email
const sendEventRejectionEmail = async (managerEmail) => {
  const subject = "Event Rejection Notification";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #FF4C4C;">Event Rejected ❌</h2>
      <p>Dear Manager,</p>
      <p>After reviewing your event submission, we regret to inform you that it has been <strong>rejected</strong>.</p>
      <p>Please review the event details and make the necessary changes.</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9em; color: #999;">&copy; 2025 Event Connect. All rights reserved.</p>
    </div>
  `;
  const textContent =
    "Dear Manager, your event has been rejected. Please check the event details and make necessary changes.";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_SENDER_EMAIL,
      to: managerEmail,
      subject,
      text: textContent,
      html: htmlContent,
    });
    console.log("Event rejection email sent successfully to", managerEmail);
  } catch (error) {
    console.error("Error sending event rejection email:", error);
  }
};

module.exports = {
  sendEventApprovalEmail,
  sendEventRejectionEmail,
};
