require("dotenv").config();

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendPasswordResetEmail = async (toEmail, resetLink) => {
  const msg = {
    to: toEmail, // User's email address
    from: process.env.SENDGRID_SENDER_EMAIL, // Your verified sender email address
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
    html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log("Password reset email sent!");
  } catch (error) {
    console.error("Error sending email:",  error.response?.body || error.message || error);
  }
};

module.exports = sendPasswordResetEmail