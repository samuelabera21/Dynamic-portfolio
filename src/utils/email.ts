const emailUser = process.env.EMAIL_USER?.trim();
const brevoApiKey = process.env.BREVO_API_KEY?.trim();
const senderText = process.env.SMTP_FROM?.trim() || "Samuel Abera <samuelabera.dev@gmail.com>";

export type MailDeliveryResult = {
  accepted: string[];
  rejected: string[];
  response: string;
  messageId: string;
};

if (!emailUser || !brevoApiKey) {
  console.warn("Email is not configured. Set EMAIL_USER and BREVO_API_KEY in .env");
}

type BrevoRecipient = { email: string; name?: string };
type BrevoSender = { email: string; name?: string };

function ensureEmailConfigured(): { adminEmail: string; apiKey: string } {
  if (!emailUser || !brevoApiKey) {
    throw new Error("Email service is not configured. Set EMAIL_USER and BREVO_API_KEY.");
  }

  return { adminEmail: emailUser, apiKey: brevoApiKey };
}

function parseSender(value: string): BrevoSender {
  const match = value.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
  if (match) {
    const name = match[1].replace(/^"|"$/g, "").trim();
    const email = match[2].trim().toLowerCase();
    return name ? { name, email } : { email };
  }

  const normalized = value.trim();
  if (normalized.includes(" ")) {
    return { email: normalized.slice(normalized.lastIndexOf(" ") + 1).trim().toLowerCase() };
  }

  return { email: normalized.toLowerCase() };
}

function normalizeRecipients(recipients: string | string[]): BrevoRecipient[] {
  const list = Array.isArray(recipients) ? recipients : [recipients];
  return list.map((email) => ({ email }));
}

function toDeliveryResult(messageId: string, recipients: BrevoRecipient[]): MailDeliveryResult {
  return {
    accepted: recipients.map((recipient) => recipient.email),
    rejected: [],
    response: "sent-via-brevo-http",
    messageId,
  };
}

async function sendViaBrevoHttp({
  recipients,
  subject,
  html,
}: {
  recipients: BrevoRecipient[];
  subject: string;
  html: string;
}): Promise<MailDeliveryResult> {
  const { apiKey } = ensureEmailConfigured();

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: parseSender(senderText),
      to: recipients,
      subject,
      htmlContent: html,
    }),
  });

  const responseText = await response.text();
  const parsed = responseText
    ? (JSON.parse(responseText) as {
        messageId?: string;
        message?: string;
        code?: string;
        errors?: Array<{ message?: string }>;
      })
    : {};

  if (!response.ok || !parsed.messageId) {
    const details = parsed.errors?.map((entry) => entry.message).filter(Boolean).join("; ");
    const error = new Error(details || parsed.message || responseText || "Failed to send email via Brevo API.") as Error & { code?: string };
    error.code = parsed.code || `BREVO_HTTP_${response.status}`;
    throw error;
  }

  return toDeliveryResult(parsed.messageId, recipients);
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
  const { adminEmail } = ensureEmailConfigured();

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  return sendViaBrevoHttp({
    recipients: normalizeRecipients(adminEmail),
    subject: "📩 New Portfolio Message",
    html: `
      <h2>New Message Received</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `,
  });
};

// ✅ Auto-reply to USER
export const sendAutoReply = async (email: string, name: string): Promise<MailDeliveryResult> => {
  ensureEmailConfigured();

  const safeName = escapeHtml(name);

  return sendViaBrevoHttp({
    recipients: normalizeRecipients(email),
    subject: "Thanks for contacting me 👋",
    html: `
      <h3>Hello ${safeName},</h3>
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
  if (recipients.length === 0) return;

  ensureEmailConfigured();

  const safeTitle = escapeHtml(title);
  const safeMessage = escapeHtml(message);
  const safeLinkLabel = linkLabel ? escapeHtml(linkLabel) : "";
  const safeLinkUrl = linkUrl ? escapeHtml(linkUrl) : "";

  await Promise.all(recipients.map(async (recipient) => {
    await sendViaBrevoHttp({
      recipients: normalizeRecipients(recipient),
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