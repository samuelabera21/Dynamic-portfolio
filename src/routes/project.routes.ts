import { Router } from "express";

import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import { notifyNewsletterSubscribers } from "../utils/newsletter";
import { clearCacheByPrefix, getOrSetCache } from "../lib/response-cache";

const router = Router();
const PUBLIC_CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";
const PUBLIC_DATA_CACHE_TTL_MS = 300_000; // 5 minutes
console.log("🔥 PROJECT ROUTES ACTIVE");

async function isPublicProjectsEnabled(): Promise<boolean> {
  const setting = await prisma.setting.findUnique({
    where: { key: "showProjects" },
  });

  if (!setting) return true;
  return setting.value === "true";
}

// ✅ CREATE PROJECT (ADMIN ONLY)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      imageUrl,
      githubUrl,
      liveUrl,
      techStack,
      featured,
      published,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        title,
        description,
        imageUrl,
        githubUrl,
        liveUrl,
        techStack,
        featured,
        published,
      },
    });

    if (project.published) {
      const projectUrl = `${process.env.FRONTEND_URL ?? "http://localhost:3001"}/projects/${project.id}`;
      notifyNewsletterSubscribers({
        subject: `New project added: ${project.title}`,
        title: project.title,
        message: "A new project has been added to the portfolio.",
        linkLabel: "View the project",
        linkUrl: projectUrl,
      }).catch((error) => console.error("Newsletter error:", error));
    }

    clearCacheByPrefix(["projects:", "home:"]);

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
});

// ✅ GET ALL PROJECTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);

    const showProjects = await isPublicProjectsEnabled();
    if (!showProjects) {
      return res.json([]);
    }

    const { tech, featured, search } = req.query;
    const queryKey = JSON.stringify({ tech, featured, search });

    const projects = await getOrSetCache(
      `projects:list:${queryKey}`,
      PUBLIC_DATA_CACHE_TTL_MS,
      async () =>
        prisma.project.findMany({
          where: {
            published: true,
            ...(tech && {
              techStack: {
                has: tech as string,
              },
            }),
            ...(featured && {
              featured: featured === "true",
            }),
            ...(search && {
              OR: [
                {
                  title: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
              ],
            }),
          },
          orderBy: {
            createdAt: "desc",
          },
        })
    );

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
});



router.get("/:id", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);

    const showProjects = await isPublicProjectsEnabled();
    if (!showProjects) {
      return res.status(404).json({ message: "Project not found" });
    }

    const id = req.params.id as string;

    const project = await getOrSetCache(
      `projects:item:${id}`,
      PUBLIC_DATA_CACHE_TTL_MS,
      async () => prisma.project.findUnique({
        where: { id },
      })
    );

    if (!project || !project.published) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching project" });
  }
});





router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    const data: any = {};

    const {
      title,
      description,
      imageUrl,
      githubUrl,
      liveUrl,
      techStack,
      featured,
      published,
    } = req.body;

    const existingProject = await prisma.project.findUnique({ where: { id } });

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (githubUrl !== undefined) data.githubUrl = githubUrl;
    if (liveUrl !== undefined) data.liveUrl = liveUrl;
    if (techStack !== undefined) data.techStack = techStack;
    if (featured !== undefined) data.featured = featured;
    if (published !== undefined) data.published = published;

    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    });

    if (!existingProject?.published && updatedProject.published) {
      const projectUrl = `${process.env.FRONTEND_URL ?? "http://localhost:3001"}/projects/${updatedProject.id}`;
      notifyNewsletterSubscribers({
        subject: `New project added: ${updatedProject.title}`,
        title: updatedProject.title,
        message: "A new project has been added to the portfolio.",
        linkLabel: "View the project",
        linkUrl: projectUrl,
      }).catch((error) => console.error("Newsletter error:", error));
    }

    clearCacheByPrefix(["projects:", "home:"]);

    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating project" });
  }
});




router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    await prisma.project.delete({
      where: { id },
    });

    clearCacheByPrefix(["projects:", "home:"]);

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
});


export default router;