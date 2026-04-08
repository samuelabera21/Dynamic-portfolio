// import { Router } from "express";
// import prisma from "../lib/prisma";
// import { authMiddleware } from "../middleware/auth.middleware";

// const router = Router();

// console.log("🔥 MESSAGE ROUTES ACTIVE");


// // ✅ 1. CREATE MESSAGE (PUBLIC)
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, message } = req.body;

//     const newMessage = await prisma.message.create({
//       data: {
//         name,
//         email,
//         message,
//       },
//     });

//     res.json(newMessage);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error sending message" });
//   }
// });


// // 🔒 2. GET ALL MESSAGES (ADMIN ONLY)
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const messages = await prisma.message.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// });


// // 🔒 3. MARK AS READ
// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const id = req.params.id as string;

//     const updated = await prisma.message.update({
//       where: { id },
//       data: {
//         isRead: true,
//       },
//     });

//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating message" });
//   }
// });


// // 🔒 4. DELETE MESSAGE
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
    
//     const id = req.params.id as string;

//     await prisma.message.delete({
//       where: { id },
//     });

//     res.json({ message: "Message deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting message" });
//   }
// });

// export default router;


import { Router } from "express";
import prisma from "../lib/prisma";
import { authMiddleware } from "../middleware/auth.middleware";
import { sendAdminNotification, sendAutoReply } from "../utils/email";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}


const router = Router();

console.log("🔥 MESSAGE ROUTES ACTIVE");


// ✅ 1. CREATE MESSAGE (PUBLIC)


// ✅ 1. CREATE MESSAGE (PUBLIC + EMAIL)
router.post("/", async (req, res) => {
  let createdMessage: Awaited<ReturnType<typeof prisma.message.create>> | null = null;

  try {
    const { name, email, message } = req.body;
    const senderName = String(name ?? "").trim();
    const senderEmail = String(email ?? "").trim().toLowerCase();
    const senderMessage = String(message ?? "").trim();

    if (!senderName || !senderMessage || !isValidEmail(senderEmail)) {
      return res.status(400).json({ message: "Please provide a valid name, email, and message." });
    }

    createdMessage = await prisma.message.create({
      data: {
        name: senderName,
        email: senderEmail,
        message: senderMessage,
      },
    });

    const [adminResult, autoReplyResult] = await Promise.all([
      sendAdminNotification(senderName, senderEmail, senderMessage),
      sendAutoReply(senderEmail, senderName),
    ]);

    console.log("Admin notification sent to:", process.env.EMAIL_USER, adminResult.messageId);
    console.log("Auto-reply sent to:", senderEmail, autoReplyResult.messageId);

    res.status(201).json(createdMessage);
  } catch (error) {
    console.error(error);

    if (createdMessage) {
      return res.status(502).json({
        message:
          "Your message was saved, but email delivery failed. Please try again soon.",
      });
    }

    res.status(500).json({ message: "Error sending message" });
  }
});

// 🔒 2. GET ALL MESSAGES (ADMIN)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { filter } = req.query;

    const messages = await prisma.message.findMany({
      where:
        filter === "unread"
          ? { isRead: false, read: false }
          : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    const normalized = messages.map((message) => ({
      ...message,
      isRead: message.isRead || message.read,
    }));

    res.json(normalized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});


// 🔒 3. GET SINGLE MESSAGE + AUTO MARK AS READ
router.get("/:id", authMiddleware, async (req, res) => {
  try {
   const id = req.params.id as string;

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const alreadyRead = message.isRead || message.read;

    // 👉 Auto mark as read
    if (!alreadyRead) {
      const updated = await prisma.message.update({
        where: { id },
        data: { isRead: true, read: true },
      });

      return res.json(updated);
    }

    res.json({
      ...message,
      isRead: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching message" });
  }
});


// 🔒 4. MARK AS READ (MANUAL) - main endpoint used by frontend
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    const updated = await prisma.message.update({
      where: { id },
      data: {
        isRead: true,
        read: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating message" });
  }
});

// 🔒 4b. Backward-compatible endpoint
router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    const updated = await prisma.message.update({
      where: { id },
      data: {
        isRead: true,
        read: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating message" });
  }
});


// 🔒 5. DELETE MESSAGE
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id as string;

    await prisma.message.delete({
      where: { id },
    });

    res.json({ message: "Message deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting message" });
  }
});

export default router;