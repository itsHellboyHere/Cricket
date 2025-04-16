import { prisma } from "../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../../auth";
import { deletePost } from "../../actions/actions";
import Image from "next/image";
import { HeartIcon, BookmarkIcon, EllipsisHorizontalIcon, ChatBubbleOvalLeftIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import CommentSection from "@/app/components/CommentSection"
import LikeButton from "@/app/components/LikeButton";
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
  const isLiked = post.likes.some(like => like.userId === session?.user?.id);
 

  return (
    <main className="min-h-screen ">
      {/* Mobile View - Single Column */}
      <div className="md:hidden mx-auto py-4 px-6">
        {/* Post Header */}
        <div className="bg-white p-3 border-b flex items-center sticky top-0 z-10">
          <Link href="/posts" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex-1 text-center font-semibold">Post</div>
        </div>

        {/* Post Content */}
        <div className="bg-white mb-2">
          {/* Author Info */}
          <div className="flex items-center p-3 ">
            <Image
              src={post.author.image || "/default-avatar.png"}
              width={32}
              height={32}
              className="rounded-full mr-3"
              alt={post.author.name || "User"}
            />
            <div className="flex-1">
              <p className="font-semibold">{post.author.name}</p>
            </div>
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </div>

          {/* Post Image */}
          {post.imageUrl && (
            <div className="relative aspect-square bg-gray-100 rounded">
              <Image
                src={post.imageUrl}
                fill
                className="object-cover"
                alt={post.title}
                sizes="100vw"
              />
            </div>
          )}

          {/* Actions */}
          <div className="p-3">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-4">
                {/* <button>
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
              <BookmarkIcon className="h-6 w-6" />
              
            </div>
            {/* Caption && date */}
                   <div className="flex-1 mb-4">
                {/* <p className="font-semibold">{post.author.name}</p> */}
                <p className="text-gray-500 text-xs mb-4">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                 <p className="text-sm whitespace-pre-line">
                <span className="font-semibold mr-2">{post.author.username}</span>
                {post.title}
              </p>
              </div>
          </div>
         
           {/* Caption */}
            {/* <div className="border-b-2 mb-4">
              <p className="text-sm whitespace-pre-line">
                <span className="font-semibold mr-2">{post.author.username}</span>
                {post.title}
              </p>
            </div> */}
        </div>

        {/* Full Comments Section */}
        <div className="bg-white ">
          {post.comments.length >0 &&(<p className="text-gray-500">Comments</p>)}
          <CommentSection 
            postId={postId} 
            initialComments={post.comments} 
            showAll={true}
          />
        </div>

        {/* Author Actions */}
        {isAuthor && (
          <div className="flex gap-4  justify-center p-4 bg-white  sticky bottom-0 z-10">
            <Link 
              href={`/posts/${post.id}/edit`}
              className="flex items-center gap-1 text-blue-500"
            >
              <PencilSquareIcon className="h-5 w-5" />
              <span>Edit</span>
            </Link>
            
            <form action={deletePostWithId} className="flex items-center gap-1 text-red-500">
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