"use server"

import { prisma } from "../lib/db"
import { boolean, z } from 'zod';
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { signIn } from "../../auth";
import { AuthError } from 'next-auth';
import { auth } from "../../auth";
import { CommentWithUser } from "../types";


export type State = {
  errors?: {
    title?: string[];
    // content?: string[];
    imageUrl?: string[];
  };
  message?: string | null;
};

const FormSchema=z.object({
title:z.string().min(1,"Title is required"),
// content:z.string().min(1,"Content is required"),
imageUrl: z.string().url("Please provide a valid image URL").or(z.literal("")),

})
export async function createPost(prevState:State,formData:FormData){
    const session= await auth()
    if(!session?.user?.email){
        return{
          message:"Not authenticated"
        }
    }

    const rawData={
        title: formData.get("title"),
        // content:formData.get("content"), 
        imageUrl:formData.get("imageUrl")
    }
   
    const validation=FormSchema.safeParse(rawData)
    if(!validation.success){
      return {
      errors: validation.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
    };
    
    }
    const validatedData = validation.data;
     try {
    // Generate unique slug
    let slug = validatedData.title.replace(/\s+/g, "-").toLowerCase();
    const originalSlug = slug;
    let counter = 1;

    while (await prisma.post.findUnique({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter += 1;
    }

    // Create post
    await prisma.post.create({
      data: {
        title: validatedData.title,
        // content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        slug,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

  
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to create post.",
    };
  }
    revalidatePath("/posts")
    redirect("/posts")
}

const UpadteFormSchema=z.object({
title:z.string(),

})
export async function updatePost(id:string,formData:FormData,){
    const session = await auth()
    if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
    const rawData={
        title:formData.get("title"),
    }

    const result= UpadteFormSchema.parse(rawData)
    const post = await prisma.post.findUnique({
    where: { id },
    select: {
      author: {
        select: {
          email: true
        }
      }
    }
  });

  if (!post || post.author.email !== session.user.email) {
    throw new Error("Unauthorized: You can only edit your own posts");
  }
    await prisma.post.update({
        where:{id},
        data:{
            title:result.title,
        }
    })
    revalidatePath("/posts")
    redirect("/posts")
}
export async function deletePost(id:string){
    // throw new Error('Failed to Delete Invoice');
    await prisma.post.delete({
        where:{id},
    })
    revalidatePath("/posts")
    redirect("/posts")
}


export async function authenticate(
    prevState:string|undefined,
    formData:FormData,
){
    try{
        await signIn('credentials',formData);
    }
    catch(error){
        if (error instanceof AuthError){
            console.log(error)
            switch (error.type){
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    'Something went wrong.'
            }
        }
        throw error
    }
}

export async function toggleLike(postId:string){
  const session= await auth()

  if(!session?.user?.id) throw new Error("Not logged in")
  
    const existingLike= await prisma.like.findFirst({
      where:{
        userId:session.user.id,
        postId
      }
    })
    if(existingLike){
      // Unlike
      await prisma.like.delete({
        where:{id:existingLike.id}
      });
      return{liked:false}
    }else{
      // Like
      await prisma.like.create({
        data:{
          userId:session.user.id,
          postId,
        }
      });
      return {liked:true}
    }
}

export async function addComment(postId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  
  const newComment = await prisma.comment.create({
    data: {
      content,
      userId: session.user.id,
      postId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    }
  });

  // revalidatePath(`/posts/${postId}`);
  revalidatePath(`/posts/${postId}`);
  
  return newComment;
}

export async function getComments(postId: string): Promise<CommentWithUser[]> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
  return comments;
}