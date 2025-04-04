import { Prisma, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding...`);

  const hashedPassword = await bcrypt.hash('ahshshjjsk', 10);

  const posts: Prisma.PostCreateInput[] = [
    {
      title: "Post 1",
      slug: "post-1-2",
      content: "This is my first Post.",
      author: {
        connectOrCreate: {
          where: {
            email: "john@gmail.com"
          },
          create: {
            email: "john@gmail.com",
            password: hashedPassword, 
          },
        }
      }
    }
  ];

  for (const post of posts) {
    const newPost = await prisma.post.create({
      data: post,
    });
    console.log(`Created post with id: ${newPost.id}`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
