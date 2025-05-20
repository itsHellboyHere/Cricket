"use client";

import { useState } from "react";
import PostProfile from "./PostProfile";
import styles from "../ui/Postprofile.module.css";
import clsx from "clsx";
import { ImageIcon, BookmarkIcon, TagIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { PostWithRelations } from "../types";

export default function TabbedPostSection({
  posts,
  savedPosts,
  isCurrentUser,
  geistSansClass,
}: {
  posts: PostWithRelations[];      
  savedPosts: PostWithRelations[]; 
  isCurrentUser: boolean;
  geistSansClass: string;
}) {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  console.log("saved post",savedPosts)
  const tabs = [
    { key: "posts", label: "Posts", icon: <ImageIcon size={16} /> },
    ...(isCurrentUser
      ? [{ key: "saved", label: "Saved", icon: <BookmarkIcon size={16} /> }]
      : []),
  ];

  const displayedPosts = activeTab === "posts" ? posts : savedPosts;

  return (
    <div className="w-full">
      <div className="flex justify-center border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "posts" | "saved")}
            className={clsx(
              "px-6 py-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wide",
              activeTab === tab.key
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-black"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* <h2 className={`${styles.sectionTitle} ${geistSansClass} text-center mb-2`}>
        {activeTab === "posts" ? "Recent Posts" : "Saved Posts"}
      </h2> */}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className={styles.postGrid}
        >
          {displayedPosts.map((post) => (
            <PostProfile key={post.id} post={post} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
