'use client';
import { addComment } from '../actions/actions';
import { useState } from 'react';
import { CommentWithUser } from '../types';
import Link from 'next/link';

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
    <div>
      {displayedComments.map(comment => (
        <div key={comment.id} className="mb-2 text-sm">
          <span className="font-medium mr-2 text-gray-700">{comment.user.username}</span>
          {comment.content}
        </div>
      ))}

      {!showAll && comments.length > 2 && (
        <Link 
          href={`/posts/${postId}/`}
          className="text-gray-500 text-sm block mb-2"
        >
          View all {comments.length} comments
        </Link>
      )}
      
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded text-sm"
          required
        />
        <button 
          type="submit" 
          className="text-blue-500 font-semibold text-sm disabled:opacity-50"
          disabled={!content.trim()}
        >
          Post
        </button>
      </form>
    </div>
  );
}