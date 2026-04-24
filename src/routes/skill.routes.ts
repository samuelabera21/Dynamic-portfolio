import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { clearCacheByPrefix, getOrSetCache } from "../lib/response-cache";

const router = Router();
const PUBLIC_CACHE_CONTROL = "public, max-age=30, s-maxage=60, stale-while-revalidate=300";
const PUBLIC_DATA_CACHE_TTL_MS = 30_000;


// ✅ 1. GET ALL SKILLS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);

    const skills = await getOrSetCache("skills:list", PUBLIC_DATA_CACHE_TTL_MS, async () =>
      prisma.skill.findMany()
    );

    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching skills" });
  }
});




// ✅ 2. GET GROUPED SKILLS (PUBLIC)
router.get("/grouped", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);

    const skills = await getOrSetCache("skills:grouped-source", PUBLIC_DATA_CACHE_TTL_MS, async () =>
      prisma.skill.findMany()
    );

    const grouped: Record<string, string[]> = {};

    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }

      grouped[skill.category].push(skill.name);
    });

    res.json(grouped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error grouping skills" });
  }
});

// 🔒 2. CREATE SKILL (ADMIN)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, category } = req.body;

    const skill = await prisma.skill.create({
      data: {
        name,
        category,
      },
    });

    clearCacheByPrefix(["skills:", "home:"]);

    res.json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating skill" });
  }
});


// 🔒 3. UPDATE SKILL (ADMIN)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    const { name, category } = req.body;

    const updated = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
      },
    });

    clearCacheByPrefix(["skills:", "home:"]);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating skill" });
  }
});


// 🔒 4. DELETE SKILL (ADMIN)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
     const id = req.params.id as string;

    await prisma.skill.delete({
      where: { id },
    });

    clearCacheByPrefix(["skills:", "home:"]);

    res.json({ message: "Skill deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting skill" });
  }
});

export default router;