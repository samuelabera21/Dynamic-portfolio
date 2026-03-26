import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  (async () => {
    const user = (req as any).user;
    const userId = user?.userId;

    if (!userId) {
      return res.status(403).json({ message: "Access denied (admin only)" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied (admin only)" });
    }

    next();
  })().catch((error) => {
    console.error(error);
    return res.status(500).json({ message: "Authorization check failed" });
  });
};