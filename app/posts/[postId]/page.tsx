import { prisma } from "../../lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../../auth";
import { deletePost } from "../../actions/actions";
import Image from "next/image";
import { BookmarkIcon, EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import CommentSection from "@/app/components/CommentSection"
import InteractivePostActions from "@/app/components/InteractivePostActions";
import PostModal from "@/app/components/PostModal";
import SavePostButton from "@/app/components/SavePostButton";


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
      },
      savedBy: true
    }
  });

  if (!post) return notFound();

  const isAuthor = session?.user?.email === post.author.email;
//   console.log(postId,post)
  const deletePostWithId = deletePost.bind(null, post.id);
  // const isLiked = post.likes.some(like => like.userId === session?.user?.id);
 const isSaved = post.savedBy.some((save:{userId:string})=> save.userId === session?.user?.id)

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
            {isAuthor && <PostModal postId={post.id}/>}
            
          
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
              initialIsLiked={post.likes.some((like:{userId:string}) => like.userId === session?.user?.id)}
            />
               <div className="flex justify-between items-center mt-2">
              <p className="font-semibold text-sm">
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </p>  
              { session?.user && (<SavePostButton
              initiallySaved={isSaved}
              postId={post.id}
              userId={session?.user?.id}
              />)}
            </div>
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
        {/* {isAuthor && (
          <div className=" bottom-0 left-0 right-0 bg-white border-t flex justify-center gap-6 p-3 z-20 shadow-lg">
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
        )} */}
      </div>

     {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center min-h-screen p-4">
        <div className="flex max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          {/* Left Column - Fixed Height Image */}
          <div className="flex-1 flex items-center  justify-center bg-black" style={{ maxHeight: '90vh' }}>
            {post.imageUrl && (
              <div className="relative w-full h-full max-h-[90vh]">
                <Image
                  src={post.imageUrl}
                  fill
                  className="object-contain"
                  alt={post.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
          </div>

          {/* Right Column - Scrollable Content */}
          <div className="flex-1 max-w-md flex flex-col border-l border-gray-200" style={{ maxHeight: '90vh' }}>
            {/* Author Header (Fixed) */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Link 
                href={`/profile/${post.author.username}`}
                className="flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={post.author.image || "/default-avatar.png"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                    alt={post.author.name || "User"}
                  />
                </div>
                <div>
                  <p className="font-semibold group-hover:text-blue-500 transition-colors">
                    {post.author.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </Link>
              {isAuthor && (
                <div className="ml-auto">
                  <PostModal postId={post.id} />
                </div>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-4 ">
              {/* Caption */}
              <div className="border-b border-gray-300">
                <div className="flex items-start space-x-3 mb-4 " >
                  <Link 
                    href={`/profile/${post.author.username}`}
                    className="flex-shrink-0"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                      <Image
                        src={post.author.image || "/default-avatar.png"}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                        alt={post.author.name || "User"}
                      />
                    </div>
                  </Link>
                  <div>
                    <Link 
                      href={`/profile/${post.author.username}`}
                      className="font-semibold hover:text-blue-500 inline-block mr-2"
                    >
                      {post.author.username}
                    </Link>
                    <span className="text-sm whitespace-pre-line">{post.title}</span>
                    {/* <p className="text-xs text-gray-400 mt-1">
                      {new Date(post.createdAt).toLocaleString()}
                    </p> */}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <CommentSection 
                postId={postId} 
                initialComments={post.comments} 
                showAll={true}
              />
            </div>

            {/* Fixed Action Bar */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <InteractivePostActions
                  postId={post.id}
                  initialLikes={post.likes.length}
                  initialComments={post.comments.length}
                  initialIsLiked={post.likes.some((like: {userId: string}) => like.userId === session?.user?.id)}
                />
                {session?.user && (
                  <SavePostButton
                    initiallySaved={isSaved}
                    postId={post.id}
                    userId={session.user.id}
                  />
                )}
              </div>
              <p className="font-semibold text-sm mb-3">
                {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}