import express from "express";
import authRoutes from "./routes/auth.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import projectRoutes from "./routes/project.routes";
import messageRoutes from "./routes/message.routes";
import postRoutes from "./routes/post.routes";
import profileRoutes from "./routes/profile.routes";
import skillRoutes from "./routes/skill.routes";


import homeRoutes from "./routes/home.routes";
import settingsRoutes from "./routes/settings.routes";

import adminRoutes from "./routes/admin.routes";







const app = express();

app.use(express.json({ limit: "20mb" }));

// routes
app.use("/auth", authRoutes);
app.get("/admin/test", authMiddleware, (req, res) => {
  res.json({ message: "You are authorized admin ✅" });
});

app.use("/projects", projectRoutes);
app.use("/project", projectRoutes);
app.use("/messages", messageRoutes);
app.use("/posts", postRoutes);
app.use("/profile", profileRoutes);
app.use("/skills", skillRoutes);



app.use("/home", homeRoutes);
app.use("/settings", settingsRoutes);
app.use("/admin", adminRoutes);


export default app;