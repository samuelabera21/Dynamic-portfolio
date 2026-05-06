import { Router } from "express";
import prisma from "../lib/prisma";
import { getOrSetCache } from "../lib/response-cache";

const router = Router();
const PUBLIC_CACHE_CONTROL = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";
const PUBLIC_DATA_CACHE_TTL_MS = 3_600_000; // 1 hour
const MAX_HOME_FEATURED_PROJECTS = 6;
const MAX_HOME_SKILLS = 100;

// ✅ GET HOME DATA (PUBLIC)
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);
    const payload = await getOrSetCache("home:public", PUBLIC_DATA_CACHE_TTL_MS, async () => {
      const profile = await prisma.profile.findFirst({
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          role: true,
          bio: true,
          avatarUrl: true,
          resumeUrl: true,
          location: true,
          available: true,
          socialLinks: {
            select: {
              platform: true,
              url: true,
            },
          },
        },
      });

      const safeProfile = profile ?? {
        id: "default-profile",
        name: "Your Name",
        role: "Software Developer",
        bio: "Edit this from admin panel",
        avatarUrl: "",
        resumeUrl: "",
        location: null,
        available: true,
        socialLinks: [],
      };

      const [featuredProjects, allSkills, rawSettings] = await Promise.all([
        prisma.project.findMany({
          where: {
            featured: true,
            published: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            githubUrl: true,
            liveUrl: true,
            techStack: true,
            featured: true,
            published: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: MAX_HOME_FEATURED_PROJECTS,
        }),
        prisma.skill.findMany({
          select: {
            name: true,
            category: true,
          },
          orderBy: [{ category: "asc" }, { name: "asc" }],
          take: MAX_HOME_SKILLS,
        }),
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
        profile: safeProfile,
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