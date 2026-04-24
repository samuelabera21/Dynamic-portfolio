import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { notifyNewsletterSubscribers } from "../utils/newsletter";
import { clearCacheByPrefix, getOrSetCache } from "../lib/response-cache";

const router = Router();
const PUBLIC_CACHE_CONTROL = "public, max-age=30, s-maxage=60, stale-while-revalidate=300";
const PUBLIC_DATA_CACHE_TTL_MS = 30_000;

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

    if (post.published) {
      const postUrl = `${process.env.FRONTEND_URL ?? "http://localhost:3001"}/blog/${post.id}`;
      notifyNewsletterSubscribers({
        subject: `New blog post: ${post.title}`,
        title: post.title,
        message: "A new blog post has been published on the portfolio.",
        linkLabel: "Read the post",
        linkUrl: postUrl,
      }).catch((error) => console.error("Newsletter error:", error));
    }

    clearCacheByPrefix(["posts:", "home:"]);

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating post" });
  }
});


// ✅ GET ALL POSTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);

    const posts = await getOrSetCache("posts:list", PUBLIC_DATA_CACHE_TTL_MS, async () =>
      prisma.post.findMany({
        where: {
          published: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

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
    res.set("Cache-Control", PUBLIC_CACHE_CONTROL);

    const id = req.params.id as string;

    const post = await getOrSetCache(
      `posts:item:${id}`,
      PUBLIC_DATA_CACHE_TTL_MS,
      async () =>
        prisma.post.findUnique({
          where: { id },
        })
    );

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

    const existingPost = await prisma.post.findUnique({ where: { id } });

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        published,
      },
    });

    if (!existingPost?.published && updated.published) {
      const postUrl = `${process.env.FRONTEND_URL ?? "http://localhost:3001"}/blog/${updated.id}`;
      notifyNewsletterSubscribers({
        subject: `New blog post: ${updated.title}`,
        title: updated.title,
        message: "A new blog post has been published on the portfolio.",
        linkLabel: "Read the post",
        linkUrl: postUrl,
      }).catch((error) => console.error("Newsletter error:", error));
    }

    clearCacheByPrefix(["posts:", "home:"]);

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

    clearCacheByPrefix(["posts:", "home:"]);

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

export default router;