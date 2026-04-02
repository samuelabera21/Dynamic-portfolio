import prisma from "../lib/prisma";
import { sendNewsletterBroadcast } from "./email";
import crypto from "crypto";

const SUBSCRIBERS_KEY = "newsletterSubscribers";

type SubscriberStore = {
  emails: string[];
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function getNewsletterSecret(): string {
  return process.env.NEWSLETTER_SECRET || process.env.EMAIL_PASS || "newsletter-secret";
}

function signEmail(email: string): string {
  return crypto.createHmac("sha256", getNewsletterSecret()).update(normalizeEmail(email)).digest("hex");
}

function buildFrontendUrl(path: string): string {
  const base = process.env.FRONTEND_URL ?? "http://localhost:3001";
  return new URL(path, base).toString();
}

export function buildUnsubscribeUrl(email: string): string {
  const url = new URL(buildFrontendUrl("/unsubscribe"));
  url.searchParams.set("email", normalizeEmail(email));
  url.searchParams.set("token", signEmail(email));
  return url.toString();
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  return signEmail(email) === token;
}

function parseSubscribers(value: string | null | undefined): SubscriberStore {
  if (!value) return { emails: [] };

  try {
    const parsed = JSON.parse(value) as SubscriberStore | string[];
    if (Array.isArray(parsed)) {
      return { emails: parsed.filter((email) => isValidEmail(email)).map(normalizeEmail) };
    }

    if (parsed && Array.isArray(parsed.emails)) {
      return { emails: parsed.emails.filter((email) => isValidEmail(email)).map(normalizeEmail) };
    }
  } catch {
    return { emails: [] };
  }

  return { emails: [] };
}

async function readStore(): Promise<SubscriberStore> {
  const setting = await prisma.setting.findUnique({
    where: { key: SUBSCRIBERS_KEY },
  });

  return parseSubscribers(setting?.value);
}

async function writeStore(store: SubscriberStore): Promise<void> {
  await prisma.setting.upsert({
    where: { key: SUBSCRIBERS_KEY },
    create: {
      key: SUBSCRIBERS_KEY,
      value: JSON.stringify(store),
    },
    update: {
      value: JSON.stringify(store),
    },
  });
}

export async function addNewsletterSubscriber(email: string): Promise<{ added: boolean; total: number }> {
  const normalized = normalizeEmail(email);

  if (!isValidEmail(normalized)) {
    throw new Error("Please enter a valid email address");
  }

  const store = await readStore();

  if (store.emails.includes(normalized)) {
    return { added: false, total: store.emails.length };
  }

  store.emails.push(normalized);
  await writeStore(store);

  return { added: true, total: store.emails.length };
}

export async function removeNewsletterSubscriber(email: string): Promise<{ removed: boolean; total: number }> {
  const normalized = normalizeEmail(email);
  const store = await readStore();
  const nextEmails = store.emails.filter((item) => item !== normalized);

  if (nextEmails.length === store.emails.length) {
    return { removed: false, total: store.emails.length };
  }

  await writeStore({ emails: nextEmails });
  return { removed: true, total: nextEmails.length };
}

export async function getNewsletterSubscribers(): Promise<string[]> {
  const store = await readStore();
  return store.emails;
}

export async function notifyNewsletterSubscribers(options: {
  subject: string;
  title: string;
  message: string;
  linkLabel?: string;
  linkUrl?: string;
}) {
  const recipients = await getNewsletterSubscribers();

  if (recipients.length === 0) return;

  await sendNewsletterBroadcast({
    recipients,
    ...options,
    unsubscribeLinkForRecipient: (recipient) => buildUnsubscribeUrl(recipient),
  });
}
