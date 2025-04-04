'use client';
import { useEffect, useState } from 'react';
import { getComments } from '../actions/actions';
import { CommentWithUser } from '../types';
import CommentSection from './CommentSection';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FullPageComments({ postId }: { postId: string }) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        const loadedComments = await getComments(postId);
        setComments(loadedComments);
      } catch (err) {
        setError('Failed to load comments');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadComments();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <p>Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="max-w-2xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center">
          <Link href={`/posts/`} className="mr-4">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="text-xl font-semibold">Comments</h2>
        </div>

        {/* Comments */}
        <div className="flex-1 overflow-y-auto p-4">
          <CommentSection 
            postId={postId} 
            initialComments={comments} 
            showAll
          />
        </div>
      </div>
    </div>
  );
}