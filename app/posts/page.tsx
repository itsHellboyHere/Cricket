
import { prisma } from "../lib/db"

import { Suspense } from "react";
import PostCard from "../components/PostCard";

import styles from "../ui/post.module.css"
import { auth } from "@/auth";
import { PostWithRelations } from "../types";
function PostSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="grid  gap-y-3 w-full p-4 border border-black/10 rounded-lg animate-pulse h-64"
        > 
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex-grow bg-gray-200 rounded"></div>
        </div>
      ))}
    </>
  );
}
async function PostsList({ currentUserId }: { currentUserId?: string }) {
  
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          username:true,
        }
      },
      likes: true,
      comments: {
        // take:3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              username:true,
            }
          }
        }
      },
      savedBy:true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <>
      {posts.map((post:PostWithRelations) => (
        <PostCard key={post.id} post={post}  currentUserId={currentUserId}  />
      ))}
    </>
  );
}

export default async function PostsPage() {
  const postCount = await prisma.post.count();
  const session = await auth()
  // console.log('Session user ID:', session?.user?.id);
  return (
    <main className={styles.container}>
      {/* <h1 className="text-3xl font-semibold ">All Posts</h1> */}
      <Suspense fallback={<PostSkeleton count={postCount}/>}>
            <PostsList  currentUserId={session?.user?.id}/>
          
      </Suspense>
    </main>
  )
}