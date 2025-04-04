import { Post, Like, Comment, User } from "@prisma/client";

export type PostWithRelations = Post & {
  author: Pick<User, 'name' | 'image'>;
  likes: Like[];
  comments: CommentWithUser[];
  
};

export type CommentWithUser = Comment & {
  user: Pick<User, 'name' | 'image'>;
};