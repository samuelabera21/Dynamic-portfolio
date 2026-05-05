import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  addNewsletterSubscriber,
  getNewsletterSubscribers,
  removeNewsletterSubscriber,
  verifyUnsubscribeToken,
} from "../utils/newsletter";
import { clearCacheByPrefix, getOrSetCache } from "../lib/response-cache";

const router = Router();
const PUBLIC_CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";
const PUBLIC_DATA_CACHE_TTL_MS = 300_000; // 5 minutes

const defaultFlags = {
  showProjects: true,
  showSkills: true,
  showBlog: true,
  availableForHire: true,
};

router.post("/newsletter/subscribe", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await addNewsletterSubscriber(email);

    return res.json({
      message: result.added
        ? "You are subscribed to portfolio updates"
        : "You are already subscribed",
      subscribed: true,
      added: result.added,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to subscribe",
    });
  }
});

router.post("/newsletter/unsubscribe", async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const token = String(req.body?.token ?? "").trim();

    if (!email || !token) {
      return res.status(400).json({ message: "Invalid unsubscribe request" });
    }

    if (!verifyUnsubscribeToken(email, token)) {
      return res.status(400).json({ message: "Invalid or expired unsubscribe token" });
    }

    const result = await removeNewsletterSubscriber(email);

    return res.json({
      message: result.removed ? "You have been unsubscribed" : "You were not subscribed",
      unsubscribed: result.removed,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: error instanceof Error ? error.message : "Unable to unsubscribe",
    });
  }
});

router.get("/newsletter/subscribers", authMiddleware, async (_req, res) => {
  try {
    const subscribers = await getNewsletterSubscribers();
    res.json({ subscribers, total: subscribers.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subscribers" });
  }
});

router.delete("/newsletter/subscribers", authMiddleware, async (req, res) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await removeNewsletterSubscriber(email);

    res.json({
      message: result.removed ? "Subscriber removed" : "Subscriber not found",
      removed: result.removed,
      total: result.total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing subscriber" });
  }
});


// ✅ 1. GET SETTINGS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
    const formatted = await getOrSetCache("settings:public", PUBLIC_DATA_CACHE_TTL_MS, async () => {
      const settings = await prisma.setting.findMany();

      const current: Record<string, boolean> = { ...defaultFlags };

      settings.forEach((setting) => {
        if (setting.key in defaultFlags) {
          current[setting.key] = setting.value === "true";
        }
      });

      return current;
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching settings" });
  }
});


// 🔒 2. UPDATE SETTINGS (ADMIN ONLY)
router.put("/", authMiddleware, async (req, res) => {
  try {
    const updates: Record<string, boolean> = req.body;

    // 👉 validate input (important)
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // 👉 update all flags dynamically
    const updatePromises = Object.keys(updates).map((key) => {
      return prisma.setting.upsert({
        where: { key },
        update: {
          value: updates[key] ? "true" : "false",
        },
        create: {
          key,
          value: updates[key] ? "true" : "false",
        },
      });
    });

    await Promise.all(updatePromises);

    // 👉 return updated settings
    const settings = await prisma.setting.findMany();

    const formatted: Record<string, boolean> = { ...defaultFlags };

    settings.forEach((setting) => {
      if (setting.key in defaultFlags) {
        formatted[setting.key] = setting.value === "true";
      }
    });

    clearCacheByPrefix(["settings:", "home:", "projects:", "posts:", "skills:"]);

    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating settings" });
  }
});

export default router;