import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get('skip') || '0');
  const take = parseInt(searchParams.get('take') || '6');

  const posts = await prisma.post.findMany({
    skip,
    take,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      },
      likes: true,
      savedBy: true,
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              username: true
            }
          }
        }
      }
    }
  });

  return NextResponse.json(posts);
}
