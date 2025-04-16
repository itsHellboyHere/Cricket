import { Post, Like, Comment, User } from "@prisma/client";

export type PostWithRelations = Post & {
  author: Pick<User, 'username'|'name' | 'image'>;
  likes: Like[];
  comments: CommentWithUser[];
  
};

export type CommentWithUser = Comment & {
  user: Pick<User,'username' | 'name' | 'image'>;
};