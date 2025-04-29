const sgMail = require('@sendgrid/mail');
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);  // Your SendGrid API key

// Function to send email
const sendEmail = async (to, subject, content) => {
  const msg = {
    to,
    from: process.env.SENDGRID_SENDER_EMAIL,
    subject,
    text: content,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;  // Rethrow the error to be handled by the caller
  }
};

// Function to send an event approval email
const sendEventApprovalEmail = async (managerEmail) => {
  const subject = 'Event Approval Notification';
  const content = 'Dear Manager, your event has been approved and is now live.';
  await sendEmail(managerEmail, subject, content);
};

// Function to send an event rejection email
const sendEventRejectionEmail = async (managerEmail) => {
  const subject = 'Event Rejection Notification';
  const content = 'Dear Manager, your event has been rejected. Please check the event details and make necessary changes.';
  await sendEmail(managerEmail, subject, content);
};

module.exports = {
  sendEventApprovalEmail,
  sendEventRejectionEmail,
};
