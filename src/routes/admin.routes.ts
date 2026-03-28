

import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
console.log("🔥 ADMIN ROUTES ACTIVE");

// 🔒 DASHBOARD STATS
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const [
      totalProjects,
      totalPosts,
      totalMessages,
      unreadMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.post.count(),
      prisma.message.count(),
      prisma.message.count({
        where: { isRead: false, read: false },
      }),
    ]);

    res.json({
      totalProjects,
      totalPosts,
      totalMessages,
      unreadMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

export default router;