import { Router } from "express";

import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();
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

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating project" });
  }
});

// ✅ GET ALL PROJECTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const showProjects = await isPublicProjectsEnabled();
    if (!showProjects) {
      return res.json([]);
    }

    const { tech, featured, search } = req.query;

    const projects = await prisma.project.findMany({
      where: {
        // ✅ only show published projects
        published: true,

        // ✅ filter by tech
        ...(tech && {
          techStack: {
            has: tech as string,
          },
        }),

        // ✅ filter featured
        ...(featured && {
          featured: featured === "true",
        }),

        // ✅ search in title OR description
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
    });

    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching projects" });
  }
});



router.get("/:id", async (req, res) => {
  try {
    const showProjects = await isPublicProjectsEnabled();
    if (!showProjects) {
      return res.status(404).json({ message: "Project not found" });
    }

    const id = req.params.id as string;

    const project = await prisma.project.findUnique({
      where: { id },
    });

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

    res.json({ message: "Project deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting project" });
  }
});


export default router;