import express from "express";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import projectRoutes from "./routes/project.routes";

const app = express();

app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.get("/admin/test", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized admin ✅" });
});

app.use("/projects", projectRoutes);
app.use("/project", projectRoutes);

export default app;