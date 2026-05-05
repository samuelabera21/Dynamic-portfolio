import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import projectRoutes from "./routes/project.routes";
import messageRoutes from "./routes/message.routes";
import postRoutes from "./routes/post.routes";
import profileRoutes from "./routes/profile.routes";
import skillRoutes from "./routes/skill.routes";
import prisma from "./lib/prisma";


import homeRoutes from "./routes/home.routes";
import settingsRoutes from "./routes/settings.routes";

import adminRoutes from "./routes/admin.routes";







const app = express();

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again shortly." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

const messageLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many messages sent. Please wait and try again." },
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_FRONTEND_URL,
  "http://localhost:3001",
].filter((origin): origin is string => Boolean(origin));

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(apiLimiter);

app.get("/health", async (req, res) => {
  const shouldCheckDb = req.query.db === "1";
  const connectionString = process.env.DATABASE_URL ?? "";
  const usingPooler =
    connectionString.includes("-pooler.") || connectionString.includes("pooler.neon.tech");

  if (!shouldCheckDb) {
    return res.json({
      status: "ok",
      service: "portfolio-backend",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      neonPoolerDetected: usingPooler,
      dbChecked: false,
    });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.json({
      status: "ok",
      service: "portfolio-backend",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      neonPoolerDetected: usingPooler,
      dbChecked: true,
    });
  } catch (error) {
    return res.status(503).json({
      status: "degraded",
      service: "portfolio-backend",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      neonPoolerDetected: usingPooler,
      dbChecked: true,
      message: "Database unavailable",
    });
  }
});

// routes
app.use("/auth", authLimiter, authRoutes);
app.get("/admin/test", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized admin ✅" });
});

app.use("/projects", projectRoutes);
app.use("/project", projectRoutes);
app.use("/messages", messageLimiter, messageRoutes);
app.use("/posts", postRoutes);
app.use("/profile", profileRoutes);
app.use("/skills", skillRoutes);



app.use("/home", homeRoutes);
app.use("/settings", settingsRoutes);
app.use("/admin", adminRoutes);


export default app;