
import "dotenv/config";
import prisma from "../lib/prisma";

async function seedSettings() {
  const settings = [
    { key: "showSkills", value: "true" },
    { key: "showProjects", value: "true" },
    { key: "showBlog", value: "true" },
    { key: "availableForHire", value: "true" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Feature flags seeded");
}

seedSettings()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });