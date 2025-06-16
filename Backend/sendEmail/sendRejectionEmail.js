const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendRejectionEmail = (managerEmail) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: managerEmail, // Manager's email
    from: process.env.SENDGRID_SENDER_EMAIL, // Your verified SendGrid email
    subject: "Manager Registration Status Update",
    text: `Dear Applicant,
  
  Thank you for your interest in the manager position at our organization.
  
  After carefully reviewing your application, we regret to inform you that you have not been selected for this role at this time.
  
  We truly appreciate the effort you put into your application and encourage you to apply again in the future.
  
  Best regards,
  The Team`,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("Error sending email:", error);
    });
};

module.exports = sendRejectionEmail;
