import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

console.log("🔥 POST ROUTES ACTIVE");


// ✅ CREATE POST (ADMIN)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, published } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
      },
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating post" });
  }
});


// ✅ GET ALL POSTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true, // 🔥 only public posts
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});


// 🔒 GET ALL POSTS (ADMIN - includes drafts)
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});


// ✅ GET SINGLE POST
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post || !post.published) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});


// 🔒 UPDATE POST
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { title, content, published } = req.body;

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        published,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});


// 🔒 DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

export default router;