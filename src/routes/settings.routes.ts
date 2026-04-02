import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { addNewsletterSubscriber } from "../utils/newsletter";

const router = Router();

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


// ✅ 1. GET SETTINGS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();

    const formatted: Record<string, boolean> = {};

    settings.forEach((setting) => {
      formatted[setting.key] = setting.value === "true";
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
      return prisma.setting.update({
        where: { key },
        data: {
          value: updates[key] ? "true" : "false",
        },
      });
    });

    await Promise.all(updatePromises);

    // 👉 return updated settings
    const settings = await prisma.setting.findMany();

    const formatted: Record<string, boolean> = {};

    settings.forEach((setting) => {
      formatted[setting.key] = setting.value === "true";
    });

    res.json(formatted);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating settings" });
  }
});

export default router;