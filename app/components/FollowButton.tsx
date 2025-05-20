'use client'

import { useEffect, useState } from "react"
import { getFollowStatus, toggleFollow } from "../actions/actions"
import { motion, AnimatePresence } from "framer-motion"

interface FollowButtonProps {
  userId: string
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await getFollowStatus(userId)
      setIsFollowing(status)
    }
    fetchStatus()
  }, [userId])

  const handleToggle = async () => {
    setLoading(true)
    const result = await toggleFollow(userId)
    if (result?.isFollowing !== undefined) {
      setIsFollowing(result.isFollowing)
    }
    setLoading(false)
  }

  if (isFollowing === null) {
    return (
      <button className="px-4 py-2 rounded-md bg-gray-200 animate-pulse w-28 h-10" disabled />
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative px-4 py-2 rounded-md font-medium text-white transition-colors duration-300
        ${isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
        disabled:opacity-50`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={loading ? "loading" : isFollowing ? "unfollow" : "follow"}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
