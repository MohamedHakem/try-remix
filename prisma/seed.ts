import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getPosts } from "~/post";

const prisma = new PrismaClient();

async function seed() {
  const email = "admin@admin.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("admin123456!", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  await createPosts();
  await prisma.quote.deleteMany();
  await Promise.all(
    getQuotes().map((quote, index) => {
      return prisma.quote.create({ data: { userId: user.id, ...quote } });
    })
  );
  await prisma.note.create({
    data: {
      title: "My first note",
      body: "Hello, world!",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function createPosts() {
  await prisma.post.deleteMany();
  const posts = await getPosts();
  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
}
function getQuotes() {
  return [
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Itamar is hands down the best SW engineer I have ever worked with",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Truly unique in his ability for big picture thinking",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Truly unique in his ability for user-centered design",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Truly unique in his ability to be process oriented",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Most importantly, really fun to be around",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Always comes to meetings with a positive energy",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Shows great initiative in wanting to understand end user",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Actively participate and contribute thoughtful insights during user research studies",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Built the company’s first data analysis tool",
    },
    {
      author: "Rohan Sheth",
      role: "Product manager",
      profile: "https://www.linkedin.com/in/rohan-r-sheth",
      text: "Great at communicating ideas and collaborating with everyone",
    },
  ];
}
