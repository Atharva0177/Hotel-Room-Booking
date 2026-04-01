const transporter = require('../config/nodemailer');

const resolveFromAddress = () => {
  const smtpUser = process.env.SMTP_USER;
  const configured = process.env.EMAIL_FROM;

  if (!smtpUser) return configured;
  if (!configured) return `Aurelia Grand Hotel <${smtpUser}>`;
  if (configured.includes(smtpUser)) return configured;

  // If EMAIL_FROM uses another domain, fall back to SMTP account for better deliverability.
  return `Aurelia Grand Hotel <${smtpUser}>`;
};

const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: resolveFromAddress(),
    to,
    subject,
    html,
  });

  console.log(`Email sent to ${to} | messageId=${info.messageId}`);
  return info;
};

module.exports = { sendEmail };
