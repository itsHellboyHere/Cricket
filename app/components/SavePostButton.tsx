'use client'

import { useOptimistic, useTransition } from 'react'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import { toggleSave } from '../actions/actions'
type SavePostButtonProps = {
  postId: string
  userId: string
  initiallySaved: boolean
}

export default function SavePostButton({
  postId,
  userId,
  initiallySaved
}: SavePostButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticSaved, addOptimisticSaved] = useOptimistic(
    initiallySaved,
    (_, newSaved:boolean) => newSaved
  )

  const handleClick = async () => {
    startTransition(async () => {

      addOptimisticSaved(!optimisticSaved)
      
      // Real server action
      const result = await toggleSave(userId, postId)
      

    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="p-2 rounded-full hover:bg-gray-100 relative"
      aria-label={optimisticSaved ? "Unsave post" : "Save post"}
    >
      {optimisticSaved ? (
        <BookmarkSolid className="h-5 w-5 text-blue-500" />
      ) : (
        <BookmarkOutline className="h-5 w-5" />
      )}
      
      {/* Loading spinner */}
      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></span>
        </span>
      )}
    </button>
  )
}