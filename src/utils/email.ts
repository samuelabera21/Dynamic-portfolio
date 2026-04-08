import { Resend } from "resend";

const emailUser = process.env.EMAIL_USER?.trim();
const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resendFromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

export type MailDeliveryResult = {
  accepted: string[];
  rejected: string[];
  response: string;
  messageId: string;
};

if (!emailUser || !resendApiKey) {
  console.warn("Email is not configured. Set EMAIL_USER and RESEND_API_KEY in .env");
}

const resendClient = resendApiKey
  ? new Resend(resendApiKey)
  : null;

function ensureEmailConfigured(): Resend {
  if (!resendClient || !emailUser) {
    throw new Error("Email service is not configured. Set EMAIL_USER and RESEND_API_KEY.");
  }

  return resendClient;
}

function toDeliveryResult(messageId: string, recipient: string | string[]): MailDeliveryResult {
  const accepted = Array.isArray(recipient) ? recipient : [recipient];
  return {
    accepted,
    rejected: [],
    response: "sent-via-resend",
    messageId,
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
  const emailClient = ensureEmailConfigured();
  const adminRecipient = emailUser as string;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  const { data, error } = await emailClient.emails.send({
    from: resendFromEmail,
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

  if (error || !data?.id) {
    throw new Error(error?.message || "Failed to send admin notification via Resend.");
  }

  return toDeliveryResult(data.id, adminRecipient);
};

// ✅ Auto-reply to USER
export const sendAutoReply = async (email: string, name: string): Promise<MailDeliveryResult> => {
  const emailClient = ensureEmailConfigured();

  const safeName = escapeHtml(name);

  const { data, error } = await emailClient.emails.send({
    from: resendFromEmail,
    to: email,
    subject: "Thanks for contacting me 👋",
    html: `
      <h3>Hello ${safeName},</h3>
      <p>Thank you for reaching out. I received your message and will get back to you soon.</p>
      <p>Best regards,<br/>Samuel</p>
    `,
  });

  if (error || !data?.id) {
    throw new Error(error?.message || "Failed to send auto-reply via Resend.");
  }

  return toDeliveryResult(data.id, email);
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

  const emailClient = ensureEmailConfigured();

  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeLinkLabel = linkLabel ? escapeHtml(linkLabel) : "";
  const safeLinkUrl = linkUrl ? escapeHtml(linkUrl) : "";

  await Promise.all(recipients.map(async (recipient) => {
    const { data, error } = await emailClient.emails.send({
      from: resendFromEmail,
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

    if (error || !data?.id) {
      throw new Error(error?.message || `Failed to send newsletter to ${recipient}`);
    }
  }));
};