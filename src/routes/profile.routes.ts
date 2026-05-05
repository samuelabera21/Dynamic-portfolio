import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { clearCacheByPrefix, getOrSetCache } from "../lib/response-cache";

const router = Router();
const PUBLIC_CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";
const PUBLIC_DATA_CACHE_TTL_MS = 300_000; // 5 minutes


// ✅ 1. GET PROFILE (PUBLIC)
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);

    const profile = await getOrSetCache("profile:public", PUBLIC_DATA_CACHE_TTL_MS, async () => {
      let current = await prisma.profile.findFirst({
        orderBy: { updatedAt: "desc" },
        include: {
          socialLinks: true,
        },
      });

      if (!current) {
        current = await prisma.profile.create({
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

      return current;
    });

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
    if (Array.isArray(socialLinks)) {
      await prisma.socialLink.deleteMany({
        where: { profileId: profile.id },
      });

      const toCreate = socialLinks
        .map((link: any) => ({
          platform: String(link.platform ?? "").trim(),
          url: String(link.url ?? "").trim(),
          profileId: profile.id,
        }))
        .filter((item) => item.platform && item.url);

      if (toCreate.length > 0) {
        await prisma.socialLink.createMany({ data: toCreate });
      }
    }

    // 👉 Return updated profile
    const updatedProfile = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: { socialLinks: true },
    });

    clearCacheByPrefix(["profile:", "home:"]);

    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;