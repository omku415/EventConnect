import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send manager verification email
export const sendVerificationEmail = async (managerEmail) => {
  const subject = "Manager Registration Verified";

  const textContent = `Congratulations!

Your registration has been successfully verified by the admin. You can now log in to your Event Connect account.`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #4CAF50;">Registration Verified ✅</h2>
      <p>Hello,</p>
      <p>Your registration has been successfully verified by the admin. You can now log in to your <strong>Event Connect</strong> account.</p>
      <p>Welcome aboard and thank you for joining us!</p>
      <hr style="border: 0; border-top: 1px solid #eee;" />
      <p style="font-size: 0.9em; color: #999;">© 2025 Event Connect</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: managerEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    });

    console.log("Verification email sent successfully to", managerEmail);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};