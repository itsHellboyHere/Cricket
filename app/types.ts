import { Post, Like, Comment, User, SavedPost } from "@prisma/client";

export type PostWithRelations = Post & {
  author: Pick<User, 'username'|'name' | 'image'>;
  likes: Like[];
  comments: CommentWithUser[];
  savedBy: SavedPost[]
};

export type CommentWithUser = Comment & {
  user: Pick<User,'username' | 'name' | 'image'>;
};