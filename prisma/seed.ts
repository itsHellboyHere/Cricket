// scripts/updateUsernames.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { username: null },
    select: { id: true, email: true, name: true }
  });

  for (const user of users) {
    let username = '';
    
    if (user.email) {
      // Generate from email
      username = user.email.split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_');
    } else if (user.name) {
      // Generate from name
      username = user.name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');
    } else {
      // Fallback to user ID
      username = `user_${user.id.substring(0, 8)}`;
    }

    // Ensure uniqueness
    let uniqueUsername = username;
    let counter = 1;
    
    while (true) {
      const exists = await prisma.user.findFirst({
        where: { username: uniqueUsername }
      });
      
      if (!exists) break;
      uniqueUsername = `${username}_${counter++}`;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { username: uniqueUsername }
    });
    
    console.log(`Updated ${user.email || user.id}: ${uniqueUsername}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });