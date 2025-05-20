'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/app/ui/button"
import FollowButton from "@/app/components/FollowButton"

export function ProfileHeader({
  user,
  currentUserId,
  followCounts,
  totalPosts,
}: {
  user: {
    id: string;
    name?: string | null;
    username?: string | null;
    image?: string | null;
    bio?: string | null;
  };
  currentUserId?: string | null;
  followCounts: {
    followers: number;
    following: number;
  };
  totalPosts: number;
}) {
  const isCurrentUser = currentUserId === user.id;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10 mb-6">
      {/* Profile Image & Button on Mobile */}
      <div className="flex items-center md:block w-full md:w-auto">
        <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden">
          <Image
            src={user.image || '/default-avatar.png'}
            alt={`${user.name}'s avatar`}
            fill
            className="object-cover"
          />
        </div>

        {/* Button beside image on mobile */}
        <div className="ml-4 md:hidden">
          {isCurrentUser ? (
            <Link href="/settings/profile">
              <Button>Edit Profile</Button>
            </Link>
          ) : (
            <FollowButton userId={user.id} />
          )}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1">
        {/* Desktop: Username & Button */}
        <div className="hidden md:flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-medium">{user.username}</h1>
          {isCurrentUser ? (
            <Link href="/settings/profile">
              <Button>Edit Profile</Button>
            </Link>
          ) : (
            <FollowButton userId={user.id} />
          )}
        </div>

        {/* Mobile: username under image */}
        <div className="md:hidden mt-2">
          <h1 className="text-xl font-semibold">{user.username}</h1>
        </div>

        {/* Name + Bio */}
        <p className="text-gray-500">{user.name}</p>
        {user.bio && <p className="text-gray-700 mt-1">{user.bio}</p>}

        {/* Stats */}
        <div className="flex gap-6 mt-3 text-sm md:text-base">
          <div >
            <span className="font-semibold ">{totalPosts}</span> <span className='text-gray-500'>posts</span>
          </div>
          <div>
            <span className="font-semibold">{followCounts.followers}</span> <span className='text-gray-500'>followers</span>
          </div>
          <div>
            <span className="font-semibold">{followCounts.following}</span> <span className='text-gray-500'>following</span>
          </div>
        </div>
      </div>
    </div>
  );
}
