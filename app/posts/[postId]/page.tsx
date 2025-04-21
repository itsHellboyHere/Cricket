import { prisma } from "../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../../auth";
import { deletePost } from "../../actions/actions";
import Image from "next/image";
import { BookmarkIcon, EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import CommentSection from "@/app/components/CommentSection"
import InteractivePostActions from "@/app/components/InteractivePostActions";


export default async function PostPage(props:{params:Promise<{postId:string}>}) {
  const session = await auth();
  const { postId } = await props.params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      likes: true,
      comments: {
        include: {
          user: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!post) return notFound();

  const isAuthor = session?.user?.email === post.author.email;
//   console.log(postId,post)
  const deletePostWithId = deletePost.bind(null, post.id);
  // const isLiked = post.likes.some(like => like.userId === session?.user?.id);
 

  return (
    <main className="min-h-screen ">
      {/* Mobile View - Single Column */}
      <div className="md:hidden">
        {/* Post Header */}
        <div className="bg-white p-3 border-b flex items-center sticky top-0 z-10 backdrop-blur-sm ">
          <Link href="/posts" className="mr-2 p-1 hover:bg-gray-100 rounded-full">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex-1 text-center font-semibold">Post</div>
        </div>

        {/* Post Content */}
        <div className="bg-white mb-2 rounded-lg shadow-sm mx-2 mt-2">
          {/* Author Info with Enhanced Avatar */}
          <div className="flex items-center p-3">
            <Link 
              href={`/profile/${post.author.username}`}
              className="group relative flex-shrink-0"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={post.author.image || "/default-avatar.png"}
                  width={40}
                  height={40}
                  className="border border-white w-full h-full object-cover"
                  alt={post.author.name || "User"}
                 
                />
              </div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                View Profile
              </span>
            </Link>
            <div className="flex-1 ml-3">
              <Link 
                href={`/profile/${post.author.username}`}
                className="font-semibold hover:text-blue-500 transition-colors"
              >
                {post.author.username}
              </Link>
              <p className="text-gray-500 text-xs">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                
                })}
              </p>
            </div>
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={post.imageUrl}
                fill
                className="object-cover"
                alt={post.title}
                sizes="100vw"
                priority
              />
            </div>
          )}

          {/* Actions */}
          <div className="p-4">
            <InteractivePostActions
              postId={post.id}
              initialLikes={post.likes.length}
              initialComments={post.comments.length}
              initialIsLiked={post.likes.some(like => like.userId === session?.user?.id)}
            />
            
            {/* Caption & Date */}
            <div className="mt-2">
              <p className="text-sm whitespace-pre-line">
                <Link 
                  href={`/profile/${post.author.username}`}
                  className="font-semibold hover:text-blue-500 mr-2"
                >
                  {post.author.username}
                </Link>
                {post.title}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm mx-2 mb-16">
          <CommentSection 
            postId={postId} 
            initialComments={post.comments} 
            showAll={true}
          />
        </div>

        {/* Author Actions */}
        {isAuthor && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-center gap-6 p-3 z-20 shadow-lg">
            <Link 
              href={`/posts/${post.id}/edit`}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <PencilSquareIcon className="h-5 w-5" />
              <span>Edit</span>
            </Link>
            <form action={deletePostWithId} className="flex items-center gap-2 text-red-500 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              <button type="submit">
                <TrashIcon className="h-5 w-5" />
                <span>Delete</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop View - Enhanced Split Screen */}
      <div className="hidden md:block">
        {/* Desktop Header */}
        <div className="max-w-5xl mx-auto py-4 px-6 flex items-center ">
          <Link href="/posts" className="flex items-center text-blue-500 hover:text-blue-700">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Posts</span>
          </Link>
          <h1 className="text-xl font-semibold ml-6">Post Details</h1>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 min-h-[calc(100vh-72px)]">
          {/* Left Column - Post Image  */}
          <div className="bg-white flex items-center justify-center p-8 ">
            {post.imageUrl && (
              <div className="relative w-full max-w-lg aspect-square shadow-md rounded-lg overflow-hidden">
                <Image
                  src={post.imageUrl}
                  fill
                  className="object-cover"
                  alt={post.title}
                  sizes="50vw"
                  priority
                />
              </div>
            )}
          </div>

          {/* Right Column - Post Details & Comments */}
          <div className="bg-white flex flex-col h-full">
            {/* Post Header */}
            <div className="p-4  flex items-center">
              <Image
                src={post.author.image || "/default-avatar.png"}
                width={40}
                height={40}
                className="rounded-full mr-3"
                alt={post.author.name || "User"}
              />
              <div className="flex-1">
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
              {isAuthor && (
                <div className="flex gap-4">
                  <Link 
                    href={`/posts/${post.id}/edit`}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit Post"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Link>
                  <form action={deletePostWithId}>
                    <button 
                      type="submit" 
                      className="text-red-500 hover:text-red-700"
                      title="Delete Post"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="p-4 border-b-2">
              <p className="text-sm whitespace-pre-line">
                <span className="font-semibold mr-2">{post.author.name}</span>
                {post.title}
              </p>
            </div>

            {/* Likes and Actions */}
            <div className="p-4 border-b-2 mb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {/* <button className="p-1 hover:bg-gray-100 rounded-full">
                    <HeartIcon className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-red-500' : ''}`} />
                  </button> */}
                    <InteractivePostActions
                          postId={post.id}
                          initialLikes={post.likes.length}
                          initialComments={post.comments.length}
                          initialIsLiked={post.likes.some(like => like.userId === session?.user?.id)}
                        />
                  {/* <button 
      className="p-1 hover:bg-gray-100 rounded-full"
    >
      <ChatBubbleOvalLeftIcon className="h-6 w-6" />
    </button> */}
                </div>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <BookmarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="font-semibold text-sm mt-2">
                {/* {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'} */}
               
              </p>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto " id="comment-section">
              <CommentSection 
                postId={postId} 
                initialComments={post.comments} 
                showAll={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}