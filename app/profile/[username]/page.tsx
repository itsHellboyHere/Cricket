import { getFollowersCount, getFollowingCount } from "@/app/actions/actions";
import { ProfileHeader } from "@/app/components/ProfileHeader";
import { prisma } from "@/app/lib/db"
import { Button } from "@/app/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import styles from "../../ui/Postprofile.module.css"
import PostProfile from "@/app/components/PostProfile";
import { Geist } from "next/font/google";
import FollowButton from "@/app/components/FollowButton";
import TabbedPostSection from "@/app/components/TabbedPostSection";
import { PostWithRelations } from "@/app/types";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

async function getFollowCounts(userId: string) {
  try {
    const [followers, following] = await Promise.all([
      getFollowersCount(userId),
      getFollowingCount(userId)
    ]);

    return {
      followers,
      following
    };
  } catch (error) {
    console.error("Error fetching follow counts:", error);
    return { followers: 0, following: 0 };
  }
}

export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const { username } = await props.params;
  // const username = params.username
  const session = await auth()
  // console.log("session ", session?.user)s
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: {
          likes: true,
          comments: {
            orderBy: { createdAt: 'desc' },
            include: {
              user: {
                select: {
                  username: true,
                  name: true,
                  image: true,
                }
              }
            }
          },
          author: {
            select: { username: true, name: true, image: true }
          },
          savedBy: true
        }
      }
    }
  });

  if (!user) return <div>User Not found</div>;
  const isCurrentUser = session?.user?.id === user.id;
  const followCounts = await getFollowCounts(user.id);
  const totalPosts = user.posts.length;
  let savedPosts: PostWithRelations[] = [];

  if (isCurrentUser) {
    const savedPostsRaw = await prisma.savedPost.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        post: {
          include: {
            likes: true,
            comments: {
              orderBy: { createdAt: 'desc' },
              include: {
                user: {
                  select: {
                    username: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
            author: {
              select: { username: true, name: true, image: true },
            },
            savedBy: true,
          },
        },
      },
    });
    savedPosts = savedPostsRaw.map((saved) => saved.post)
  }
   
    
  
  return (
    <main className={styles.container}>
      <ProfileHeader
        user={user}
        currentUserId={session?.user?.id || null}
        followCounts={followCounts}
        totalPosts={totalPosts}
      />


      {/* <div className={styles.postGridWrap}>
        <h2 className={`${styles.sectionTitle} ${geistSans.variable}`}>Recent Posts</h2>
        <div className={styles.postGrid}>
          {user.posts.map((post: any) => (
            <PostProfile key={post.id} post={post} />
          ))}
        </div>
      </div> */}
      <TabbedPostSection
        posts={user.posts}
        savedPosts={savedPosts}
        isCurrentUser={isCurrentUser}
        geistSansClass={geistSans.variable}
      />
    </main>
  );
}
