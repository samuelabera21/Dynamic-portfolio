import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.warn("Email is not configured. Set EMAIL_USER and EMAIL_PASS in .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

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
) => {
  if (!emailUser || !emailPass) return;

  await transporter.sendMail({
    from: emailUser,
    to: emailUser, // YOU receive it
    subject: "📩 New Portfolio Message",
    html: `
      <h2>New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });
};

// ✅ Auto-reply to USER
export const sendAutoReply = async (email: string, name: string) => {
  if (!emailUser || !emailPass) return;

  await transporter.sendMail({
    from: emailUser,
    to: email,
    subject: "Thanks for contacting me 👋",
    html: `
      <h3>Hello ${name},</h3>
      <p>Thank you for reaching out. I received your message and will get back to you soon.</p>
      <p>Best regards,<br/>Samuel</p>
    `,
  });
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
  if (!emailUser || !emailPass || recipients.length === 0) return;

  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeLinkLabel = linkLabel ? escapeHtml(linkLabel) : "";
  const safeLinkUrl = linkUrl ? escapeHtml(linkUrl) : "";

  await Promise.all(
    recipients.map((recipient) =>
      transporter.sendMail({
        from: emailUser,
        to: recipient,
        subject,
        html: `
          <h2>${safeTitle}</h2>
          <p>${safeMessage}</p>
          ${safeLinkUrl ? `<p><a href="${safeLinkUrl}">${safeLinkLabel || safeLinkUrl}</a></p>` : ""}
          ${unsubscribeLinkForRecipient ? `<p><a href="${escapeHtml(unsubscribeLinkForRecipient(recipient))}">Unsubscribe</a></p>` : ""}
          <p>Best regards,<br/>Samuel</p>
        `,
      })
    )
  );
};