const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    // Dev fallback: no SMTP configured, just log it so the flow is testable locally.
    console.log("=== EMAIL (SMTP not configured, printing instead) ===");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log(html);
    console.log("=======================================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
