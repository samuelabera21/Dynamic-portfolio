import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();


// ✅ 1. GET PROFILE (PUBLIC)
router.get("/", async (req, res) => {
  try {
    let profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
      include: {
        socialLinks: true,
      },
    });

    // 👉 Auto-create if not exists
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name: "Your Name",
          role: "Software Developer",
          bio: "Edit this from admin panel",
          avatarUrl: "",
          resumeUrl: "",
        },
        include: {
          socialLinks: true,
        },
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});


// 🔒 2. UPDATE PROFILE (ADMIN ONLY)
router.put("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      role,
      bio,
      avatarUrl,
      resumeUrl,
      location,
      available,
      socialLinks,
    } = req.body;

    let profile = await prisma.profile.findFirst({
      orderBy: { updatedAt: "desc" },
      include: { socialLinks: true },
    });

    // 👉 If not exists → create
    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name,
          role,
          bio,
          avatarUrl,
          resumeUrl,
          location,
          available,
        },
        include: {
          socialLinks: true,
        },
      });
    } else {
      // 👉 Update existing
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: {
          name,
          role,
          bio,
          avatarUrl,
          resumeUrl,
          location,
          available,
        },
        include: {
          socialLinks: true,
        },
      });
    }

    // 👉 Replace social links
    if (socialLinks) {
      await prisma.socialLink.deleteMany({
        where: { profileId: profile.id },
      });

      await prisma.socialLink.createMany({
        data: socialLinks.map((link: any) => ({
          platform: link.platform,
          url: link.url,
          profileId: profile.id,
        })),
      });
    }

    // 👉 Return updated profile
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: { socialLinks: true },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;