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
    setIsLoading(true);
    try {
      const { liked } = await toggleLike(postId);
      setIsLiked(liked);
      setLikes(prev => liked ? prev + 1 : prev - 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-1"
    >
      {isLiked ? '❤️' : '🤍'} {likes}
    </button>
  );
}