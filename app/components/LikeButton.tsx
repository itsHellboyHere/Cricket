'use client';
import { useState } from 'react';
import { toggleLike } from '../actions/actions';

export default function LikeButton({
  postId,
  initialLikes,
  isLiked: initialIsLiked
}: {
  postId: string;
  initialLikes: number;
  isLiked: boolean;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { liked } = await toggleLike(postId);
      setIsLiked(liked);
      setLikes(prev => liked ? prev + 1 : prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  
  const formatLikes = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
        isLiked 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-500 hover:bg-gray-100'
      } ${isLoading ? 'opacity-70' : ''}`}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></span>
      ) : isLiked ? (
        <span className="text-red-500">❤️</span>
      ) : (
        <span className="text-gray-500">🤍</span>
      )}
      <span className="text-sm font-medium">
        {formatLikes(likes)}
      </span>
    </button>
  );
}