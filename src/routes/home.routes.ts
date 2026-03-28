import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

// ✅ GET HOME DATA (PUBLIC)
router.get("/", async (req, res) => {
  try {
    let profile = await prisma.profile.findFirst({
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

    res.json({
      profile,
      featuredProjects,
      skills: groupedSkills,
      showProjects: flags.showProjects,
      showSkills: flags.showSkills,
      showBlog: flags.showBlog,
      availableForHire: flags.availableForHire,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching home data" });
  }
});

export default router;