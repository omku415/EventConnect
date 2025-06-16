const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const sendVerificationEmail = (managerEmail) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: managerEmail,  // Manager's email
    from: process.env.SENDGRID_SENDER_EMAIL,  // Your verified SendGrid email
    subject: "Manager Registration Verified",
    text: "Your registration has been successfully verified by the admin. You can now log in to your account.",
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
};

module.exports = sendVerificationEmail;
