
import { ProfileHeader } from "@/app/components/ProfileHeader";
import { prisma } from "@/app/lib/db"
import { Button } from "@/app/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import styles from "../../ui/Postprofile.module.css"
import PostProfile from "@/app/components/PostProfile";
import { Geist } from "next/font/google";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})
export default async function ProfilePage(props: { params: Promise<{ username: string }> }){
    const {username}= await props.params;
    // const username = params.username
    const session = await auth()
    // console.log("session ", session?.user)s
    const user = await prisma.user.findUnique({
        where:{username},
        include:{
            posts:{
                orderBy:{createdAt:'desc'},
                include:{
                   likes:true,
                   comments:{
                    orderBy: { createdAt: 'desc' },
                    include:{
                        user:{
                            select:{
                                username:true,
                                name:true,
                                image:true,
                            }
                        }
                    }
                   },
                   author:{
                    select:{username:true,name:true,image:true}
                   }
                }
            }
        }
    });

    if (!user) return<div>User Not found</div>;
    const isCurrentUser = session?.user?.id===user.id;
   return (
    <main className={styles.container}>
      <ProfileHeader user={user} />

      {isCurrentUser && (
        <div className={styles.editButtonWrap}>
          <Link href={"/settings/profile"}>
            <Button>Edit Profile</Button>
          </Link>
        </div>
      )}

      <div className={styles.postGridWrap}>
        <h2 className={`${styles.sectionTitle} ${geistSans.variable}`}>Recent Posts</h2>
        <div className={styles.postGrid}>
          {user.posts.map((post) => (
            <PostProfile key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}