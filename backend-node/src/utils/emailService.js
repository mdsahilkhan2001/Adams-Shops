import nodemailer from "nodemailer";

const isSmtpConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.FROM_EMAIL);

const normalizeBaseUrl = (value) => {
  const fallback = process.env.FRONTEND_URL || "http://localhost:5175";
  return String(value || fallback).trim().replace(/\/$/, "");
};

const createVerificationUrl = (token, frontendBaseUrl) =>
  `${normalizeBaseUrl(frontendBaseUrl)}/verify-email?token=${token}`;

const createTransport = () => {
  if (isSmtpConfigured()) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  console.warn("SMTP not configured. Using JSON transport for local development.");
  return nodemailer.createTransport({ jsonTransport: true });
};

const transporter = createTransport();

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.FROM_EMAIL || "no-reply@adamsboutique.com",
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  if (!isSmtpConfigured()) {
    console.log("DEV EMAIL PREVIEW:", {
      to,
      subject,
      html
    });
  }
  return info;
};

const createVerificationEmail = (firstName, token, frontendBaseUrl) => {
  const verificationUrl = createVerificationUrl(token, frontendBaseUrl);
  return `<p>Hi ${firstName},</p><p>Thank you for registering at Adams Islamic Boutique. Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">Verify Email</a></p><p>If the link expires, request a new verification email.</p>`;
};

const createPasswordResetEmail = (firstName, token, frontendBaseUrl) => {
  const resetUrl = `${normalizeBaseUrl(frontendBaseUrl)}/reset-password/${token}`;
  return `<p>Hi ${firstName},</p><p>We received a request to reset your password. Click the button below to continue:</p><p><a href="${resetUrl}">Reset Password</a></p><p>If you did not request this, ignore this message.</p>`;
};

export { sendEmail, createVerificationEmail, createPasswordResetEmail, createVerificationUrl, isSmtpConfigured };
