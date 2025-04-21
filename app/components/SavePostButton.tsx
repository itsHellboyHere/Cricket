'use client'

import { useTransition, useState } from "react";
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid'
import { toggleSave } from '../actions/actions'
import toast from "react-hot-toast";

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
  const [isSaved, setIsSaved] = useState(initiallySaved)
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      try {
        const result = await toggleSave(userId, postId)
        setIsSaved(result.saved)
        
      } catch (error) {
        toast.error("Failed to save the post")
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="p-2 rounded-md hover:bg-gray-100 transition"
    >
      {isSaved ? (
        <BookmarkSolid className="w-6 h-6 text-blue-600" />
      ) : (
        <BookmarkOutline className="w-6 h-6 text-gray-600" />
      )}
    </button>
  )
}
