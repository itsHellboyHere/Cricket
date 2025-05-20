'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import PostCard from './PostCard';
import { PostWithRelations } from '../types';

export default function InfinitePosts({ currentUserId }: { currentUserId?: string }) {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const take = 6;

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch(`/api/posts?skip=${page * take}&take=${take}`);
    const newPosts = await res.json();
    setPosts(prev => [...prev, ...newPosts]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const lastPostElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  return (
    <div className="space-y-4">
      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <div key={post.id} ref={isLast ? lastPostElementRef : null}>
            <PostCard post={post} currentUserId={currentUserId} />
          </div>
        );
      })}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
    </div>
  );
}
