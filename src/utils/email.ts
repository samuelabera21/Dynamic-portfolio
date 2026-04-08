import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER?.trim();
const smtpHost = process.env.SMTP_HOST?.trim() || "smtp-relay.brevo.com";
const smtpPort = Number(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER?.trim();
const smtpPass = process.env.SMTP_PASS?.trim();
const smtpFrom = process.env.SMTP_FROM?.trim() || "Samuel Abera <samuelabera.dev@gmail.com>";

export type MailDeliveryResult = {
  accepted: string[];
  rejected: string[];
  response: string;
  messageId: string;
};

if (!emailUser || !smtpUser || !smtpPass) {
  console.warn("Email is not configured. Set EMAIL_USER, SMTP_USER, and SMTP_PASS in .env");
}

const transporter = smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    })
  : null;

function ensureEmailConfigured(): nodemailer.Transporter {
  if (!transporter || !emailUser) {
    throw new Error("Email service is not configured. Set EMAIL_USER, SMTP_USER, and SMTP_PASS.");
  }

  return transporter;
}

function toDeliveryResult(info: nodemailer.SentMessageInfo): MailDeliveryResult {
  const accepted = (info.accepted as Array<string | { address: string }> | undefined ?? []).map((value) =>
    typeof value === "string" ? value : value.address
  );
  const rejected = (info.rejected as Array<string | { address: string }> | undefined ?? []).map((value) =>
    typeof value === "string" ? value : value.address
  );

  return {
    accepted,
    rejected,
    response: info.response,
    messageId: info.messageId,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ✅ Send notification to YOU (admin)
export const sendAdminNotification = async (
  name: string,
  email: string,
  message: string
) : Promise<MailDeliveryResult> => {
  const emailTransporter = ensureEmailConfigured();
  const adminRecipient = emailUser as string;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const info = await emailTransporter.sendMail({
    from: smtpFrom,
    to: adminRecipient,
    subject: "📩 New Portfolio Message",
    html: `
      <h2>New Message Received</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  });

  return toDeliveryResult(info);
};

// ✅ Auto-reply to USER
export const sendAutoReply = async (email: string, name: string): Promise<MailDeliveryResult> => {
  const emailTransporter = ensureEmailConfigured();

  const safeName = escapeHtml(name);

  const info = await emailTransporter.sendMail({
    from: smtpFrom,
    to: email,
    subject: "Thanks for contacting me 👋",
    html: `
      <h3>Hello ${safeName},</h3>
      <p>Thank you for reaching out. I received your message and will get back to you soon.</p>
      <p>Best regards,<br/>Samuel</p>
    `,
  });

  return toDeliveryResult(info);
};

export const sendNewsletterBroadcast = async ({
  recipients,
  subject,
  title,
  message,
  linkLabel,
  linkUrl,
  unsubscribeLinkForRecipient,
}: {
  recipients: string[];
  subject: string;
  title: string;
  message: string;
  linkLabel?: string;
  linkUrl?: string;
  unsubscribeLinkForRecipient?: (recipient: string) => string;
}) => {
  if (recipients.length === 0) return;

  const emailTransporter = ensureEmailConfigured();

  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeLinkLabel = linkLabel ? escapeHtml(linkLabel) : "";
  const safeLinkUrl = linkUrl ? escapeHtml(linkUrl) : "";

  await Promise.all(recipients.map(async (recipient) => {
    await emailTransporter.sendMail({
      from: smtpFrom,
      to: recipient,
      subject,
      html: `
          <h2>${safeTitle}</h2>
          <p>${safeMessage}</p>
          ${safeLinkUrl ? `<p><a href="${safeLinkUrl}">${safeLinkLabel || safeLinkUrl}</a></p>` : ""}
          ${unsubscribeLinkForRecipient ? `<p><a href="${escapeHtml(unsubscribeLinkForRecipient(recipient))}">Unsubscribe</a></p>` : ""}
          <p>Best regards,<br/>Samuel</p>
        `,
    });
  }));
};