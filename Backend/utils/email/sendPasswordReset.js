import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (toEmail, resetLink) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
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
        <p style="font-size: 0.9em; color: #999;">© 2025 Event Connect</p>
      </div>
      `,
    });

    console.log("Password reset email sent to", toEmail);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};