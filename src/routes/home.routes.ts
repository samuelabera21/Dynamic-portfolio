import { Router } from "express";
import prisma from "../lib/prisma";
import { getOrSetCache } from "../lib/response-cache";

const router = Router();
const PUBLIC_CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";
const PUBLIC_DATA_CACHE_TTL_MS = 300_000; // 5 minutes

// ✅ GET HOME DATA (PUBLIC)
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
    const payload = await getOrSetCache("home:public", PUBLIC_DATA_CACHE_TTL_MS, async () => {
      let profile = await prisma.profile.findFirst({
        orderBy: { updatedAt: "desc" },
        include: { socialLinks: true },
      });

      if (!profile) {
        profile = await prisma.profile.create({
          data: {
            name: "Your Name",
            role: "Software Developer",
            bio: "Edit this from admin panel",
            avatarUrl: "",
            resumeUrl: "",
          },
          include: { socialLinks: true },
        });
      }

      const [featuredProjects, allSkills, rawSettings] = await Promise.all([
        prisma.project.findMany({
          where: {
            featured: true,
            published: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.skill.findMany(),
        prisma.setting.findMany({
          where: {
            key: {
              in: ["showProjects", "showSkills", "showBlog", "availableForHire"],
            },
          },
        }),
      ]);

      const groupedSkills: Record<string, string[]> = {
        frontend: [],
        backend: [],
        tools: [],
      };

      allSkills.forEach((skill) => {
        if (!groupedSkills[skill.category]) {
          groupedSkills[skill.category] = [];
        }

        groupedSkills[skill.category].push(skill.name);
      });

      const flags = {
        showProjects: true,
        showSkills: true,
        showBlog: true,
        availableForHire: true,
      };

      rawSettings.forEach((setting) => {
        if (setting.key in flags) {
          flags[setting.key as keyof typeof flags] = setting.value === "true";
        }
      });

      return {
        profile,
        featuredProjects: flags.showProjects ? featuredProjects : [],
        skills: groupedSkills,
        showProjects: flags.showProjects,
        showSkills: flags.showSkills,
        showBlog: flags.showBlog,
        availableForHire: flags.availableForHire,
      };
    });

    res.json(payload);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching home data" });
  }
});

export default router;