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

// Function to send manager rejection email directly
const sendRejectionEmail = async (managerEmail) => {
  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: managerEmail,
    subject: "Manager Registration Status Update",
    text: `Dear Applicant,

Thank you for your interest in the manager position at Event Connect.

After carefully reviewing your application, we regret to inform you that you have not been selected for this role at this time.

We truly appreciate the effort you put into your application and encourage you to apply again in the future.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #FF4C4C;">Application Status ❌</h2>
        <p>Dear Applicant,</p>
        <p>Thank you for your interest in the manager position at <strong>Event Connect</strong>.</p>
        <p>After carefully reviewing your application, we regret to inform you that you have not been selected for this role at this time.</p>
        <p>We truly appreciate the effort you put into your application and encourage you to apply again in the future.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 0.9em; color: #999;">&copy; 2025 Event Connect. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Manager rejection email sent successfully to", managerEmail);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendRejectionEmail;
