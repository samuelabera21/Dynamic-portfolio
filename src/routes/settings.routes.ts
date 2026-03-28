import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();


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