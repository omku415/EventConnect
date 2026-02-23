const nodemailer = require('nodemailer');
require('dotenv').config();

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send manager verification email
const sendVerificationEmail = async (managerEmail) => {
  const mailOptions = {
    from: process.env.SMTP_SENDER_EMAIL,
    to: managerEmail,
    subject: "Manager Registration Verified",
    text: `Congratulations!

Your registration has been successfully verified by the admin. You can now log in to your Event Connect account.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">Registration Verified ✅</h2>
        <p>Hello,</p>
        <p>Your registration has been successfully verified by the admin. You can now log in to your <strong>Event Connect</strong> account.</p>
        <p>Welcome aboard and thank you for joining us!</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 0.9em; color: #999;">&copy; 2025 Event Connect. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to', managerEmail);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendVerificationEmail;
