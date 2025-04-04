import Image from "next/image";
import InteractivePostActions from "./InteractivePostActions";
import { PostWithRelations } from "../types";
import Link from "next/link";
import { auth } from "@/auth";
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import styles from "../ui/post.module.css"
export default async function PostCard({ post }: { post: PostWithRelations }) {
  const session = await auth();

  return (
    <div className={styles.card}>

      <div className="flex flex-row bg-gray-100  px-4 py-2">
        <Image
          src={post.author.image || "/default-avatar.png"}
          width={35}
          height={25}
          className="rounded-full mr-3"
          alt={post.author.name || "User"}
        />
        <div className="">
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>


      </div>
      {post.imageUrl && (
        <div className={`relative bg-gray-100 aspect-square`}>
       
          <Link href={`/posts/${post.id}`}>
            <Image
              src={post.imageUrl}
              fill
              className="object-cover"
              alt={post.title}
              sizes="(max-width: 768px) 100vw, 50vw"

            />
          </Link>
          <div className={styles.hoverOverlay}>
            <Link href={`/posts/${post.id}`} className={styles.dynamicLink}>
              View Details
            </Link>
          </div>
        </div>
      )}

      <InteractivePostActions
        postId={post.id}
        initialLikes={post.likes.length}
        initialComments={post.comments.length}
        initialIsLiked={post.likes.some(like => like.userId === session?.user?.id)}
      />
      {/* Title */}
      <div className="px-4 pb-2">
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.author.name}</span>
          {post.title}
        </p>
      </div>
      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="px-4 pb-2">
          {post.comments.length > 2 ? (
            <>
              {/* <div className="space-y-1 mb-1">
                {post.comments.slice(0, 2).map((comment) => (
                  <div key={comment.id} className="flex items-start text-sm">
                    <span className="font-semibold mr-2">
                      {comment.user.name}
                    </span>
                    <span>{comment.content}</span>
                  </div>
                ))}
              </div> */}
              <Link
                href={`/posts/${post.id}`}
                className="relative text-gray-500 text-sm hover:text-white hover:bg-blue-500 hover:px-2 hover:rounded transition-all duration-200"
              >
                View all {post.comments.length} comments
              </Link>
            </>
          ) : (
            <div className="space-y-1">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start text-sm">
                  <span className="font-semibold mr-2">
                    {comment.user.name}
                  </span>
                  <span>{comment.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}