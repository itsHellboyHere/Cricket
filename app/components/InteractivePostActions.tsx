'use client';
import { useState } from 'react';
import LikeButton from './LikeButton';
import Link from 'next/link';

export default function InteractivePostActions({
  postId,
  initialLikes,
  initialComments,
  initialIsLiked
}: {
  postId: string;
  initialLikes: number;
  initialComments: number;
  initialIsLiked:boolean;
}) {
  const [likeCount, setLikeCount] = useState(initialLikes);
  
  return (
    <div className="p-4 ">
      <div className="flex gap-4 mb-2">
        <LikeButton 
          postId={postId}
          initialLikes={initialLikes}
          isLiked={initialIsLiked}
        />
        <Link href={`/posts/${postId}`} className="flex items-center">
          <span className="mr-1">💬</span>
          <span>{initialComments}</span>
        </Link>
      </div>
      {/* <p className="text-sm font-semibold mb-2">{likeCount}</p> */}
    </div>
  );
}