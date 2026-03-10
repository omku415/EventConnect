import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send manager rejection email
export const sendRejectionEmail = async (managerEmail) => {
  const subject = "Manager Registration Status Update";

  const textContent = `Dear Applicant,

Thank you for your interest in the manager position at Event Connect.

After carefully reviewing your application, we regret to inform you that you have not been selected for this role at this time.

We truly appreciate the effort you put into your application and encourage you to apply again in the future.`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #FF4C4C;">Application Status ❌</h2>
      <p>Dear Applicant,</p>
      <p>Thank you for your interest in the manager position at <strong>Event Connect</strong>.</p>
      <p>After carefully reviewing your application, we regret to inform you that you have not been selected for this role at this time.</p>
      <p>We truly appreciate the effort you put into your application and encourage you to apply again in the future.</p>
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

    console.log("Manager rejection email sent successfully to", managerEmail);
  } catch (error) {
    console.error("Error sending manager rejection email:", error);
  }
};