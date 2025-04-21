import Image from "next/image";
import InteractivePostActions from "./InteractivePostActions";
import { PostWithRelations } from "../types";
import Link from "next/link";

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import styles from "../ui/post.module.css";
import SavePostButton from "./SavePostButton";

export default async function PostCard({ post, currentUserId }: { 
  post: PostWithRelations,
  currentUserId?: string 
}) {
  
  const isSaved = currentUserId 
  ? post.savedBy?.some(save => save.userId === currentUserId) 
  : false;
//   console.log('Save button should render:', {
//   hasUserId: Boolean(currentUserId),
//   isSaved
// });
  return (
    <div className={styles.card}>
      <div className="flex flex-row bg-gray-100 px-4 py-2 items-center">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 mr-2">
        <Link href={`/profile/${post.author.username}`} className="hover:opacity-80 transition-opacity">
          <Image
            src={post.author.image || "/default-avatar.png"}
            width={35}
            height={35}
            className="w-full h-full object-cover"
            alt={post.author.name || "User"}
          />
        </Link>
        </div>
        <div className="flex-1">
          <Link 
            href={`/profile/${post.author.username}`}
            className="font-semibold hover:underline"
          >
            {post.author.name}
          </Link>
          <p className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </button>
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

    {/* Post actions (like, comment, save) */}
      <div className="flex justify-between ">
        <InteractivePostActions
          postId={post.id}
          initialLikes={post.likes.length}
          initialComments={post.comments.length}
          initialIsLiked={post.likes.some(like => like.userId === currentUserId)}
        />
        
        {currentUserId && (
          <SavePostButton 
            postId={post.id}
            userId={currentUserId}
            initiallySaved={isSaved}
          />
        )}
      </div>
      {/* Title */}
      <div className="px-4 pb-2">
        <p className="text-sm">
          <Link 
            href={`/profile/${post.author.username}`}
            className="font-semibold mr-2 hover:underline"
          >
            {post.author.name}
          </Link>
          {post.title}
        </p>
      </div>
      
      {/* Comments */}
      {post.comments.length > 0 && (
        <div className="px-4 pb-2">
          {post.comments.length > 2 ? (
            <>
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
                  <Link 
                    href={`/profile/${comment.user.username}`}
                    className="font-semibold mr-2 hover:underline"
                  >
                    {comment.user.name}
                  </Link>
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