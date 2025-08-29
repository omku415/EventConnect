const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: toEmail,
    subject: "Password Reset Request",
    text: `You requested a password reset. Visit this link to reset your password: ${resetLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password. Click the button below to reset it:</p>
        <a href="${resetLink}" 
           style="display: inline-block; padding: 10px 20px; margin: 10px 0; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
           Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 0.9em; color: #999;">&copy; 2025 Event Connect. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendPasswordResetEmail;
