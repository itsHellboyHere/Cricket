'use client';
import { addComment } from '../actions/actions';
import { useState } from 'react';
import { CommentWithUser } from '../types';
import Link from 'next/link';
import Image from 'next/image';

export default function CommentSection({
  postId,
  initialComments,
  showAll = false
}: {
  postId: string;
  initialComments: CommentWithUser[];
  showAll?: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    const newComment = await addComment(postId, content);
    setComments(prev => [newComment, ...prev]);
    setContent('');
  };

  const displayedComments = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src="/default-avatar.png"
              alt="Your profile"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 flex gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button 
            type="submit" 
            className="text-blue-500 font-semibold text-sm disabled:opacity-50 px-3 hover:text-blue-600 transition-colors"
            disabled={!content.trim()}
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {displayedComments.map(comment => (
          <div key={comment.id} className="flex gap-3">
            <Link 
              href={`/profile/${comment.user.username}`} 
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={comment.user.image || '/default-avatar.png'}
                  alt={comment.user.username || 'User'}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to default avatar if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/default-avatar.png';
                  }}
                />
              </div>
            </Link>
            <div className="flex-1">
              <div className="text-sm bg-gray-50 rounded-lg p-3">
                <Link 
                  href={`/profile/${comment.user.username}`} 
                  className="font-semibold text-gray-900 hover:text-blue-500 inline-block mr-2"
                >
                  {comment.user.username}
                </Link>
                <span className="text-gray-700">{comment.content}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1 px-1">
                {/* Optional: Add comment timestamp if available */}
                {/* {comment.createdAt && formatDate(comment.createdAt)} */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Comments Link */}
      {/* {!showAll && comments.length > 2 && (
        <Link 
          href={`/posts/${postId}/`}
          className="text-gray-500 text-sm block mt-2 hover:text-blue-500  items-center"
        >
          View all {comments.length} comments
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )} */}
    </div>
  );
}