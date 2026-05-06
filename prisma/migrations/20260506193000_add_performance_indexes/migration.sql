CREATE INDEX IF NOT EXISTS "Project_published_createdAt_idx" ON "Project"("published", "createdAt");
CREATE INDEX IF NOT EXISTS "Project_featured_published_createdAt_idx" ON "Project"("featured", "published", "createdAt");
CREATE INDEX IF NOT EXISTS "Message_createdAt_idx" ON "Message"("createdAt");
CREATE INDEX IF NOT EXISTS "Message_isRead_read_createdAt_idx" ON "Message"("isRead", "read", "createdAt");
CREATE INDEX IF NOT EXISTS "Post_published_createdAt_idx" ON "Post"("published", "createdAt");
CREATE INDEX IF NOT EXISTS "Profile_updatedAt_idx" ON "Profile"("updatedAt");
CREATE INDEX IF NOT EXISTS "Skill_category_name_idx" ON "Skill"("category", "name");
