const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const seedUsers = require("../seed/users.seed.js");
const seedProducts = require("../seed/products.seed.js");
const seedComments = require("../seed/comments.seed.js");
const seedLikes = require("../seed/likes.seed.js");

async function runAllSeeds() {
  console.log("Starting the seeding process...");

  try {
    await prisma.$connect();
    console.log("Database connected!");

    // Deleting old data
    console.log("Deleting old data...");
    await prisma.likes.deleteMany({});
    await prisma.comments.deleteMany({});
    await prisma.products.deleteMany({});
    await prisma.users.deleteMany({});
    console.log("Old data deleted!");

    // Seeding new data
    await seedUsers();
    console.log("Users seeded!");

    await seedProducts();
    console.log("Products seeded!");

    await seedComments();
    console.log("Comments seeded!");

    await seedLikes();
    console.log("Likes seeded!");

    console.log("🌱 All seed data inserted!");
  } catch (e) {
    console.error("❌ Error seeding data:", e);
  } finally {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  }
}

runAllSeeds();
